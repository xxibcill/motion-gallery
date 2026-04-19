/**
 * @fileoverview Registry verification script
 *
 * Runs an end-to-end installability verification by:
 * - validating generated registry output
 * - creating a fresh fixture project via shadcn create
 * - serving the generated registry over HTTP
 * - smoke-testing direct URL installation
 * - installing every pilot item via hosted namespaced registry URLs
 * - asserting installed files, dependencies, and TypeScript compilation
 *
 * Run: pnpm verify:registry
 */

import { spawn, spawnSync } from "child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_ROOT = join(__dirname, "..", "..");
const PUBLIC_DIR = join(REGISTRY_ROOT, "public");
const PUBLIC_R_DIR = join(PUBLIC_DIR, "r");
const NAMESPACED_PUBLIC_R_DIR = join(PUBLIC_R_DIR, "@motion-gallery");
const NAMESPACE = "@motion-gallery";

interface RegistryFileEntry {
  path: string;
  type: string;
  content?: string;
  target?: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  files: RegistryFileEntry[];
}

interface RegistryIndex {
  $schema?: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

interface VerificationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

interface StaticServerHandle {
  baseUrl: string;
  close: () => Promise<void>;
}

function runCommand(command: string, args: string[], cwd: string): void {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "pipe",
    encoding: "utf-8",
  });

  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(
      `Command failed (${command} ${args.join(" ")}):\n${detail || "No output"}`
    );
  }
}

function parseDependencyName(specifier: string): string {
  if (specifier.startsWith("@")) {
    const atIndex = specifier.lastIndexOf("@");
    return atIndex > 0 ? specifier.slice(0, atIndex) : specifier;
  }

  const [name] = specifier.split("@");
  return name;
}

function expectedInstallPath(file: RegistryFileEntry): string {
  if (file.target) {
    return file.target;
  }

  if (file.path.startsWith("registry/")) {
    return file.path.slice("registry/".length);
  }

  return file.path;
}

async function startStaticServer(rootDir: string): Promise<StaticServerHandle> {
  const serverScript = `
    const { spawn } = require("child_process");
    const { existsSync, readFileSync } = require("fs");
    const { createServer } = require("http");
    const { extname, isAbsolute, relative, resolve } = require("path");

    const rootDir = resolve(process.argv[1]);

    function getContentType(filePath) {
      if (extname(filePath) === ".json") {
        return "application/json; charset=utf-8";
      }
      if (extname(filePath) === ".js") {
        return "text/javascript; charset=utf-8";
      }
      return "text/plain; charset=utf-8";
    }

    function ensureInsideRoot(candidatePath) {
      const relativePath = relative(rootDir, candidatePath);
      return !relativePath.startsWith("..") && !isAbsolute(relativePath);
    }

    const server = createServer((request, response) => {
      if (!request.url) {
        response.writeHead(400);
        response.end("Missing URL");
        return;
      }

      const pathname = new URL(request.url, "http://127.0.0.1").pathname;
      const filePath = resolve(rootDir, \`.\${pathname}\`);

      if (!ensureInsideRoot(filePath)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
      }

      if (!existsSync(filePath)) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, { "Content-Type": getContentType(filePath) });
      response.end(readFileSync(filePath));
    });

    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      process.stdout.write(JSON.stringify({ port: address.port }) + "\\n");
    });

    process.on("SIGTERM", () => {
      server.close(() => process.exit(0));
    });
  `;

  const child = spawn(process.execPath, ["-e", serverScript, resolve(rootDir)], {
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  const baseUrl = await new Promise<string>((resolvePromise, rejectPromise) => {
    let stdout = "";

    const handleError = (error: Error) => {
      cleanup();
      rejectPromise(error);
    };

    const handleExit = (code: number | null) => {
      cleanup();
      const detail = stderr.trim();
      rejectPromise(
        new Error(
          detail || `Static registry server exited before startup (code ${code ?? "unknown"}).`
        )
      );
    };

    const handleStdout = (chunk: Buffer) => {
      stdout += chunk.toString();
      const newlineIndex = stdout.indexOf("\n");

      if (newlineIndex === -1) {
        return;
      }

      cleanup();

      const line = stdout.slice(0, newlineIndex).trim();

      try {
        const parsed = JSON.parse(line) as { port?: number };
        if (!parsed.port) {
          throw new Error(`Missing port in static server output: ${line}`);
        }

        resolvePromise(`http://127.0.0.1:${parsed.port}`);
      } catch (error) {
        rejectPromise(error instanceof Error ? error : new Error(String(error)));
      }
    };

    const cleanup = () => {
      child.off("error", handleError);
      child.off("exit", handleExit);
      child.stdout.off("data", handleStdout);
    };

    child.on("error", handleError);
    child.on("exit", handleExit);
    child.stdout.on("data", handleStdout);
  });

  return {
    baseUrl,
    close: () =>
      new Promise<void>((resolvePromise, rejectPromise) => {
        if (child.exitCode !== null) {
          resolvePromise();
          return;
        }

        child.once("exit", () => {
          resolvePromise();
        });

        const killed = child.kill("SIGTERM");
        if (!killed) {
          rejectPromise(new Error("Failed to stop static registry server."));
        }
      }),
  };
}

function readRegistryIndex(): RegistryIndex {
  const indexPath = join(PUBLIC_R_DIR, "index.json");
  const namespacedIndexPath = join(NAMESPACED_PUBLIC_R_DIR, "index.json");

  if (!existsSync(indexPath)) {
    throw new Error(`Missing generated registry index: ${indexPath}`);
  }

  if (!existsSync(namespacedIndexPath)) {
    throw new Error(`Missing namespaced registry index: ${namespacedIndexPath}`);
  }

  const registry = JSON.parse(readFileSync(indexPath, "utf-8")) as RegistryIndex;

  if (!Array.isArray(registry.items) || registry.items.length === 0) {
    throw new Error("Registry index has no items.");
  }

  for (const item of registry.items) {
    const itemPath = join(PUBLIC_R_DIR, `${item.name}.json`);
    const namespacedItemPath = join(NAMESPACED_PUBLIC_R_DIR, `${item.name}.json`);

    if (!existsSync(itemPath)) {
      throw new Error(`Missing item file: ${itemPath}`);
    }

    if (!existsSync(namespacedItemPath)) {
      throw new Error(`Missing namespaced item file: ${namespacedItemPath}`);
    }

    if (!item.type) {
      throw new Error(`Item "${item.name}" is missing "type".`);
    }

    if (!Array.isArray(item.files) || item.files.length === 0) {
      throw new Error(`Item "${item.name}" has no files.`);
    }

    for (const file of item.files) {
      if (!file.path || !file.type) {
        throw new Error(`Item "${item.name}" has an invalid file entry.`);
      }
    }
  }

  return registry;
}

function createFixtureProject(fixtureParent: string): string {
  const fixtureName = "fixture";
  const fixturePath = join(fixtureParent, fixtureName);

  runCommand(
    "pnpm",
    [
      "dlx",
      "shadcn@latest",
      "create",
      "--template",
      "next",
      "--yes",
      "--defaults",
      "--name",
      fixtureName,
      "--cwd",
      fixtureParent,
      "--silent",
    ],
    REGISTRY_ROOT
  );

  return fixturePath;
}

function configureNamespacedRegistry(fixturePath: string, registryBaseUrl: string): void {
  const componentsJsonPath = join(fixturePath, "components.json");

  if (!existsSync(componentsJsonPath)) {
    throw new Error(`Fixture components.json not found: ${componentsJsonPath}`);
  }

  const componentsJson = JSON.parse(readFileSync(componentsJsonPath, "utf-8")) as {
    registries?: Record<string, string>;
  };

  componentsJson.registries = {
    ...(componentsJson.registries ?? {}),
    [NAMESPACE]: `${registryBaseUrl}/r/${NAMESPACE}/{name}.json`,
  };

  writeFileSync(componentsJsonPath, `${JSON.stringify(componentsJson, null, 2)}\n`, "utf-8");
}

function installRegistryTarget(fixturePath: string, target: string): void {
  runCommand(
    "pnpm",
    [
      "dlx",
      "shadcn@latest",
      "add",
      target,
      "--yes",
      "--overwrite",
      "--cwd",
      fixturePath,
      "--silent",
    ],
    REGISTRY_ROOT
  );
}

function verifyInstalledItem(fixturePath: string, item: RegistryItem): void {
  const fixturePackageJsonPath = join(fixturePath, "package.json");

  if (!existsSync(fixturePackageJsonPath)) {
    throw new Error("Fixture package.json not found after install.");
  }

  const fixturePackageJson = JSON.parse(readFileSync(fixturePackageJsonPath, "utf-8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  for (const depSpecifier of item.dependencies ?? []) {
    const depName = parseDependencyName(depSpecifier);
    const inDependencies = Boolean(fixturePackageJson.dependencies?.[depName]);
    const inDevDependencies = Boolean(fixturePackageJson.devDependencies?.[depName]);

    if (!inDependencies && !inDevDependencies) {
      throw new Error(
        `Installed fixture missing dependency "${depName}" from item "${item.name}".`
      );
    }
  }

  for (const file of item.files) {
    const installedPath = join(fixturePath, expectedInstallPath(file));

    if (!existsSync(installedPath)) {
      throw new Error(
        `Installed fixture missing file "${expectedInstallPath(file)}" for "${item.name}".`
      );
    }
  }
}

function compileFixture(fixturePath: string, itemName: string): void {
  try {
    runCommand(
      "pnpm",
      ["--dir", fixturePath, "exec", "tsc", "--noEmit", "--pretty", "false"],
      REGISTRY_ROOT
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Fixture TypeScript compile failed after installing "${itemName}".\n${message}`);
  }
}

async function verify(): Promise<VerificationResult> {
  const result: VerificationResult = { passed: true, errors: [], warnings: [] };
  let fixtureParent = "";
  let server: StaticServerHandle | null = null;

  console.log("🔍 Verifying motion-gallery registry installation\n");

  try {
    const registry = readRegistryIndex();

    console.log(`✓ index.json found (${registry.items.length} items)`);
    console.log("✓ namespaced index found");
    console.log("✓ registry item files and schema-critical fields present\n");

    fixtureParent = mkdtempSync(join(tmpdir(), "motion-gallery-verify-"));
    const fixturePath = createFixtureProject(fixtureParent);

    console.log("✓ fresh fixture project created");

    server = await startStaticServer(PUBLIC_DIR);
    console.log(`✓ local registry server started at ${server.baseUrl}\n`);

    const directSmokeItem =
      registry.items.find((item) => item.name === "slide-toggle-switch") ?? registry.items[0];

    console.log(`🔗 Running direct URL smoke test for: ${directSmokeItem.name}`);

    installRegistryTarget(fixturePath, `${server.baseUrl}/r/${directSmokeItem.name}.json`);
    verifyInstalledItem(fixturePath, directSmokeItem);
    compileFixture(fixturePath, directSmokeItem.name);

    console.log(`✓ direct URL install compiled for "${directSmokeItem.name}"\n`);

    configureNamespacedRegistry(fixturePath, server.baseUrl);

    console.log("📦 Running hosted namespaced install checks\n");

    for (const item of registry.items) {
      const target = `${NAMESPACE}/${item.name}`;
      console.log(`• Installing ${target}`);

      installRegistryTarget(fixturePath, target);
      verifyInstalledItem(fixturePath, item);
      compileFixture(fixturePath, item.name);

      console.log(`  ✓ files, dependencies, and TypeScript compile passed for "${item.name}"`);
    }

    console.log("\n---");
    console.log("✅ All checks passed!\n");
    console.log(
      `Registry is installable (verified with direct URL smoke test and hosted namespaced installs for ${registry.items.length} pilot items).`
    );
  } catch (error) {
    result.passed = false;
    result.errors.push(error instanceof Error ? error.message : String(error));

    console.log("\n---");
    console.log("❌ Verification failed:\n");
    for (const err of result.errors) {
      console.log(`  - ${err}`);
    }
  } finally {
    if (server) {
      await server.close();
    }

    if (fixtureParent && existsSync(fixtureParent)) {
      rmSync(fixtureParent, { recursive: true, force: true });
    }
  }

  return result;
}

verify()
  .then((result) => {
    if (result.warnings.length > 0) {
      console.log("\n⚠️  Warnings:");
      for (const warn of result.warnings) {
        console.log(`  - ${warn}`);
      }
    }

    process.exit(result.passed ? 0 : 1);
  })
  .catch((error) => {
    console.error("Verification error:", error);
    process.exit(1);
  });

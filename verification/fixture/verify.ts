/**
 * @fileoverview Local registry verification script
 *
 * Runs a practical installability smoke test by:
 * - validating generated registry output
 * - creating a fresh fixture project via shadcn create
 * - installing a pilot item via shadcn add against local registry JSON
 * - asserting installed files and dependencies exist in the fixture
 *
 * Run: pnpm verify:registry
 */

import { existsSync, mkdtempSync, readFileSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { tmpdir } from "os";
import { spawnSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_ROOT = join(__dirname, "..", "..");
const PUBLIC_R_DIR = join(REGISTRY_ROOT, "public", "r");
const NAMESPACED_PUBLIC_R_DIR = join(PUBLIC_R_DIR, "@motion-gallery");

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
  name: string;
  homepage: string;
  items: RegistryItem[];
}

interface VerificationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
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

async function verify(): Promise<VerificationResult> {
  const result: VerificationResult = { passed: true, errors: [], warnings: [] };
  let fixtureParent = "";

  console.log("🔍 Verifying motion-gallery registry installation\n");

  try {
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

    console.log(`✓ index.json found (${registry.items.length} items)`);
    console.log(`✓ namespaced index found\n`);

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

    console.log("✓ registry item files and schema-critical fields present\n");

    const smokeItem = registry.items.find((item) => item.name === "slide-toggle-switch") ?? registry.items[0];
    const smokeItemPath = join(PUBLIC_R_DIR, `${smokeItem.name}.json`);

    console.log(`📦 Running real install smoke test for: ${smokeItem.name}\n`);

    fixtureParent = mkdtempSync(join(tmpdir(), "motion-gallery-verify-"));
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

    runCommand(
      "pnpm",
      [
        "dlx",
        "shadcn@latest",
        "add",
        smokeItemPath,
        "--yes",
        "--overwrite",
        "--cwd",
        fixturePath,
        "--silent",
      ],
      REGISTRY_ROOT
    );

    const fixturePackageJsonPath = join(fixturePath, "package.json");
    if (!existsSync(fixturePackageJsonPath)) {
      throw new Error("Fixture package.json not found after install.");
    }

    const fixturePackageJson = JSON.parse(readFileSync(fixturePackageJsonPath, "utf-8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    for (const depSpecifier of smokeItem.dependencies ?? []) {
      const depName = parseDependencyName(depSpecifier);
      const inDeps = Boolean(fixturePackageJson.dependencies?.[depName]);
      const inDevDeps = Boolean(fixturePackageJson.devDependencies?.[depName]);

      if (!inDeps && !inDevDeps) {
        throw new Error(
          `Installed fixture missing dependency "${depName}" from item "${smokeItem.name}".`
        );
      }
    }

    for (const file of smokeItem.files) {
      const installedPath = join(fixturePath, expectedInstallPath(file));
      if (!existsSync(installedPath)) {
        throw new Error(
          `Installed fixture missing file "${expectedInstallPath(file)}" for "${smokeItem.name}".`
        );
      }
    }

    console.log("✓ fresh fixture project created");
    console.log("✓ shadcn add executed against local registry item JSON");
    console.log("✓ expected files installed and dependencies resolved");
    console.log("\n---");
    console.log("✅ All checks passed!\n");
    console.log(`Registry is installable (verified with "${smokeItem.name}").`);
  } catch (error) {
    result.passed = false;
    result.errors.push(error instanceof Error ? error.message : String(error));

    console.log("\n---");
    console.log("❌ Verification failed:\n");
    for (const err of result.errors) {
      console.log(`  - ${err}`);
    }
  } finally {
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
  .catch((e) => {
    console.error("Verification error:", e);
    process.exit(1);
  });

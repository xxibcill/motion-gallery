/**
 * @fileoverview Route-registry consistency checker
 *
 * Validates that:
 * 1. Registered animations with status="ready" have corresponding page files.
 * 2. Page files that should be discoverable are registered.
 *
 * Run: pnpm check:routes
 */

import { readdirSync, statSync } from "fs";
import { join, relative } from "path";

const APP_DIR = join(process.cwd(), "app");

interface RegistryEntry {
  id: string;
  path: string;
  status?: string;
}

/**
 * Collects all animation entries from the registry by evaluating the TS file.
 */
async function getRegistryEntries(): Promise<RegistryEntry[]> {
  const registry = await import("../lib/animation-registry.ts");
  const animations = registry.getAllAnimations();
  return animations.map((a: { id: string; path: string; status?: string }) => ({
    id: a.id,
    path: a.path,
    status: a.status ?? "ready",
  }));
}

/**
 * Converts a registry path to its expected page file location.
 * "/" → "app/page.tsx"
 * "/foo" → "app/foo/page.tsx"
 * "/foo/bar" → "app/foo/bar/page.tsx"
 */
function registryPathToPageFile(appDir: string, registryPath: string): string {
  if (registryPath === "/") {
    return join(appDir, "page.tsx");
  }
  const segments = registryPath.split("/").filter(Boolean);
  return join(appDir, ...segments, "page.tsx");
}

/**
 * Recursively collects all page.tsx files under a directory,
 * returning their paths relative to the app root (with leading slash).
 */
function collectPageFiles(dir: string, prefix = ""): string[] {
  let results: string[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);

    // Always check if it's a file first (before checking if it's "page.tsx" as string)
    const stat = statSync(fullPath);

    if (entry === "page.tsx" && stat.isFile()) {
      // This is a page file at this level
      if (prefix === "") {
        // Root page.tsx -> "/"
        results.push("/");
      } else {
        // subdir/page.tsx -> "/subdir"
        results.push(prefix);
      }
      // Don't recurse into a file
    } else if (stat.isDirectory()) {
      // Recurse into subdirectory, building the path prefix
      const newPrefix = prefix === "" ? `/${entry}` : `${prefix}/${entry}`;
      results = results.concat(collectPageFiles(fullPath, newPrefix));
    }
    // Skip other files (not page.tsx)
  }

  return results;
}

async function main() {
  const errors: string[] = [];
  const warnings: string[] = [];

  const registryEntries = await getRegistryEntries();
  const registryMap = new Map(registryEntries.map((e) => [e.path, e]));

  console.log(`\n=== Route Registry Consistency Check ===\n`);
  console.log(`Registry entries: ${registryEntries.length}`);

  // 1. Check: registered ready routes have page files
  console.log(`\nChecking registered routes have page files...`);
  for (const entry of registryEntries) {
    if (entry.status === "planned") {
      console.log(`  SKIP "${entry.path}" (status=planned, handled by dynamic route)`);
      continue;
    }

    const pageFile = registryPathToPageFile(APP_DIR, entry.path);
    try {
      statSync(pageFile);
      console.log(`  OK: "${entry.path}" -> ${relative(APP_DIR, pageFile)}`);
    } catch {
      errors.push(
        `MISSING PAGE: Registry entry "${entry.id}" (path="${entry.path}") has no corresponding page file at "${relative(APP_DIR, pageFile)}"`
      );
    }
  }

  // 2. Check: page files that should be registered are in the registry
  const pagePaths = collectPageFiles(APP_DIR);
  console.log(`\nChecking page files are registered...`);
  console.log(`Page files found: ${pagePaths.length}`);

  for (const pagePath of pagePaths) {
    // Skip /test - development-only page without registry entry
    if (pagePath === "/test") {
      warnings.push(
        `SKIP "/test": exists but is not in the registry (development-only page)`
      );
      continue;
    }

    // Skip /transition/[slug] - dynamic route handler, not a content page
    if (pagePath === "/transition/[slug]") {
      warnings.push(
        `SKIP "/transition/[slug]": dynamic route handler, not a content page`
      );
      continue;
    }

    if (!registryMap.has(pagePath)) {
      errors.push(
        `UNREGISTERED PAGE: Page file "${pagePath}" exists but is not in the animation registry. Add it to lib/animation-registry.ts to make it discoverable.`
      );
    } else {
      console.log(`  OK: "${pagePath}" is registered`);
    }
  }

  // Summary
  console.log("\n--- Summary ---\n");

  if (warnings.length > 0) {
    for (const w of warnings) {
      console.log(`  ⚠ ${w}`);
    }
    console.log();
  }

  if (errors.length === 0) {
    console.log("✓ All registry entries have corresponding page files.");
    console.log("✓ All gallery page files are registered.\n");
    process.exit(0);
  }

  for (const e of errors) {
    console.log(`  ✗ ${e}`);
  }
  console.log();
  process.exit(1);
}

main().catch((err) => {
  console.error("Check failed due to unexpected error:", err);
  process.exit(1);
});

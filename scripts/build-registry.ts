/**
 * @fileoverview Registry build script
 *
 * Reads registry.json and outputs individual item JSON files to public/r/
 * for consumption by the shadcn CLI.
 *
 * Run: pnpm build:registry
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const REGISTRY_PATH = join(process.cwd(), "registry.json");
const OUTPUT_DIR = join(process.cwd(), "public", "r");
const NAMESPACE = "@motion-gallery";
const NAMESPACED_OUTPUT_DIR = join(OUTPUT_DIR, NAMESPACE);

interface RegistryItem {
  name: string;
  title: string;
  description: string;
  files: string[];
  npmDependencies?: string[];
}

interface Registry {
  $schema?: string;
  name: string;
  description: string;
  version: string;
  items: RegistryItem[];
}

function main() {
  // Ensure output directories exist
  mkdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(NAMESPACED_OUTPUT_DIR, { recursive: true });

  // Read registry
  const registryContent = readFileSync(REGISTRY_PATH, "utf-8");
  const registry: Registry = JSON.parse(registryContent);

  console.log(`Building registry items to ${OUTPUT_DIR}`);
  console.log(`Found ${registry.items.length} items\n`);

  // Write each item as individual JSON file and namespaced alias.
  for (const item of registry.items) {
    const filePath = join(OUTPUT_DIR, `${item.name}.json`);
    writeFileSync(filePath, JSON.stringify(item, null, 2), "utf-8");
    const namespacedFilePath = join(NAMESPACED_OUTPUT_DIR, `${item.name}.json`);
    writeFileSync(namespacedFilePath, JSON.stringify(item, null, 2), "utf-8");
    console.log(`  Written: ${item.name}.json`);
    console.log(`  Written: ${NAMESPACE}/${item.name}.json`);
  }

  // Also write the full registry index in both root and namespaced directories.
  const indexPath = join(OUTPUT_DIR, "index.json");
  writeFileSync(indexPath, JSON.stringify(registry, null, 2), "utf-8");
  const namespacedIndexPath = join(NAMESPACED_OUTPUT_DIR, "index.json");
  writeFileSync(namespacedIndexPath, JSON.stringify(registry, null, 2), "utf-8");
  console.log(`\n  Written: index.json (full registry)`);
  console.log(`  Written: ${NAMESPACE}/index.json (namespaced index)`);

  console.log("\nRegistry build complete.");
}

main();

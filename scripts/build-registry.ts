/**
 * @fileoverview Registry build script
 *
 * Uses the installable catalog as source-of-truth and emits:
 * - schema-compliant root registry at registry.json
 * - item JSON files in public/r/
 * - namespaced aliases in public/r/@motion-gallery/
 *
 * Run: pnpm build:registry
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { getPilotDistributableItems } from "../lib/installable-catalog";

const ROOT_DIR = process.cwd();
const ROOT_REGISTRY_PATH = join(ROOT_DIR, "registry.json");
const OUTPUT_DIR = join(ROOT_DIR, "public", "r");
const NAMESPACE = "@motion-gallery";
const NAMESPACED_OUTPUT_DIR = join(OUTPUT_DIR, NAMESPACE);
const HOMEPAGE = "https://motion-gallery.dev";

type RegistryItemType =
  | "registry:lib"
  | "registry:block"
  | "registry:component"
  | "registry:ui"
  | "registry:hook"
  | "registry:theme"
  | "registry:page"
  | "registry:file"
  | "registry:style"
  | "registry:base"
  | "registry:font"
  | "registry:item";

interface RegistryFileEntry {
  path: string;
  type: RegistryItemType;
  content: string;
  target?: string;
}

interface RegistryItem {
  name: string;
  type: RegistryItemType;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  categories?: string[];
  files: RegistryFileEntry[];
}

interface RegistryIndex {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

function inferFileType(path: string): RegistryItemType {
  if (path.startsWith("registry/libs/")) {
    return "registry:lib";
  }
  if (path.startsWith("registry/hooks/")) {
    return "registry:hook";
  }
  if (path.startsWith("registry/styles/")) {
    return "registry:style";
  }
  return "registry:component";
}

function sourceToTargetPath(sourcePath: string): string {
  if (sourcePath.startsWith("registry/")) {
    return sourcePath.replace(/^registry\//, "");
  }
  return sourcePath;
}

function readSourceFile(path: string): string {
  const absolutePath = join(ROOT_DIR, path);
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing source file in catalog: ${path}`);
  }
  return readFileSync(absolutePath, "utf-8");
}

function toRegistryItem() {
  const pilotItems = getPilotDistributableItems();

  if (pilotItems.length === 0) {
    throw new Error("Catalog contains no pilot items. Cannot build registry.");
  }

  return pilotItems.map<RegistryItem>((item) => {
    const files = item.sourceFiles.map<RegistryFileEntry>((sourcePath) => ({
      path: sourcePath,
      type: inferFileType(sourcePath),
      target: sourceToTargetPath(sourcePath),
      content: readSourceFile(sourcePath),
    }));

    return {
      name: item.name,
      type: "registry:block",
      title: item.title,
      description: item.description,
      dependencies: item.npmDependencies.map((dep) => `${dep.package}@${dep.version}`),
      registryDependencies: item.registryDependencies?.map((dep) => dep.name),
      categories: [item.category],
      files,
    };
  });
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf-8");
}

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(NAMESPACED_OUTPUT_DIR, { recursive: true });

  const items = toRegistryItem();
  const registry: RegistryIndex = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "motion-gallery",
    homepage: HOMEPAGE,
    items,
  };

  writeJson(ROOT_REGISTRY_PATH, registry);

  console.log(`Building registry items to ${OUTPUT_DIR}`);
  console.log(`Found ${registry.items.length} pilot items\n`);

  for (const item of registry.items) {
    const filePath = join(OUTPUT_DIR, `${item.name}.json`);
    const namespacedFilePath = join(NAMESPACED_OUTPUT_DIR, `${item.name}.json`);

    writeJson(filePath, item);
    writeJson(namespacedFilePath, item);

    console.log(`  Written: ${item.name}.json`);
    console.log(`  Written: ${NAMESPACE}/${item.name}.json`);
  }

  const indexPath = join(OUTPUT_DIR, "index.json");
  const namespacedIndexPath = join(NAMESPACED_OUTPUT_DIR, "index.json");

  writeJson(indexPath, registry);
  writeJson(namespacedIndexPath, registry);

  console.log(`\n  Synced: ${ROOT_REGISTRY_PATH}`);
  console.log("  Written: index.json (full registry)");
  console.log(`  Written: ${NAMESPACE}/index.json (namespaced index)`);
  console.log("\nRegistry build complete.");
}

main();

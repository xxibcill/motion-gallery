/**
 * @fileoverview Thin wrapper CLI for motion-gallery registry installs.
 *
 * This command only resolves pilot item names and delegates installation to
 * the existing shadcn registry flow.
 *
 * Usage:
 *   pnpm motion-gallery list
 *   pnpm motion-gallery add slide-toggle-switch
 *   pnpm motion-gallery add @motion-gallery/slide-toggle-switch --dry-run
 */

import { spawnSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const NAMESPACE = "@motion-gallery";
const REGISTRY_INDEX_PATH = join(process.cwd(), "public", "r", "index.json");
const REGISTRY_SOURCE_PATH = join(process.cwd(), "registry.json");

interface RegistryItem {
  name: string;
  title: string;
  description: string;
}

interface RegistryIndex {
  items: RegistryItem[];
}

interface ParsedAddArgs {
  dryRun: boolean;
  targets: string[];
}

function printHelp(exitCode = 0): void {
  console.log(`motion-gallery CLI (thin wrapper)

Usage:
  motion-gallery list
  motion-gallery add <item...> [--dry-run]

Examples:
  motion-gallery list
  motion-gallery add slide-toggle-switch
  motion-gallery add @motion-gallery/slide-toggle-switch --dry-run

Notes:
  - This command is only a convenience layer over shadcn CLI.
  - Actual installation is delegated to "shadcn add".
`);

  process.exit(exitCode);
}

function readRegistryIndex(): RegistryIndex {
  const preferredPath = existsSync(REGISTRY_INDEX_PATH)
    ? REGISTRY_INDEX_PATH
    : REGISTRY_SOURCE_PATH;

  if (!existsSync(preferredPath)) {
    throw new Error(
      `Could not find registry metadata at ${REGISTRY_INDEX_PATH} or ${REGISTRY_SOURCE_PATH}.`
    );
  }

  const parsed = JSON.parse(readFileSync(preferredPath, "utf-8")) as RegistryIndex;
  if (!Array.isArray(parsed.items)) {
    throw new Error(`Registry file at ${preferredPath} does not contain an items array.`);
  }

  return parsed;
}

function parseAddArgs(args: string[]): ParsedAddArgs {
  let dryRun = false;
  const targets: string[] = [];

  for (const arg of args) {
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg.startsWith("-")) {
      throw new Error(`Unknown option "${arg}".`);
    }
    targets.push(arg);
  }

  if (targets.length === 0) {
    throw new Error('Missing item name. Example: "motion-gallery add slide-toggle-switch".');
  }

  return { dryRun, targets };
}

function resolveInstallTarget(rawTarget: string, knownItems: Set<string>): string {
  if (rawTarget.startsWith("http://") || rawTarget.startsWith("https://")) {
    return rawTarget;
  }

  const namespacedPrefix = `${NAMESPACE}/`;
  if (rawTarget.startsWith(namespacedPrefix)) {
    const itemName = rawTarget.slice(namespacedPrefix.length);
    if (!knownItems.has(itemName)) {
      throw new Error(`Unknown registry item "${rawTarget}".`);
    }
    return rawTarget;
  }

  if (knownItems.has(rawTarget)) {
    return `${NAMESPACE}/${rawTarget}`;
  }

  throw new Error(
    `Unknown registry item "${rawTarget}". Run "motion-gallery list" to see available names.`
  );
}

function getShadcnCommand(): { command: string; args: string[] } {
  const pnpmCheck = spawnSync("pnpm", ["--version"], { stdio: "ignore" });
  if (pnpmCheck.status === 0) {
    return {
      command: "pnpm",
      args: ["dlx", "shadcn@latest"],
    };
  }

  return {
    command: "npx",
    args: ["--yes", "shadcn@latest"],
  };
}

function runAdd(args: string[], registry: RegistryIndex): void {
  const { dryRun, targets } = parseAddArgs(args);
  const knownItems = new Set(registry.items.map((item) => item.name));
  const resolvedTargets = targets.map((target) => resolveInstallTarget(target, knownItems));

  const { command, args: baseArgs } = getShadcnCommand();
  const shadcnArgs = [...baseArgs, "add", ...resolvedTargets];

  if (dryRun) {
    console.log(`Dry run: ${command} ${shadcnArgs.join(" ")}`);
    return;
  }

  const result = spawnSync(command, shadcnArgs, { stdio: "inherit" });
  if (result.error) {
    throw result.error;
  }
  process.exit(result.status ?? 1);
}

function runList(registry: RegistryIndex): void {
  console.log("Pilot registry items:");
  for (const item of registry.items) {
    console.log(`- ${item.name} (${NAMESPACE}/${item.name})`);
  }
}

function main(): void {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
  }

  const registry = readRegistryIndex();

  if (command === "list") {
    runList(registry);
    return;
  }

  if (command === "add") {
    runAdd(args, registry);
    return;
  }

  console.error(`Unknown command "${command}".`);
  printHelp(1);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`motion-gallery CLI error: ${message}`);
  process.exit(1);
}

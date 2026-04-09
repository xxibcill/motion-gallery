# Task 06: Add Registry Build Output

## Objective

Wire the repo so registry source definitions can be turned into generated JSON files consumable by the `shadcn` CLI.

## Why This Matters

The registry is not usable until consumers can fetch concrete item JSON from a stable output location.

## Scope

- Add the minimum build workflow needed to generate registry item JSON.
- Target the conventional output directory used by the `shadcn` build flow.
- Add or document the local command used to refresh generated files.
- Keep the build path simple and deterministic.

## Target Files

- `package.json`
- `registry.json`
- `public/r/`
- Any small supporting config file if needed

## Deliverables

- A working local build command for registry output.
- Generated JSON files under `public/r/`.
- Basic documentation or script naming that makes the build discoverable.

## Acceptance Criteria

- A local command can regenerate the registry output from source definitions.
- Generated files exist for each pilot item.
- Output paths are stable enough for direct URL installation.

## Out Of Scope

- Consumer project testing.
- Public hosting setup beyond local repo output.
- Optional wrapper CLI behavior.

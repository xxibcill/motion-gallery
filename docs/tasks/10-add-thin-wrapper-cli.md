# Task 10: Add A Thin Wrapper CLI

## Objective

Add an optional project-specific CLI command that improves ergonomics while delegating actual installation work to the registry model.

## Why This Matters

If the project wants branding similar to `shadcn`, a small wrapper can improve discoverability. It should come last so it does not hard-code unstable assumptions about packaging.

## Scope

- Add a thin CLI entry point for common commands such as `add` and maybe `list`.
- Resolve item names against the established registry output or installable catalog.
- Delegate installation behavior to the existing `shadcn` flow or equivalent registry fetch logic.
- Keep prompts, parsing, and surface area small.

## Target Files

- `package.json`
- A new CLI entry file under `scripts/`, `bin/`, or similar
- Any small docs update needed for usage

## Deliverables

- A minimal wrapper command for the pilot set.
- Clear docs that explain it is a convenience layer over the registry model.

## Acceptance Criteria

- The wrapper does not invent a second packaging format.
- Pilot items can still be installed without the wrapper.
- The wrapper stays small enough that future registry changes do not require major CLI rewrites.

## Out Of Scope

- Replacing the `shadcn` registry ecosystem.
- Interactive project scaffolding.
- Broad search, docs fetching, or migration features beyond the project's immediate needs.

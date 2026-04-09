# Task 03: Scaffold The Registry Source Tree

## Objective

Create the file structure that will hold installable registry source files and generated output.

## Why This Matters

Without a dedicated registry tree, packaging work will keep mutating gallery source files directly and blur the boundary between demo code and distributable code.

## Scope

- Add a `registry/` source area for distributable items.
- Choose a directory layout that supports components, libs, hooks, and styles.
- Add an initial `registry.json` scaffold aligned with the `shadcn` registry schema.
- Keep the scaffold minimal and focused on the pilot set.

## Target Files

- `registry/`
- `registry.json`
- `public/r/` only if output structure must be created up front

## Deliverables

- A stable registry folder layout.
- A minimal `registry.json` scaffold.
- Enough structure that later tasks can add concrete item files without redesigning directories.

## Acceptance Criteria

- The repo clearly separates gallery source from registry source.
- The layout can represent both standalone components and shared installable helpers.
- The scaffold does not yet depend on a fully working build step.

## Out Of Scope

- Full registry item implementation.
- Build scripts.
- Namespaced hosting or consumer configuration.

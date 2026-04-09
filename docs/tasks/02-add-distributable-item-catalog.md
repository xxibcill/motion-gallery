# Task 02: Add A Distributable Item Catalog

## Status

Done: Created `lib/installable-catalog.ts` with typed `DistributableItem` catalog, 21 pilot micro-interaction entries with `motion` npm dependencies, and helper functions for catalog access.

## Objective

Introduce a dedicated source of truth for installable animation items instead of overloading the gallery route registry.

## Why This Matters

`lib/animation-registry.ts` describes gallery navigation and discovery. It does not describe how to transplant code into another project. Distribution needs its own metadata model.

## Scope

- Add a new catalog for installable items.
- Define fields needed for distribution, such as item name, title, description, source files, npm dependencies, and registry dependencies.
- Keep this catalog separate from route metadata.
- Seed the catalog with placeholder or pilot entries only for components identified as installable.

## Target Files

- A new file under `lib/` or `registry/` for the catalog
- `lib/animation-registry.ts` only if a light link or comment is helpful
- Any supporting types file created for the catalog

## Deliverables

- A typed installable item catalog.
- Clear metadata names that map well to future registry item JSON.
- Initial entries for the pilot components.

## Acceptance Criteria

- The installable catalog can evolve without changing gallery navigation behavior.
- An agent can derive registry build inputs from this catalog.
- Pilot entries explicitly list npm dependencies such as `motion` where required.

## Out Of Scope

- Building registry JSON output.
- Copying component source into registry folders.
- Consumer-facing documentation.

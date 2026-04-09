# Task 04: Extract Shared Installable Primitives

## Objective

Move or duplicate only the shared helper code needed by pilot components into installable registry-friendly files.

## Why This Matters

Many components import `@/lib/...` or other internal files. That works inside the gallery app but breaks when the component is copied into a different project.

## Scope

- Identify the minimum shared helpers required by the pilot components.
- Create installable shared files under the registry source tree.
- Rewrite pilot item imports to target shipped files instead of gallery-only modules.
- Keep extraction small and localized.

## Target Files

- `registry/`
- Relevant source files under `components/` and `lib/` for reference only
- Any small shared helper files created for installable items

## Deliverables

- Shared registry-friendly helper files for the pilot components.
- Updated pilot item source imports that no longer depend on `@/lib/...` from the gallery.

## Acceptance Criteria

- Pilot items can be copied into another project without unresolved gallery aliases.
- Shared helpers are limited to what the pilot set truly needs.
- No broad refactor of the main gallery runtime is required.

## Out Of Scope

- Making every component portable.
- Building output JSON.
- Wrapper CLI work.

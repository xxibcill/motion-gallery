# Task 01: Audit Component Portability

## Objective

Create a clear shortlist of components that are good candidates for installation into other projects.

## Why This Matters

The repo mixes portable UI primitives with gallery-specific shells, route code, and demo scaffolding. A smaller agent should not guess which pieces are safe to export.

## Scope

- Review candidate components under `components/`.
- Classify each candidate as:
  - portable now
  - portable after shared helper extraction
  - gallery-only for now
- Record the imports or styling assumptions that block portability.
- Recommend a first pilot set of 3 to 5 components.

## Target Files

- `components/`
- `lib/`
- `docs/tasks/shadcn-cli/`
- Any new audit note under `docs/` if needed

## Deliverables

- A concise written inventory of candidate installable components.
- A recommended pilot set for the first registry release.
- A short list of portability blockers per non-portable candidate.

## Acceptance Criteria

- A future agent can tell which components to package first without re-reading the whole repo.
- The audit distinguishes between reusable UI and gallery-only composition code.
- The recommended pilot set avoids route-level demos and heavy multi-file scenes.

## Out Of Scope

- Refactoring components.
- Creating registry files.
- Adding any CLI behavior.

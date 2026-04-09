# Task 01: Rewrite The README

## Objective

Replace the generic starter README with a project-specific contributor guide for the motion gallery.

## Why This Matters

The current `README.md` still reads like a fresh `create-next-app` template. That creates friction for anyone adding demos, tests, or registry entries.

## Scope

- Rewrite `README.md` to describe the real project.
- Document the purpose of the gallery and its major sections.
- Explain the route structure at a high level.
- Explain how demo pages and shared components are organized.
- Explain how animation metadata is registered.
- Document development commands already present in `package.json`.

## Target Files

- `README.md`
- `package.json`
- `lib/animation-registry.ts`
- `app/`
- `components/`
- `tests/e2e/`

## Deliverables

- A concise project overview.
- A directory map for the main folders.
- A short "how to add a new demo" section.
- A short "how to run checks" section.

## Acceptance Criteria

- The README contains no generic Next.js starter copy.
- A new contributor can tell where to add a route, where to add shared UI, and where to register metadata.
- Commands in the README match the actual scripts in `package.json`.

## Out Of Scope

- Adding new npm scripts.
- Large architecture documentation.
- Deep per-demo documentation.


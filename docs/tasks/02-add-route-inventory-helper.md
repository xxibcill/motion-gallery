# Task 02: Add A Shared Route Inventory Helper

## Objective

Create one small source of truth that test code can use to enumerate gallery routes in a stable way.

## Why This Matters

The repo has many route files but very little automated coverage. Smoke tests will stay maintainable only if route selection comes from a shared helper instead of hard-coded lists spread across specs.

## Scope

- Add a small helper for test-facing route inventory.
- Prefer deriving data from `lib/animation-registry.ts` rather than duplicating route lists.
- Separate core gallery routes from transition lab routes.
- Exclude utility routes that should not be part of the smoke suite if that distinction already exists in project structure.

## Target Files

- `lib/animation-registry.ts`
- `tests/fixtures/index.ts`
- Any new helper file under `tests/fixtures/` or `lib/`

## Deliverables

- A reusable helper that returns route data for smoke tests.
- Clear naming that makes it obvious which routes belong to core gallery and which belong to transition lab.

## Acceptance Criteria

- New smoke specs can import the helper instead of copying route lists.
- The helper does not introduce circular imports or app-runtime side effects.
- Route inventory stays aligned with the registry model used by navigation.

## Out Of Scope

- Writing the smoke specs themselves.
- Adding visual regression testing.
- Refactoring the registry structure beyond what is needed for safe reuse.


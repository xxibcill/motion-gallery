# Task 03: Add Core Route Smoke Tests

## Objective

Add Playwright smoke coverage for core gallery routes.

## Why This Matters

There are many core demo pages and only a few shallow tests. Broken imports, runtime errors, and blank pages can slip through easily.

## Scope

- Add a Playwright spec for core gallery routes.
- Use the shared route inventory helper from Task 02.
- Visit each selected route and verify a minimal render contract.
- Keep assertions intentionally lightweight.

## Target Files

- `tests/e2e/`
- `tests/fixtures/index.ts`
- Any helper introduced in Task 02

## Deliverables

- One new spec focused on core routes.
- A small shared assertion pattern such as:
  - page loads
  - `body` is visible
  - `main` or the expected page shell exists when appropriate

## Acceptance Criteria

- The spec covers the main core gallery routes without manually duplicating path strings.
- The test stays fast enough for local iteration.
- The suite does not depend on brittle animation timing assertions.

## Out Of Scope

- Deep interaction testing for each demo.
- Snapshot testing.
- Cross-browser flake tuning beyond basic stability fixes.


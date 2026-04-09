# Task 05: Add A Route And Registry Consistency Check

## Objective

Catch drift between file-system routes and the animation registry.

## Why This Matters

Navigation and discovery are registry-driven, but implementation lives in file-based routes. Those two systems will drift unless there is an automated guard.

## Scope

- Add one automated check that validates registry and route consistency.
- Decide on the smallest practical form:
  - a Playwright-independent test
  - or a lightweight script invoked by an existing workflow
- Verify that registered paths exist.
- Verify that expected gallery demo routes are registered.

## Target Files

- `lib/animation-registry.ts`
- `app/`
- `package.json`
- `tests/` or a lightweight script file

## Deliverables

- One consistency check with clear failure messages.
- Minimal documentation in code or README if a command changes.

## Acceptance Criteria

- Missing registered routes fail the check.
- Unregistered demo routes that should be discoverable fail the check.
- The implementation is cheap to run locally.

## Out Of Scope

- Enforcing metadata quality beyond path presence and coverage.
- Building a full custom linter.
- Refactoring route names across the app.


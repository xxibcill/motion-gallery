# Task 04: Add Transition Lab Smoke Tests

## Objective

Add Playwright smoke coverage for transition lab routes under `/transition`.

## Why This Matters

The transition lab appears to be one of the most complex parts of the repo. It has shared infrastructure and multiple route variants, so breakage risk is higher than on simpler pages.

## Scope

- Add a Playwright spec dedicated to transition lab pages.
- Use the shared route inventory helper from Task 02.
- Validate that each route loads and shows its main interactive surface.
- Keep checks minimal and resilient.

## Target Files

- `tests/e2e/`
- `components/transition-lab/`
- Any helper introduced in Task 02

## Deliverables

- One new spec for `/transition` routes.
- Basic assertions that confirm route render and shell presence.

## Acceptance Criteria

- The transition lab landing page and individual transition demos are covered.
- The spec is not tied to fragile animation frames or exact pixel states.
- Failures clearly identify which route broke.

## Out Of Scope

- Transition correctness validation frame by frame.
- Screenshot baselines.
- Testing every toolbar control.


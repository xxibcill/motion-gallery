# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- **test(e2e): add transition lab route smoke tests** (`tests/e2e/transition-routes.spec.ts`)
  - Playwright smoke coverage for all 14 transition lab routes under `/transition`
  - Uses `getTransitionLabAnimations()` from the shared route inventory helper
  - 42 tests total (14 routes × chromium, firefox, webkit)

### Docs

- **docs(tasks): mark task 08 (demo page shell) as verified done**
  - Reviewed `app/micro-interactions/` (21 demo pages) — all consistently use `<MicroInteractionScene>`
  - Reviewed `app/transition/` (12 demo pages) — all consistently use `<SceneFrame>` + `<TransitionStage>` + `<DemoToolbar>` + `useTransitionDemo`
  - No structural divergence found; task acceptance criteria already met by prior work

### Removed

- `docs/micro-interactions-roadmap.md` — superseded by current task tracking in `docs/tasks/`

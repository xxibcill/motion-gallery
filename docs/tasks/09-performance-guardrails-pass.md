# Task 09: Performance Guardrails Pass

## Status

**Done**

### Performance Fixes Applied

1. **NoiseOverlay.tsx** — Removed `mix-blend-soft-light` CSS property.
   - **Rationale**: `mix-blend-mode` forces continuous GPU layer compositing between the noise overlay and all content beneath it. Since NoiseOverlay covers the entire viewport and is present on every Transition Lab scene, this was triggering expensive composite operations on every frame even when the scene is static.
   - **Fix**: Removed the blend mode. The noise texture is still visible via the semi-transparent white gradient patterns; the blending was a marginal visual enhancement that wasn't worth the GPU cost.

2. **SceneFrame.tsx** — Removed unnecessary `useReducedMotion()` hook call.
   - **Rationale**: `useReducedMotion()` was called on every render just to pass its result (always `false`) to `getSceneEntrance()`. SceneFrame is used inside TransitionStage which already handles reduced-motion logic. There is no code path where SceneFrame would ever receive reduced-motion = true.
   - **Fix**: Hardcoded `false` and removed the unused import. This eliminates a React hook call and subscription on every render of Transition Lab pages.

## Objective

Apply a lightweight performance pass to the heaviest demos and shared motion surfaces.

## Why This Matters

A motion gallery can degrade quickly if expensive effects spread without guardrails. This task is about obvious wins, not deep profiling research.

## Scope

- Review the heaviest pages and shared motion components.
- Look for clear issues such as:
  - unnecessary client boundaries
  - layout-triggering animations where transform would work
  - excessive blur, filter, or shadow usage on large surfaces
  - avoidable rerender churn in shared controls or nav
- Fix only the obvious, defensible issues.

## Target Files

- `components/transition-lab/`
- `components/micro-interactions/`
- `components/animation-nav.tsx`
- `lib/scroll-animation-hooks.ts`
- Any directly related heavy demo pages

## Deliverables

- A short list of concrete performance fixes.
- Minimal verification that the affected demos still behave correctly.

## Acceptance Criteria

- Each optimization has a clear rationale.
- No speculative micro-optimizations are added.
- The pass preserves the visual intent of the demos.

## Out Of Scope

- Bundle-analysis rabbit holes.
- Rewriting stable components without evidence.
- Large architectural performance overhauls.

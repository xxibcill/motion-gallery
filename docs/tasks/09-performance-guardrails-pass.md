# Task 09: Performance Guardrails Pass

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

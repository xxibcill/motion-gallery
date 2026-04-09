# Task 06: Audit Micro-Interactions For Accessibility And Reduced Motion

## Objective

Fix the most obvious reduced-motion and accessibility gaps in the micro-interactions set.

## Why This Matters

The roadmap already states that every interaction must respect reduced motion and preserve usability without animation. That standard needs to be enforced on shipped demos.

## Scope

- Audit the routes under `app/micro-interactions/`.
- Prioritize the demos with the most movement or the highest interaction density.
- Fix the biggest gaps first:
  - missing reduced-motion fallback
  - weak keyboard support
  - unclear ARIA state
  - focus visibility issues
- Keep the pass practical. Do not attempt a perfection sweep across every demo in one task.

## Target Files

- `app/micro-interactions/`
- `components/micro-interactions/`
- `app/globals.css`
- `docs/micro-interactions-roadmap.md`

## Deliverables

- A documented shortlist of audited demos.
- Code fixes for the highest-risk issues found.
- Reduced-motion behavior that still preserves state changes.

## Acceptance Criteria

- The selected demos behave sensibly when reduced motion is enabled.
- Interactive controls remain usable with keyboard navigation.
- Changes are limited to the audited demos and shared primitives they rely on.

## Out Of Scope

- Auditing every page in the repo.
- Visual redesign work.
- Building a full accessibility test harness.


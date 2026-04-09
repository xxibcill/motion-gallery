# Task 07: Audit Transition Lab Accessibility And Motion Fallbacks

## Objective

Harden the transition lab against the most obvious reduced-motion and accessibility issues.

## Why This Matters

Transition demos are visually rich and more likely to fail gracefully under reduced motion, keyboard-only use, or lower-powered devices.

## Scope

- Audit the transition lab shell and a small set of the heaviest transition demos.
- Check for:
  - reduced-motion fallback behavior
  - keyboard reachability for primary controls
  - readable content and sufficient contrast in active states
  - overlay or focus-trap issues if present
- Fix the highest-value problems only.

## Target Files

- `app/transition/`
- `components/transition-lab/`
- `app/globals.css`

## Deliverables

- A focused pass on the transition lab shell and selected heavy demos.
- Code changes that degrade motion intensity or replace motion with simpler state changes where needed.

## Acceptance Criteria

- Reduced-motion mode no longer leaves the selected demos confusing or unusable.
- The transition lab shell remains navigable with keyboard input.
- The task does not expand into a visual rewrite of transition effects.

## Out Of Scope

- Perfect accessibility coverage for every transition demo.
- Deep color-system refactors.
- Rebuilding the transition lab architecture.


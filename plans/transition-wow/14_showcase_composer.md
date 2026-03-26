# Task 14: Showcase Composer

## Status
Done

## Goal
Build the flagship wow feature at `/transition/showcase`, where one content scene can cycle through all transition modes from a shared control surface.

## Route
- `/transition/showcase`

## Deliverables
- A single hero experience that lets users swap between all 10 transition modes.
- Live controls for mode selection, replay, and possibly speed or intensity.
- Consistent scene content so the transition differences are easy to compare.

## Files And Surfaces
- `app/transition/showcase/page.tsx`
- `components/ControlsPanel.tsx` or a new section-specific controller
- `components/transition-lab/*`
- `lib/animation-registry.ts`

## Dependencies
- Tasks 01 through 13

## Steps
1. Choose one scene structure that works across all 10 transition modes.
2. Build a controller that swaps the active transition implementation without rebuilding the entire page architecture.
3. Add replay and mode selection controls that are easy to use on desktop and mobile.
4. Ensure each transition implementation can plug into the shared showcase contract.

## Acceptance Criteria
- The showcase acts as the main wow entry point for the transition lab.
- Users can compare all 10 variations without navigating away.
- The scene remains visually coherent across every mode.
- The route is stable enough to demo repeatedly.

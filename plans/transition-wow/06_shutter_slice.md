# Task 06: Shutter Slice Demo

## Status
Done

## Goal
Build a slicing transition where the scene breaks into strips or angled shutters that peel away at different speeds.

## Route
- `/transition/shutter-slice`

## Deliverables
- A demo with multi-slice wipes, shutters, or segmented blinds.
- Directional variety across vertical, diagonal, or offset strips.
- High perceived motion without relying on large-scale 3D.

## Files And Surfaces
- `app/transition/shutter-slice/page.tsx`
- Optional slice-generation helpers
- `lib/animation-registry.ts`

## Dependencies
- Tasks 01 through 03

## Steps
1. Split the stage into multiple slices that animate independently.
2. Offset timing and distance per slice for a less mechanical feel.
3. Use a bold foreground or image set so the split effect reads clearly.
4. Add a reverse transition to prove the effect works bidirectionally.

## Acceptance Criteria
- The demo feels sharp and mechanical in a satisfying way.
- Slice timing creates a layered effect instead of one flat wipe.
- The route has a clear identity distinct from liquid and panel transitions.
- The implementation does not rely on brittle hard-coded positioning.

# Task 11: Magnetic Collapse Demo

## Status
Done

## Goal
Build a transition where content is pulled toward a magnetic center or cursor-like attractor before reassembling into the next scene.

## Route
- `/transition/magnetic-collapse`

## Deliverables
- A focal-point-driven collapse and reassembly effect.
- Spatial choreography that feels reactive and slightly dangerous.
- Strong before-and-after scene contrast so the reassembly pays off.

## Files And Surfaces
- `app/transition/magnetic-collapse/page.tsx`
- Optional helpers for attractor fields or particle-like fragments
- `lib/animation-registry.ts`

## Dependencies
- Tasks 01 through 03

## Steps
1. Define a focal point that draws scene fragments inward.
2. Break content into movable pieces or layers that respond to the attractor.
3. Collapse the old scene, then explode or reassemble into the new one.
4. Use spring tuning carefully so the effect feels deliberate rather than chaotic.

## Acceptance Criteria
- The scene clearly collapses toward a center before reforming.
- The effect feels magnetic, not just scaled down.
- Reassembly into the next state is satisfying and readable.
- The route feels distinct from both shutter and portal transitions.

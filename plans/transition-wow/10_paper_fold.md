# Task 10: Paper Fold Demo

## Status
Done

## Goal
Create a tactile transition where sections fold, hinge, and reveal the next scene like physical cards or heavy paper panels.

## Route
- `/transition/paper-fold`

## Deliverables
- A convincing fold or hinge effect with shadow and perspective.
- A tactile visual language that contrasts with digital and fluid demos.
- Supportive lighting and layered surfaces.

## Files And Surfaces
- `app/transition/paper-fold/page.tsx`
- Optional helpers for fold planes and shadow casting
- `lib/animation-registry.ts`

## Dependencies
- Tasks 01 through 03

## Steps
1. Define fold planes and hinge origins for the main panels.
2. Use perspective and shadow changes to sell the material feel.
3. Reveal the next scene from underneath rather than simply replacing the old one.
4. Keep the effect readable and stable across screen sizes.

## Acceptance Criteria
- The demo reads as a physical fold rather than a plain 3D rotate.
- Shadows and timing support the material illusion.
- The motion feels tactile and intentional.
- The route adds a materially different sensation to the transition collection.

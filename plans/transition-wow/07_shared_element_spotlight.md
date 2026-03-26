# Task 07: Shared Element Spotlight Demo

## Status
Done

## Goal
Create a transition centered around one persistent focal element that survives the scene change while the rest of the layout rebuilds around it.

## Route
- `/transition/shared-element-spotlight`

## Deliverables
- A demo with a strong shared-element transition.
- One hero object such as a card, image, or product tile that anchors the viewer.
- Supporting choreography that amplifies the focal object instead of competing with it.

## Files And Surfaces
- `app/transition/shared-element-spotlight/page.tsx`
- `components/transition-lab/SharedElementShell.tsx`
- `lib/animation-registry.ts`

## Dependencies
- Tasks 01 through 03

## Steps
1. Define the primary shared element and its start and end states.
2. Build the surrounding scene so it fades, slides, or scales in secondary layers.
3. Use layout-aware motion to maintain continuity during the transition.
4. Add a clear control to toggle between two states or views.

## Acceptance Criteria
- The shared element remains visually continuous during the state change.
- The effect feels product-grade rather than like disconnected animations.
- Secondary layers enhance the hero object instead of cluttering the stage.
- The route demonstrates a strong UI transition pattern applicable to real products.

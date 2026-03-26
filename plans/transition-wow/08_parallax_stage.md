# Task 08: Parallax Stage Demo

## Status
Done

## Goal
Create a cinematic transition using foreground, midground, and background layers that move independently and sell a sense of depth.

## Route
- `/transition/parallax-stage`

## Deliverables
- A layered stage with distinct depth planes.
- Scene changes that feel cinematic rather than scroll-demo-like.
- Carefully tuned motion ratios so the effect stays readable.

## Files And Surfaces
- `app/transition/parallax-stage/page.tsx`
- Shared depth or perspective helpers if needed
- `lib/animation-registry.ts`

## Dependencies
- Tasks 01 through 03

## Steps
1. Build at least three depth layers with different motion speeds.
2. Transition between scenes by moving layers independently instead of moving the whole page as one block.
3. Add atmospheric treatment such as haze, gradient depth, or scaled texture.
4. Tune the timing so the scene feels cinematic, not floaty.

## Acceptance Criteria
- The demo creates a convincing depth hierarchy.
- Motion between layers is clearly differentiated.
- The route feels visually separate from the current parallax page in the app.
- The effect holds up on smaller screens.

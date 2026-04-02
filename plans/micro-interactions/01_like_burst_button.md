# Task 01: Like Burst Button

## Status
Done

## Goal
Ship an expressive favorite/save micro-interaction that combines icon state change, a controlled particle burst, and a restrained reverse animation.

## Route
- `/micro-interactions/like-burst`

## Deliverables
- Reusable `LikeBurstButton` component.
- Dedicated demo route with burst density and accent controls.
- Reduced-motion fallback that removes particles and keeps glow/fill feedback.
- Registry and index wiring so the demo is discoverable.

## Files And Surfaces
- `components/micro-interactions/LikeBurstButton.tsx`
- `app/micro-interactions/like-burst/page.tsx`
- `app/micro-interactions/page.tsx`
- `lib/animation-registry.ts`

## Dependencies
- Reuse `MicroInteractionScene` and shared control primitives.

## Steps
1. Build an accessible toggle button with `aria-pressed`.
2. Animate heart fill, scale, rotation, and contained decorative particles on like.
3. Add a calmer unlike sequence with less energy than the like burst.
4. Expose burst density and accent color controls on the demo route.
5. Register the route and add it to the micro-interactions index.

## Acceptance Criteria
- The burst feels celebratory without escaping the component bounds.
- Pointer, keyboard, and reduced-motion states are implemented.
- The component is reusable outside the demo page.

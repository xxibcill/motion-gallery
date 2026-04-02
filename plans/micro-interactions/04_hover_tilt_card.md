# Task 04: Hover Tilt Product Card

## Status
Done

## Goal
Create a product card with restrained 3D tilt, a passing sheen, and depth-separated content layers.

## Route
- `/micro-interactions/hover-tilt-card`

## Deliverables
- Reusable `HoverTiltCard` component.
- Demo route with tilt and glare controls.
- Reduced-motion fallback using shadow, border, and static spotlight changes.

## Files And Surfaces
- `components/micro-interactions/HoverTiltCard.tsx`
- `app/micro-interactions/hover-tilt-card/page.tsx`
- `app/micro-interactions/page.tsx`
- `lib/animation-registry.ts`

## Steps
1. Map pointer position to bounded rotation and glare offset.
2. Separate foreground content from base card depth.
3. Clamp transforms for touch and low-precision pointers.
4. Register the route and surface it in the index.

## Acceptance Criteria
- The effect adds depth without making the card feel gimmicky.
- Mobile and reduced-motion states stay controlled.

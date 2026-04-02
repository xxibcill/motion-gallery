# Task 08: Drag Lift Sort Cards

## Status
Done

## Goal
Create a reorderable card list with lift, placeholder spacing, and deliberate settle animation.

## Route
- `/micro-interactions/drag-sort`

## Deliverables
- Reusable `DragLiftSortCards` component.
- Demo route with card count and axis controls.
- Reduced-motion fallback with minimal lift and immediate reorder.

## Files And Surfaces
- `components/micro-interactions/DragLiftSortCards.tsx`
- `app/micro-interactions/drag-sort/page.tsx`
- `app/micro-interactions/page.tsx`
- `lib/animation-registry.ts`

## Steps
1. Build drag lift, placeholder spacing, reorder, and settle states.
2. Align keyboard reorder affordances with pointer behavior.
3. Add controls for card count and axis.
4. Register the route and surface it in the index.

## Acceptance Criteria
- Reordering remains legible during drag and after drop.
- Keyboard and reduced-motion paths remain usable.

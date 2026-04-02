# Task 05: Spotlight Hover Link List

## Status
Done

## Goal
Build a dense link list where a cursor-led spotlight and focus treatment make the active row obvious.

## Route
- `/micro-interactions/spotlight-links`

## Deliverables
- Reusable `SpotlightLinkList` component.
- Demo route with spotlight size and easing controls.
- Reduced-motion fallback using a static focus highlight.

## Files And Surfaces
- `components/micro-interactions/SpotlightLinkList.tsx`
- `app/micro-interactions/spotlight-links/page.tsx`
- `app/micro-interactions/page.tsx`
- `lib/animation-registry.ts`

## Steps
1. Animate spotlight position separately from text color.
2. Support keyboard focus and simplified touch behavior.
3. Add controls for spotlight size and easing feel.
4. Register the route and surface it in the index.

## Acceptance Criteria
- Hover and keyboard-active states feel continuous.
- Touch and reduced-motion fallbacks remain readable.

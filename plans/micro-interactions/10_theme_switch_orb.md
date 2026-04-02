# Task 10: Theme Switch Orb

## Status
Done

## Goal
Create a theme switch where the thumb behaves like an orb and the track feels like a contained environment shift.

## Route
- `/micro-interactions/theme-switch`

## Deliverables
- Reusable `ThemeSwitchOrb` component.
- Demo route with palette and orb-size controls.
- Reduced-motion fallback with direct state swap and color fade.

## Files And Surfaces
- `components/micro-interactions/ThemeSwitchOrb.tsx`
- `app/micro-interactions/theme-switch/page.tsx`
- `app/micro-interactions/page.tsx`
- `lib/animation-registry.ts`

## Steps
1. Coordinate thumb travel, icon morph, and accent changes.
2. Keep the demo usable with either simulated or real theme state.
3. Add controls for palette and orb size.
4. Register the route and surface it in the index.

## Acceptance Criteria
- The switch feels contained and deliberate instead of decorative noise.
- Reduced motion preserves the same state meaning.

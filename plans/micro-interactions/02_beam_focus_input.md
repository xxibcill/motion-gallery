# Task 02: Beam Focus Input

## Status
Done

## Goal
Create an input with a directional beam sweep and edge glow that makes focus feel intentional while preserving legibility.

## Route
- `/micro-interactions/beam-focus-input`

## Deliverables
- Reusable `BeamFocusInput` component.
- Demo route with glow strength and beam speed controls.
- Reduced-motion fallback that keeps border and background transitions only.

## Files And Surfaces
- `components/micro-interactions/BeamFocusInput.tsx`
- `app/micro-interactions/beam-focus-input/page.tsx`
- `app/micro-interactions/page.tsx`
- `lib/animation-registry.ts`

## Steps
1. Build idle, hover, focus, and invalid states.
2. Keep beam treatment behind text and caret.
3. Add controls for glow strength and beam speed.
4. Register the route and surface it in the index.

## Acceptance Criteria
- Focus treatment is clear without hurting readability.
- Reduced motion removes sweeping travel and preserves the same state changes.

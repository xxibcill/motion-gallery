# Task 12: Stepper Progress Pulse

## Status
Done

## Goal
Create a stepper where completion sends a short pulse through the connector toward the next step.

## Route
- `/micro-interactions/stepper-progress`

## Deliverables
- Reusable `StepperProgressPulse` component.
- Demo route with step count and active index controls.
- Reduced-motion fallback using direct color and icon transitions.

## Files And Surfaces
- `components/micro-interactions/StepperProgressPulse.tsx`
- `app/micro-interactions/stepper-progress/page.tsx`
- `app/micro-interactions/page.tsx`
- `lib/animation-registry.ts`

## Steps
1. Animate completed, active, and upcoming states with connector emphasis.
2. Support forward and backward state changes.
3. Add controls for step count and active index.
4. Register the route and surface it in the index.

## Acceptance Criteria
- Progress direction is clear during both forward and backward moves.
- Reduced motion preserves completed versus active state clarity.

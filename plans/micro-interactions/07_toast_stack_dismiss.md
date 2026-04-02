# Task 07: Toast Stack Dismiss

## Status
Done

## Goal
Build a toast stack with staggered entry, swipe dismissal, and clean reflow between items.

## Route
- `/micro-interactions/toast-stack`

## Deliverables
- Reusable `ToastStackDemo` component.
- Demo route with stack size and timeout controls.
- Reduced-motion fallback with fade-based transitions and no drag gesture.

## Files And Surfaces
- `components/micro-interactions/ToastStackDemo.tsx`
- `app/micro-interactions/toast-stack/page.tsx`
- `app/micro-interactions/page.tsx`
- `lib/animation-registry.ts`

## Steps
1. Implement entry, auto-dismiss, action hover, and swipe-dismiss states.
2. Animate stack reflow without overlap artifacts.
3. Add controls for stack size and timeout.
4. Register the route and surface it in the index.

## Acceptance Criteria
- Dismissal feels directional and readable.
- Reduced motion keeps the stack understandable without drag energy.

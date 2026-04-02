# Task 06: Notification Bell Peek

## Status
Done

## Goal
Create a compact anchored tray that expands from a bell trigger with separate badge pulse and panel choreography.

## Route
- `/micro-interactions/notification-bell`

## Deliverables
- Reusable `NotificationBellPeek` component.
- Demo route with tray size and badge count controls.
- Reduced-motion fallback with static badge and simple opacity reveal.

## Files And Surfaces
- `components/micro-interactions/NotificationBellPeek.tsx`
- `app/micro-interactions/notification-bell/page.tsx`
- `app/micro-interactions/page.tsx`
- `lib/animation-registry.ts`

## Steps
1. Build anchor-to-panel open and close choreography.
2. Add focus management and outside-click dismissal.
3. Separate badge pulse from tray open motion.
4. Register the route and surface it in the index.

## Acceptance Criteria
- Trigger, tray, and dismissal behavior are accessible.
- Reduced motion preserves state change without spatial growth.

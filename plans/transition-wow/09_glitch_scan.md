# Task 09: Glitch Scan Demo

## Status
Done

## Goal
Build a deliberate digital transition with scan lines, RGB splitting, jitter frames, and distorted wipes that still feels controlled.

## Route
- `/transition/glitch-scan`

## Deliverables
- A cyberpunk or broadcast-interference transition style.
- Scan-driven state changes with intentional visual corruption.
- Strong type and color choices that support the effect.

## Files And Surfaces
- `app/transition/glitch-scan/page.tsx`
- Optional helpers for scan lines, channel splitting, or jitter overlays
- `lib/animation-registry.ts`

## Dependencies
- Tasks 01 through 03

## Steps
1. Build a scene that can tolerate digital distortion without losing legibility.
2. Add transient RGB shifts, scan bands, or frame jumps to the transition.
3. Use short, precise timing so the effect feels designed instead of noisy.
4. Ensure the page remains performant by limiting continuous expensive filters.

## Acceptance Criteria
- The demo feels intentionally digital, not broken.
- Distortion moments are sharp and temporary.
- The route is noticeably different from every other transition aesthetic.
- Text and controls stay usable.

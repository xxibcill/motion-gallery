# Task 05: Liquid Reveal Demo

## Status
Done

## Goal
Create a fluid, organic transition where the next scene is uncovered by morphing blobs, elastic masks, and soft diffusion.

## Route
- `/transition/liquid-reveal`

## Deliverables
- A demo with liquid-like masks and shape morphing.
- Smooth, elastic timing that contrasts with the harder panel demo.
- A rich color treatment with bloom, translucency, or frosted depth.

## Files And Surfaces
- `app/transition/liquid-reveal/page.tsx`
- Optional helper components for blob masks or layered gradients
- `lib/animation-registry.ts`

## Dependencies
- Tasks 01 through 03

## Steps
1. Build a masked reveal driven by expanding or morphing organic forms.
2. Layer multiple blobs so the scene unfolds in waves rather than one simple circle wipe.
3. Add subtle blur and glow to support the fluid aesthetic.
4. Keep the effect performant by limiting high-cost filters to key layers.

## Acceptance Criteria
- The transition reads as liquid or ink-like rather than a basic radial reveal.
- Motion curves feel elastic and premium.
- Visual treatment is materially different from the editorial and glitch directions.
- Reduced-motion fallback still communicates state change cleanly.

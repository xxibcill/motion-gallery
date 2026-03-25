# Task 03: Shared Transition Toolkit

## Status
Done

## Goal
Build reusable low-level primitives for the transition lab so the 10 demos share solid infrastructure without looking visually repetitive.

## Deliverables
- Create a `components/transition-lab/` toolkit for masks, overlays, noise, scene wrappers, and motion utilities.
- Centralize shared timing presets, z-index layering rules, and reduced-motion fallbacks.
- Avoid copy-pasting transition mechanics across ten pages.

## Files And Surfaces
- `components/transition-lab/SceneFrame.tsx`
- `components/transition-lab/TransitionStage.tsx`
- `components/transition-lab/NoiseOverlay.tsx`
- `components/transition-lab/GradientVeil.tsx`
- `components/transition-lab/SharedElementShell.tsx`
- `lib/animation-presets.ts`
- `lib/transition-lab.ts` if shared config is needed

## Dependencies
- Task 02 should be in place so the toolkit can align with the section shell.

## Steps
1. Define a small set of primitives that can be reused across multiple demos.
2. Move shared easing, duration, spring, and overlay values out of page files.
3. Add a reduced-motion switch so each demo can degrade gracefully.
4. Keep the toolkit composable instead of turning it into a single giant abstraction.
5. Document expected usage patterns inside the task output or code comments where useful.

## Acceptance Criteria
- At least four of the later demo pages can reuse the toolkit directly.
- Reduced-motion handling is available as a shared pattern.
- Reusable primitives are generic enough to support very different aesthetics.
- The toolkit improves speed of later implementation instead of creating coupling.

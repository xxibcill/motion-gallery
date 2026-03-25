# Task 02: Transition Section Shell

## Status
Done

## Goal
Create the dedicated `/transition` section that feels intentional and premium instead of just another folder with pages.

## Deliverables
- Add a shared layout for all transition demos.
- Add a hub page at `/transition` with a strong visual identity and demo cards.
- Establish section-level copy, navigation, and page framing.
- Reserve space for future filters or demo controls without redesigning the section later.

## Files And Surfaces
- `app/transition/layout.tsx`
- `app/transition/page.tsx`
- `app/transition/loading.tsx` if a loading state is desired
- `app/globals.css` or section-local styles
- `lib/animation-registry.ts`

## Dependencies
- Task 01 should be complete so the hub can register and link to nested routes cleanly.

## Steps
1. Create `app/transition/layout.tsx` with a shared shell for headline, background atmosphere, and persistent local navigation if needed.
2. Build `app/transition/page.tsx` as the index for the transition lab.
3. Register the hub route in the animation registry with a proper title and description.
4. Design the hub so each demo card previews a different mood rather than repeating one visual system.
5. Make sure the section works on mobile and desktop without layout collapse.

## Acceptance Criteria
- `/transition` exists and is visually distinct from the generic gallery pages.
- The page clearly introduces the 10 demo variations and the showcase route.
- The hub supports client-side navigation to every demo.
- The section shell does not conflict with the global nav.

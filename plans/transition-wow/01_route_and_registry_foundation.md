# Task 01: Route And Registry Foundation

## Status
Done

## Goal
Refactor the gallery's route metadata so transition demos can live under a real `/transition/*` section without breaking navigation, gallery cards, or active states.

## Deliverables
- Add explicit `path` support to the animation registry instead of deriving URLs from `id`.
- Keep `id` as the stable key for search, filtering, and component identity.
- Update navigation and gallery link generation to use `path`.
- Support active-state matching for nested routes like `/transition/liquid-reveal`.

## Files And Surfaces
- `lib/animation-registry.ts`
- `components/animation-nav.tsx`
- `app/gallery/page.tsx`
- Any helper utilities needed for route matching

## Dependencies
- None. This task should land first.

## Steps
1. Extend `AnimationMeta` with `path` and optional group metadata if useful.
2. Update existing animation registrations to include full paths.
3. Change nav links from `/${animation.id}` to `animation.path`.
4. Change gallery cards to link with `animation.path`.
5. Update active-state logic to treat `/transition` as active for the hub and `/transition/*` as active for children.
6. Confirm there are no remaining hard-coded route assumptions.

## Acceptance Criteria
- Existing routes still work after the refactor.
- Nested transition routes can be added without touching nav link logic again.
- Search and filtering continue to work with no behavior regression.
- No component assumes that route path can be derived from `id`.

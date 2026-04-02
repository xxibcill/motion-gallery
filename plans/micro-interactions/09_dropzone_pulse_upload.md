# Task 09: Dropzone Pulse Upload

## Status
Done

## Goal
Build a dropzone that advertises drag-over state clearly, then resolves into upload progress and confirmation.

## Route
- `/micro-interactions/dropzone-upload`

## Deliverables
- Reusable `DropzonePulseUpload` component.
- Demo route with drag state and progress controls.
- Reduced-motion fallback using color and copy changes only.

## Files And Surfaces
- `components/micro-interactions/DropzonePulseUpload.tsx`
- `app/micro-interactions/dropzone-upload/page.tsx`
- `app/micro-interactions/page.tsx`
- `lib/animation-registry.ts`

## Steps
1. Implement idle, hover, drag-over, uploading, success, and error states.
2. Separate drag-over pulse from upload progress animation.
3. Add controls for drag state and progress.
4. Register the route and surface it in the index.

## Acceptance Criteria
- Drag-over state is obvious without dominating the layout.
- Reduced motion preserves upload state clarity.

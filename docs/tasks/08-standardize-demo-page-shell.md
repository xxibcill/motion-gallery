# Task 08: Standardize The Demo Page Shell

## Objective

Reduce maintenance cost by making demo pages follow a more consistent structural pattern.

## Why This Matters

The repo has many isolated pages. Even small inconsistencies in page shell structure increase the cost of testing, documentation, and future updates.

## Scope

- Identify the most repeated demo page layout patterns.
- Extract or standardize a shared shell only where duplication is obvious.
- Aim for a stable structure that usually includes:
  - title
  - description
  - demo stage
  - controls area when needed
  - reduced-motion note when relevant
- Start with the most repeated slice of the app, not the whole repo at once.

## Target Files

- `app/micro-interactions/`
- `app/transition/`
- `components/`

## Deliverables

- One reusable page-shell pattern or a small normalization pass on the most duplicated routes.
- Cleaner structure that makes smoke testing and docs easier.

## Acceptance Criteria

- At least one repeated page pattern is consolidated or normalized.
- The change reduces duplication rather than moving it around.
- Existing demos keep their current behavior.

## Out Of Scope

- Rebuilding every route to use one universal abstraction.
- Broad visual redesign.
- Changing demo concepts or motion behavior.


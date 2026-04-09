# Task 05: Create The First Registry Items

## Objective

Package the first small set of animation components as concrete registry items.

## Why This Matters

The project needs one end-to-end install path that proves the model before spending time on broad coverage or custom tooling.

## Scope

- Pick the pilot set from the portability audit.
- Add concrete registry item definitions for each pilot component.
- Ensure each item includes its source files and declared npm dependencies.
- Prefer small self-contained micro-interactions over complex scenes.

## Target Files

- `registry/`
- `registry.json`
- The installable item catalog added earlier

## Deliverables

- 3 to 5 registry items for pilot animation components.
- Correct dependency declarations, including `motion` for items that use it.
- Clear naming for item install commands.

## Acceptance Criteria

- Each pilot item has a complete registry definition.
- No pilot item silently depends on gallery-only code or route metadata.
- Item names are stable, kebab-case, and suitable for public install commands.

## Out Of Scope

- Publishing the registry publicly.
- Adding every gallery component.
- Building a custom wrapper CLI.

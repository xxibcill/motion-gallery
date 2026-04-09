# Task 09: Add Namespaced Registry Support

## Objective

Make the pilot registry consumable through a configured namespace such as `@motion-gallery/...` instead of URL-only installs.

## Why This Matters

Direct URL installation is enough for validation, but namespaced installs provide the cleaner long-term DX users expect from a reusable component library.

## Scope

- Decide the namespace name and URL pattern for hosted registry items.
- Document the `components.json` configuration required by consumers.
- Ensure generated output paths and naming support stable namespaced URLs.
- Keep the scope limited to the pilot registry items.

## Target Files

- `README.md`
- Any hosting or registry docs under `docs/`
- `public/r/` or related output path docs if naming changes are required

## Deliverables

- A documented namespace configuration example.
- Stable namespaced install examples for pilot items.
- Any small path or naming adjustments needed for clean namespaced resolution.

## Acceptance Criteria

- A consumer can configure a registry namespace and install a pilot item by name.
- The docs clearly separate producer responsibilities from consumer setup.
- Namespaced support builds on the existing registry output instead of replacing it.

## Out Of Scope

- Building a custom CLI binary.
- Private registry authentication.
- Expanding beyond the pilot set.

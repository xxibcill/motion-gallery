# Task 08: Add Local Registry Verification

## Objective

Add a lightweight verification path that proves the pilot items can actually be installed into a fresh target project.

## Why This Matters

Registry JSON can look correct while still failing on imports, dependency declarations, or file targets. The project needs a small reproducible check.

## Scope

- Add a minimal verification workflow for local development.
- Prefer one small fixture project or scripted smoke check over a large test harness.
- Verify that pilot items install, dependencies resolve, and files land in expected paths.
- Keep the check focused on the highest-risk integration failures.

## Target Files

- `tests/` or a small verification fixture directory
- `package.json`
- Any supporting test or script file created for verification

## Deliverables

- A documented local verification command.
- A reproducible smoke path for installing at least one pilot item into a sample project.

## Acceptance Criteria

- A maintainer can run one small check and catch broken registry output.
- The check exercises real installation behavior, not just static JSON validation.
- Failures point to installability problems rather than unrelated app concerns.

## Out Of Scope

- Full end-to-end publishing validation.
- Visual regression testing.
- Extensive multi-framework coverage.

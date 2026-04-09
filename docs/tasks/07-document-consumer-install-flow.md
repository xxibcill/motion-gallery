# Task 07: Document The Consumer Install Flow

## Objective

Explain how another project should install the pilot animation components.

## Why This Matters

Even a working registry is hard to use if the install path, dependency expectations, and configuration steps are undocumented.

## Scope

- Document direct URL installation for pilot items.
- Document local-file installation for development if helpful.
- Explain when consumers need to configure a `components.json` registry namespace and when they do not.
- Note dependency behavior, especially that items can declare npm packages like `motion`.

## Target Files

- `README.md`
- Any dedicated registry usage doc under `docs/`

## Deliverables

- A short contributor or consumer guide for installing items.
- Concrete example commands for at least one pilot item.
- Clear notes about dependencies and expected target project setup.

## Acceptance Criteria

- A developer can tell how to install a pilot item by URL.
- The docs explain the difference between direct URL install and namespaced install.
- The docs do not promise a custom CLI that does not exist yet.

## Out Of Scope

- Implementing namespaced registry support.
- Wrapper CLI design.
- Publishing a website for the registry.

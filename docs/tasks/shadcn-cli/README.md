# Shadcn-Compatible CLI Task Pack

This folder breaks the animation distribution work into small tasks for smaller coding agents.

The goal is to make selected motion components installable into other projects through the existing `shadcn` CLI flow first, then optionally add a thin project-specific wrapper CLI after the registry model is stable.

## Execution Order

1. [01-audit-component-portability.md](./01-audit-component-portability.md)
2. [02-add-distributable-item-catalog.md](./02-add-distributable-item-catalog.md)
3. [03-scaffold-registry-source-tree.md](./03-scaffold-registry-source-tree.md)
4. [04-extract-shared-installable-primitives.md](./04-extract-shared-installable-primitives.md)
5. [05-create-first-registry-items.md](./05-create-first-registry-items.md)
6. [06-add-registry-build-output.md](./06-add-registry-build-output.md)
7. [07-document-consumer-install-flow.md](./07-document-consumer-install-flow.md)
8. [08-add-local-registry-verification.md](./08-add-local-registry-verification.md)
9. [09-add-namespaced-registry-support.md](./09-add-namespaced-registry-support.md)
10. [10-add-thin-wrapper-cli.md](./10-add-thin-wrapper-cli.md)

## Working Rules

- Keep each task narrow. Do not absorb neighboring work unless the task explicitly requires it.
- Prefer shipping a small set of installable components over designing for the whole gallery at once.
- Preserve existing user changes in the worktree.
- Follow the local Next.js guidance in `AGENTS.md` when touching app code or build configuration.
- Prefer `shadcn` registry compatibility over bespoke installer logic.
- Run the smallest relevant verification for the task you complete.

## Overall Definition Of Done

- The repo has a dedicated registry source for installable animation components.
- At least a small pilot set of components can be installed into another project with `pnpm dlx shadcn@latest add`.
- Registry items declare their npm dependencies, including `motion` when needed.
- Shared helper code required by installable items is shipped as registry files instead of leaking gallery-only imports.
- The repo documents both direct URL installation and namespaced registry installation.
- Any project-specific wrapper CLI stays thin and delegates to the registry model rather than replacing it.

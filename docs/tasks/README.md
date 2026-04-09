# Necessary 20% Task Pack

This folder breaks the low-leverage but necessary project work into small tasks for smaller coding agents.

The goal is to reduce maintenance risk across the gallery without spending time on broad redesigns or speculative refactors.

## Execution Order

1. [01-rewrite-readme.md](./01-rewrite-readme.md)
2. [02-add-route-inventory-helper.md](./02-add-route-inventory-helper.md)
3. [03-add-core-route-smoke-tests.md](./03-add-core-route-smoke-tests.md)
4. [04-add-transition-route-smoke-tests.md](./04-add-transition-route-smoke-tests.md)
5. [05-add-route-registry-consistency-check.md](./05-add-route-registry-consistency-check.md)
6. [06-audit-micro-interactions-accessibility.md](./06-audit-micro-interactions-accessibility.md)
7. [07-audit-transition-accessibility.md](./07-audit-transition-accessibility.md)
8. [08-standardize-demo-page-shell.md](./08-standardize-demo-page-shell.md)
9. [09-performance-guardrails-pass.md](./09-performance-guardrails-pass.md)

## Working Rules

- Keep each task narrow. Do not absorb neighboring work unless the task explicitly requires it.
- Prefer additive changes over rewrites.
- Preserve existing user changes in the worktree.
- Follow the local Next.js guidance in `AGENTS.md` when touching app code.
- Run the smallest relevant verification for the task you complete.

## Overall Definition Of Done

- The README reflects the real structure of this repo.
- The gallery has route smoke coverage driven by a shared inventory source.
- Registry drift is caught automatically.
- Reduced-motion and accessibility gaps are documented and fixed on the highest-risk demos first.
- Demo pages follow a more consistent shell where practical.
- The heaviest demos have basic performance guardrails.


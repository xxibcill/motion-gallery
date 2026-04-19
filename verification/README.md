# Registry Verification

End-to-end verification that proves the hosted registry works in a fresh target project.

## Usage

```bash
pnpm verify:registry
```

This verification run:
1. Validates registry JSON files exist and are valid
2. Validates namespaced registry aliases exist under `public/r/@motion-gallery/`
3. Checks item-level schema-critical fields (`type`, `files[].path`, `files[].type`)
4. Creates a fresh temporary fixture project via `shadcn create`
5. Serves `public/` over a local HTTP server to simulate a hosted registry
6. Runs a real direct URL `shadcn add` smoke test
7. Configures `components.json` with the `@motion-gallery` registry URL
8. Installs every pilot item through `shadcn add @motion-gallery/<name>`
9. Verifies installed files and npm dependencies in the fixture
10. Runs `tsc --noEmit` after each install to catch portability and typing issues
11. Cleans up temporary files after completion

## Expected Output

```
🔍 Verifying motion-gallery registry installation

✓ index.json found (6 items)
✓ namespaced index found
✓ registry item files and schema-critical fields present

✓ fresh fixture project created
✓ local registry server started at http://127.0.0.1:<port>

🔗 Running direct URL smoke test for: slide-toggle-switch
✓ direct URL install compiled for "slide-toggle-switch"

📦 Running hosted namespaced install checks
• Installing @motion-gallery/slide-toggle-switch
  ✓ files, dependencies, and TypeScript compile passed for "slide-toggle-switch"
...

---
✅ All checks passed!

Registry is installable (verified with direct URL smoke test and hosted namespaced installs for 6 pilot items).
```

## When to Run

- After modifying `registry.json`
- After running `pnpm build:registry`
- After modifying files under `registry/`
- Before publishing or sharing the registry
- As part of CI checks (exit code 0 = pass, 1 = fail)

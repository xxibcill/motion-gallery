# Registry Verification

Lightweight verification that proves pilot items can be installed into a target project.

## Usage

```bash
pnpm verify:registry
```

This runs the smoke test which:
1. Validates registry JSON files exist and are valid
2. Validates namespaced registry aliases exist under `public/r/@motion-gallery/`
3. Checks item-level schema-critical fields (`type`, `files[].path`, `files[].type`)
4. Creates a fresh temporary fixture project via `shadcn create`
5. Runs a real `shadcn add` installation from local generated item JSON
6. Verifies installed files and npm dependencies in the fixture
7. Cleans up temporary files after completion

## Expected Output

```
🔍 Verifying motion-gallery registry installation

✓ index.json found (5 items)

📦 Running real install smoke test for: slide-toggle-switch

✓ fresh fixture project created
✓ shadcn add executed against local registry item JSON
✓ expected files installed and dependencies resolved

---
✅ All checks passed!

Registry is ready for installation.
```

## When to Run

- After modifying `registry.json`
- After running `pnpm build:registry`
- Before publishing or sharing the registry
- As part of CI checks (exit code 0 = pass, 1 = fail)

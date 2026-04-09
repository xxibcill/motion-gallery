# Registry Verification

Lightweight verification that proves pilot items can be installed into a target project.

## Usage

```bash
pnpm verify:registry
```

This runs the smoke test which:
1. Validates registry JSON files exist and are valid
2. Validates namespaced registry aliases exist under `public/r/@motion-gallery/`
3. Verifies all referenced component files exist on disk
4. Simulates installation by copying files to a temporary location
5. Checks component syntax is valid
6. Cleans up temporary files after completion

## Expected Output

```
🔍 Verifying motion-gallery registry installation

✓ index.json found (5 items)

📦 Running installation smoke tests...

  Checking: slide-toggle-switch
    ✓ 1 file(s) copied, 1 deps
  ...

✓ root registry.json found

🔧 Verifying installed component syntax...

  ✓ slide-toggle-switch/SlideToggleSwitch.tsx - syntax valid
  ...

---
✅ All checks passed!

Registry is ready for installation.
```

## When to Run

- After modifying `registry.json`
- After running `pnpm build:registry`
- Before publishing or sharing the registry
- As part of CI checks (exit code 0 = pass, 1 = fail)

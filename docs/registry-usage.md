# Registry Usage

This document describes how to install animation components from the motion-gallery registry into your own project.

## Pilot Items

The registry currently ships five pilot items:

| Item | Description |
|---|---|
| `slide-toggle-switch` | Weighted toggle with track bloom animation |
| `tab-underline-follower` | Animated tab underline with layoutId |
| `ripple-press-button` | Radial ripple feedback with reduced-motion support |
| `copy-confirmation-chip` | Clipboard utility with state flip animation |
| `like-burst-button` | Heart toggle with particle burst effect |

All five require `motion@^12.0.0` as an npm dependency.

---

## Installing a Pilot Item

### Option A: Direct URL Install

If your tooling supports adding components from a raw JSON URL, point it at the registry item file:

```
https://your-motion-gallery-host/r/slide-toggle-switch.json
```

For example, if you are serving this registry from a deployed motion-gallery instance:

```bash
npx shadcn@latest add https://example.com/r/slide-toggle-switch.json
```

This fetches the item's JSON descriptor. The `files` field lists the source files the registry will extract:

```
components/micro-interactions/SlideToggleSwitch.tsx
```

You will also need to:

1. **Install npm dependencies** listed in `npmDependencies`:
   ```bash
   pnpm add motion@^12.0.0
   ```
2. **Copy the source files** from the registry into your project at the paths specified in `files`.

> **Note:** Direct URL install requires manual coordination — the registry does not yet expose a namespaced component lookup API. A custom registry CLI (task 10) is out of scope until later.

### Option B: Local File Copy for Development

To develop against the source directly:

1. **Install the dependency:**
   ```bash
   pnpm add motion@^12.0.0
   ```

2. **Copy the source file** from the registry into your project:
   ```bash
   cp components/micro-interactions/SlideToggleSwitch.tsx your-project/components/
   ```

3. **Import and use:**
   ```tsx
   import { SlideToggleSwitch } from "@/components/SlideToggleSwitch";

   export function MySettings() {
     return <SlideToggleSwitch defaultChecked={false} />;
   }
   ```

This is the most reliable approach for active development since you get the full source and can modify it.

---

## When You Need a `components.json` Registry Namespace

You do **not** need a `components.json` registry namespace for either install method described above. A registry namespace is only required when:

- Your tooling (e.g., shadcn CLI with a named registry) resolves items by a namespaced key like `motion-gallery/slide-toggle-switch`.
- You want a single registry manifest that your tooling can query for available items.

Neither of these is required for direct URL or local-file installation. The `public/r/index.json` file in this repository is a registry index that *could* be used for future namespaced support, but no custom CLI consumes it yet.

---

## Dependencies

Every pilot item declares `motion@^12.0.0` in its `npmDependencies` field. Always install these before using the component:

```bash
pnpm add motion@^12.0.0
```

No other runtime dependencies are required.

---

## Building the Registry

The registry source lives in `registry.json`. Run the build script to generate per-item JSON files in `public/r/`:

```bash
pnpm build:registry
```

This outputs:
- `public/r/<item-name>.json` — one file per item
- `public/r/index.json` — the full registry index

These files are suitable for hosting and serving to external tooling.

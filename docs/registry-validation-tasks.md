# Registry Validation Tasks

Use this checklist when testing whether the motion-gallery registry installs and runs from a real consumer project.

## Evergreen Consumer Location

The evergreen consumer app lives at:

```txt
verification/evergreen-consumer
```

It is committed inside this repository for discoverability, but it is intentionally structured as a separate Next.js app with its own `package.json`, `pnpm-lock.yaml`, `components.json`, shadcn setup, and dev/build commands.

Do not import registry source files directly from the producer app when validating. The consumer must use files installed under `verification/evergreen-consumer/components`.

## Task 1: Build The Producer Registry

From the repository root:

```bash
pnpm build:registry
```

Confirm these generated paths exist for each item:

- `public/r/<item>.json`
- `public/r/@motion-gallery/<item>.json`

Also confirm both registry indexes exist:

- `public/r/index.json`
- `public/r/@motion-gallery/index.json`

## Task 2: Serve The Registry Locally

From the repository root:

```bash
python3 -m http.server 4179 --bind 127.0.0.1 --directory public
```

Keep this server running while reinstalling components in the evergreen consumer.

## Task 3: Install Or Reinstall Every Registry Component

From the evergreen consumer:

```bash
cd verification/evergreen-consumer
pnpm install --frozen-lockfile
pnpm dlx shadcn@latest add \
  @motion-gallery/slide-toggle-switch \
  @motion-gallery/tab-underline-follower \
  @motion-gallery/ripple-press-button \
  @motion-gallery/copy-confirmation-chip \
  @motion-gallery/like-burst-button \
  @motion-gallery/center-peek-card \
  --yes \
  --overwrite
```

Expected installed files:

| Registry item | Expected file |
|---|---|
| `slide-toggle-switch` | `components/micro-interactions/SlideToggleSwitch.tsx` |
| `tab-underline-follower` | `components/micro-interactions/TabUnderlineFollower.tsx` |
| `ripple-press-button` | `components/micro-interactions/RipplePressButton.tsx` |
| `copy-confirmation-chip` | `components/micro-interactions/CopyChipButton.tsx` |
| `like-burst-button` | `components/micro-interactions/LikeBurstButton.tsx` |
| `center-peek-card` | `components/scroll-animations/CenterPeekCard.tsx` |

Confirm `motion` is present in `verification/evergreen-consumer/package.json`.

## Task 4: Compile And Lint The Consumer

From `verification/evergreen-consumer`:

```bash
pnpm lint
pnpm build
```

Both commands must pass. A build failure means the registry item may install but is not portable into a current Next.js consumer.

## Task 5: Run The Manual Component Checklist

Start the consumer dev server:

```bash
pnpm dev
```

Open `http://localhost:3000` and verify each installed component renders and responds:

| Component | Manual check | Pass criteria |
|---|---|---|
| `SlideToggleSwitch` | Click the switch. | Thumb moves between states, `aria-checked` changes, focus ring is visible by keyboard. |
| `TabUnderlineFollower` | Click each tab, then use ArrowLeft/ArrowRight, Home, and End. | Active tab changes, panel content updates, keyboard focus follows the selected tab. |
| `RipplePressButton` | Click/tap the button and activate it with Enter or Space. | Ripple or reduced-motion flash appears from pointer position or button center. |
| `CopyChipButton` | Click the chip. | Label flips to copied state, icon changes, and resets after the timeout. |
| `LikeBurstButton` | Click the button twice. | First click toggles to liked and emits burst animation; second click returns to idle state. |
| `CenterPeekCard` | Scroll into the final section. | Peek expands into the full card without layout breakage; reduced-motion users still get readable content. |

## Task 6: Smoke Test The Route

With the dev server running:

```bash
curl -I http://127.0.0.1:3000
```

Expected result: `HTTP/1.1 200 OK`.

If port `3000` is in use, run the consumer on another port:

```bash
pnpm dev --hostname 127.0.0.1 --port 3006
curl -I http://127.0.0.1:3006
```

## Task 7: Fresh Project Playwright Visual Check

The evergreen consumer is durable, but branch validation should also prove the registry works in a brand-new app created with `create-next-app`.

Create the fresh project outside the repo or under an ignored temp path:

```bash
cd /tmp
pnpm create next-app@latest motion-gallery-registry-playwright --yes --use-pnpm
cd motion-gallery-registry-playwright
pnpm dlx shadcn@latest init --yes --defaults
pnpm add -D @playwright/test
pnpm exec playwright install chromium
```

Configure the fresh app's `components.json` with the local registry server from Task 2:

```json
{
  "registries": {
    "@motion-gallery": "http://127.0.0.1:4179/r/@motion-gallery/{name}.json"
  }
}
```

Install every registry item into the fresh project:

```bash
pnpm dlx shadcn@latest add \
  @motion-gallery/slide-toggle-switch \
  @motion-gallery/tab-underline-follower \
  @motion-gallery/ripple-press-button \
  @motion-gallery/copy-confirmation-chip \
  @motion-gallery/like-burst-button \
  @motion-gallery/center-peek-card \
  --yes \
  --overwrite
```

Create a Playwright fixture page in the fresh project that imports and renders every installed component from the fresh app's local `components/` directory. Use stable labels and containers with `data-testid` values:

| Registry item | Suggested `data-testid` |
|---|---|
| `slide-toggle-switch` | `registry-slide-toggle-switch` |
| `tab-underline-follower` | `registry-tab-underline-follower` |
| `ripple-press-button` | `registry-ripple-press-button` |
| `copy-confirmation-chip` | `registry-copy-confirmation-chip` |
| `like-burst-button` | `registry-like-burst-button` |
| `center-peek-card` | `registry-center-peek-card` |

Add a Playwright test that:

1. Starts the fresh Next.js app with `pnpm dev`.
2. Visits the fixture page.
3. Asserts every `data-testid` is visible.
4. Takes one full-page screenshot.
5. Takes one clipped screenshot per component container.
6. Exercises the interactive components before or after baseline capture:
   - click `SlideToggleSwitch`
   - click each `TabUnderlineFollower` tab
   - click and keyboard-activate `RipplePressButton`
   - click `CopyChipButton`
   - click `LikeBurstButton`
   - scroll through `CenterPeekCard`

Example screenshot assertions:

```ts
await expect(page.getByTestId("registry-slide-toggle-switch")).toBeVisible();
await expect(page).toHaveScreenshot("fresh-registry-page.png", {
  fullPage: true,
});
await expect(page.getByTestId("registry-slide-toggle-switch")).toHaveScreenshot(
  "slide-toggle-switch.png"
);
```

Also capture screenshots from the original gallery or committed evergreen consumer with the same viewport size and reduced-motion setting. Compare the fresh app screenshots against the original screenshots before approving the registry:

```bash
pnpm exec playwright test --update-snapshots
pnpm exec playwright test
```

Pass criteria:

- The fresh app compiles and runs without importing from the producer source tree.
- Every installed component is visible in Playwright.
- Full-page and per-component screenshots are captured.
- Screenshots match the original gallery or evergreen consumer closely enough that spacing, colors, motion-ready states, and component structure are recognizably the same.
- Any screenshot diff is reviewed and explained. Do not approve unexplained visual drift.

Record the screenshot artifact paths in the validation report. If a component is intentionally different in the fresh app because of surrounding layout or theme, note that explicitly and include both screenshots.

## Task 8: Record Results

When reporting validation, include:

- branch name
- registry item names tested
- shadcn install command used
- `pnpm lint` result
- `pnpm build` result
- dev URL and route smoke result
- fresh `create-next-app` project path
- Playwright command result
- full-page screenshot path
- per-component screenshot paths
- screenshot comparison result against the original gallery or evergreen consumer
- any manual checklist failures with the component name and observed behavior

Do not mark the registry as validated if only `pnpm verify:registry` passed. That script is useful, but this evergreen consumer is the durable cross-project test surface.

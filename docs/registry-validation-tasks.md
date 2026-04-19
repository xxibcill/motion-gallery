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

## Task 7: Record Results

When reporting validation, include:

- branch name
- registry item names tested
- shadcn install command used
- `pnpm lint` result
- `pnpm build` result
- dev URL and route smoke result
- any manual checklist failures with the component name and observed behavior

Do not mark the registry as validated if only `pnpm verify:registry` passed. That script is useful, but this evergreen consumer is the durable cross-project test surface.

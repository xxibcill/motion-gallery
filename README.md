# Motion Gallery

An interactive motion and animation showcase built with Next.js 16, Framer Motion, and GSAP. The gallery demonstrates scroll-driven effects, route transitions, micro-interactions, and 3D transforms through live demo pages.

## Project Structure

```
app/                     # Next.js App Router pages and layouts
├── page.tsx             # Home — scroll-based snap gallery
├── gallery/             # Browse all animations with search/filter
├── gsap/                # GSAP timeline and ScrollTrigger demos
├── parallax/            # Multi-layer depth effects
├── text-reveal/         # Character/word reveal animations
├── horizontal/          # Horizontal scroll demos
├── magnetic/            # Magnetic cursor effects
├── reveal/              # Content reveal patterns
├── 3d/                  # 3D transforms and perspective
├── combined-animation/  # Cinematic multi-effect scenes
├── scroll-reveal/       # Scroll-locked section reveals
├── anchor-elements/     # Sticky viewport rails
├── chat/                # Chat UI animations
├── category-marquee/    # Infinite marquee pills
├── shrinkable-sticky-box/  # Peek card animations
├── center-peek-shrink/  # Two-phase viewport animations
├── scroll-expand-grid/  # Scroll-triggered card expansion
├── image-compare/       # Before/after comparison slider
├── fear-greed-index/   # Gauge dashboard demo
├── fear-greed-gauge/   # Gauge mode lab
├── dimensional-rift/    # 4-phase dimensional tear
├── micro-interactions/  # 20+ micro-interaction demos
│   ├── beam-focus-input/
│   ├── inline-validation/
│   ├── magnetic-cta/
│   ├── ripple-press/
│   ├── play-pause-toggle/
│   ├── like-burst/
│   ├── copy-chip/
│   ├── hover-tilt-card/
│   ├── spotlight-links/
│   ├── notification-bell/
│   ├── toast-stack/
│   ├── drag-sort/
│   ├── dropzone-upload/
│   ├── count-up-number/
│   ├── slide-toggle/
│   ├── segmented-rail/
│   ├── chevron-accordion/
│   ├── tab-underline/
│   ├── theme-switch/
│   ├── command-palette/
│   └── stepper-progress/
└── transition/          # Transition Lab — route transition experiments
    ├── layout.tsx       # Shared transition layout
    ├── page.tsx        # Transition Lab index
    ├── showcase/       # Transition comparison showcase
    ├── kinetic-panels/
    ├── liquid-reveal/
    ├── shutter-slice/
    ├── shared-element-spotlight/
    ├── parallax-stage/
    ├── glitch-scan/
    ├── paper-fold/
    ├── magnetic-collapse/
    ├── void-portal/
    ├── gallery-curtain/
    ├── gallery/         # All transitions in a vertical gallery
    └── dimensional-rift/

components/              # Shared UI components
├── ui/                  # Generic shared components
├── transition-lab/      # Transition primitives (useTransitionDemo, TransitionStage, SharedElementShell)
├── fear-greed/          # Shared gauge components
└── micro-interactions/  # Shared micro-interaction primitives

lib/
├── animation-registry.ts  # Central metadata registry for all animations
├── animation-presets.ts  # Reusable animation primitives (springs, reveals, clipPaths, etc.)
└── ...                   # Other utility modules

tests/e2e/              # Playwright end-to-end tests
```

## Route Groups

**Core** (`/`, `/gallery`, `/gsap`, ...) — Primary animation demos. Registered in `animation-registry.ts` with `group: "core"`.

**Transition Lab** (`/transition/*`) — Route transition experiments with shared layout at `app/transition/layout.tsx`. Registered with `group: "transition-lab"`.

## Animation Registry

Every demo page must be registered in `lib/animation-registry.ts` via `registerAnimation()`. This single source of truth powers navigation, search, and filtering across the gallery.

```ts
registerAnimation({
  id: "my-demo",
  path: "/my-demo",
  title: "My Demo",
  description: "What this demo showcases",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["scroll", "spring"],
  color: "cyan",
  group: "core",
});
```

Required metadata fields:

| Field | Description |
|---|---|
| `id` | Unique kebab-case identifier |
| `path` | URL path (must match route) |
| `title` | Display name in navigation |
| `description` | One-line explanation |
| `category` | Filter category |
| `difficulty` | `beginner`, `intermediate`, or `advanced` |
| `library` | Array: `["framer-motion"]`, `["gsap"]`, or both |
| `keywords` | Searchable terms |
| `color` | Tailwind color name for UI accents |
| `group` | `"core"` or `"transition-lab"` |

## How to Add a New Demo

**1. Create the route page**

Add a `page.tsx` in `app/<your-route>/`. If it's a micro-interaction, use `app/micro-interactions/<your-demo>/page.tsx`.

**2. Register the animation**

Add a `registerAnimation()` call to `lib/animation-registry.ts`. The `path` must match the route file location.

**3. Add shared UI (if needed)**

Place reusable components in `components/` and import via `@/components/...`.

## Development Commands

```bash
pnpm dev              # Start dev server (localhost:3000)
pnpm dev:turbopack    # Start dev server with Turbopack
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm test:e2e         # Run Playwright e2e tests
pnpm test:e2e:ui      # Run Playwright with UI mode
pnpm test:e2e:debug   # Run Playwright in debug mode
```

## Tech Stack

- **Next.js 16** — App Router with SSR and client-side navigation
- **Framer Motion** — Primary animation library (scroll, spring, layout animations)
- **GSAP** — Timeline-based animations and ScrollTrigger
- **TypeScript** — Full type safety
- **Tailwind CSS v4** — Styling
- **Playwright** — End-to-end testing

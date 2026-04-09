# Component Portability Audit

**Date:** 2026-04-09
**Status:** Complete
**Scope:** `components/` and `lib/`

---

## Summary

This audit classifies each candidate component as:
- **Portable Now** — self-contained, minimal dependencies, ready for registry
- **Portable After Helper Extraction** — needs shared utilities pulled out first
- **Gallery-Only** — tightly coupled to gallery infrastructure

---

## Portable Now

These components are self-contained with clear APIs, well-typed props, and only standard dependencies (React, Framer Motion, Tailwind).

### `components/micro-interactions/SlideToggleSwitch.tsx`
- **Type:** Toggle/switch control
- **Dependencies:** `motion/react`
- **Props Interface:** Clean, typed, well-documented
- **Portability:** 100% — no external helpers or gallery imports
- **Assessment:** Excellent first candidate for registry

### `components/micro-interactions/TabUnderlineFollower.tsx`
- **Type:** Accessible tab component with animated underline
- **Dependencies:** `motion/react`
- **Props Interface:** `TabUnderlineItem[]`, `underlineStyle?: "line" | "pill"`
- **Portability:** 100% — self-contained, uses layoutId internally only
- **Accessibility:** Full ARIA tablist pattern, keyboard navigation

### `components/micro-interactions/ChevronAccordion.tsx`
- **Type:** Accordion with animated chevron
- **Dependencies:** `motion/react`
- **Props Interface:** `AccordionItem[]`, spacing, defaultOpenId, disabled
- **Portability:** 100% — self-contained
- **Accessibility:** Full ARIA accordion pattern

### `components/micro-interactions/RipplePressButton.tsx`
- **Type:** Button with ripple effect on press
- **Dependencies:** `motion/react`
- **Props Interface:** `rippleSize`, `duration`, `label`
- **Portability:** 100% — self-contained with reduced motion support

### `components/micro-interactions/SegmentedControlRail.tsx`
- **Type:** Segmented control / radio group
- **Dependencies:** `motion/react`
- **Props Interface:** `options: string[]`, `width`, `defaultValue`, `disabled`
- **Portability:** 100% — self-contained
- **Accessibility:** Full radiogroup pattern, keyboard navigation

### `components/micro-interactions/LikeBurstButton.tsx`
- **Type:** Animated like/save button with particle burst
- **Dependencies:** `motion/react`
- **Props Interface:** `idleLabel`, `likedLabel`, `defaultLiked`, `burstDensity`, `accent?: "rose" | "amber" | "cyan"`
- **Portability:** 100% — self-contained, particle system is internal
- **Note:** Complex but well-encapsulated

### `components/micro-interactions/CopyChipButton.tsx`
- **Type:** Copy-to-clipboard button with animated state
- **Dependencies:** `motion/react`, `navigator.clipboard`
- **Props Interface:** `textToCopy`, `idleLabel`, `copiedLabel`, `resetAfter`
- **Portability:** 100% — self-contained, handles clipboard API gracefully

### `components/micro-interactions/MorphPlayPauseToggle.tsx`
- **Type:** Play/pause toggle with morphing animation
- **Dependencies:** `motion/react`
- **Props Interface:** `size`, `cornerRounding`, `defaultPlaying`
- **Portability:** 100% — self-contained, uses SVG morphing

### `components/micro-interactions/ThemeSwitchOrb.tsx`
- **Type:** Theme toggle with animated orb
- **Dependencies:** `motion/react`
- **Props Interface:** `checked`, `onChange`, `palette?: "dawn" | "aurora" | "ember"`, `orbSize`
- **Portability:** 100% — self-contained, controlled component

### `components/micro-interactions/HoverTiltCard.tsx`
- **Type:** 3D tilt card with spotlight effect
- **Dependencies:** `motion/react`
- **Props Interface:** `tilt`, `glare`, `title`, `description`, `price`
- **Portability:** 100% — self-contained, reduced motion fallback

### `components/micro-interactions/NotificationBellPeek.tsx`
- **Type:** Notification bell with anchored tray
- **Dependencies:** `motion/react`
- **Props Interface:** `items[]`, `badgeCount`, `trayWidth`
- **Portability:** 100% — self-contained, focus trap on open

### `components/transition-lab/NoiseOverlay.tsx`
- **Type:** Procedural noise texture overlay
- **Dependencies:** None (pure CSS)
- **Props Interface:** `className`, `opacity`
- **Portability:** 100% — but likely gallery-specific aesthetic
- **Note:** Pure presentation, could be genericized

### `components/fear-greed/FGChip.tsx`
- **Type:** Fear & Greed level chip
- **Dependencies:** `@/lib/utils`, `@/lib/utils/fearGreed`
- **Props Interface:** `level: FearGreedLevel`, `className`
- **Portability:** 100% — but domain-specific (fear-greed index)
- **Note:** Domain-coupled; useful if you have a crypto finance app

### `components/category-marquee/MarqueeChip.tsx`
- **Type:** Category chip with icon
- **Dependencies:** `lucide-react`
- **Props Interface:** `category: { name, color, icon }`
- **Portability:** 100% — simple, icon-driven
- **Note:** Requires lucide-react as peer dependency

### `components/transition-lab/DemoToolbar.tsx`
- **Type:** Generic toolbar for demo controls
- **Dependencies:** None
- **Props Interface:** Generic `<T extends string>` for options
- **Portability:** 100% — actually quite reusable
- **Note:** Despite being in transition-lab, it's a generic UI pattern

---

## Portable After Helper Extraction

These components are potentially portable but require shared utilities to be extracted first.

### `components/micro-interactions/MagneticCtaButton.tsx`
**Current Blockers:**
- Uses `useSpring`, `useMotionValue` from `motion/react`
- Internal `clamp()` utility

**What to Extract:**
- `lib/motion-utils.ts` — `useSpring`, `useMotionValue` hooks wrappers
- `lib/math-utils.ts` — `clamp()` function

**After Extraction:** 100% portable

### `components/peek-cards/` (configs + components)
**Current Blockers:**
- `BottomPeekCard` imports from `@/components/peek-cards/configs`
- `peek-snap-sections.tsx` imports from same

**What to Extract:**
- `lib/peek-card-config.ts` — extract `PEEK_SPRING_GENTLE`, `PEEK_SPRING_SMOOTH`, etc.
- `lib/peek-card-config.ts` — extract scroll-driven animation helpers

**After Extraction:** Components become portable, but scroll-driven behavior is complex

### `components/chat/ChatMessage.tsx`
**Current Blockers:**
- Imports `springPresets` from `@/lib/animation-presets`

**What to Extract:**
- Move `springPresets` to a more accessible location (already in `lib/animation-presets.ts` which is portable)

**After Extraction:** 100% portable — the component itself is simple

---

## Gallery-Only for Now

These components are tightly coupled to gallery infrastructure (routing, pages, animation registry, scene composition).

### `components/transition-lab/useTransitionDemo.ts`
**Why Not Portable:**
- Explicitly designed for transition lab demo state management
- Tied to `startTransition` and route-level state patterns
- No props interface — hook only

### `components/transition-lab/TransitionStage.tsx`
**Why Not Portable:**
- Depends on `@/lib/transition-lab` (z-index layers, entrance animations)
- Depends on `NoiseOverlay`
- Uses CSS variables from gallery theme (`var(--surface-1)`, `var(--border-subtle)`)
- Aesthetic tightly coupled to transition lab look

### `components/transition-lab/SharedElementShell.tsx`
**Why Not Portable:**
- Depends on `@/lib/transition-lab`
- Uses `layoutId` for shared element transitions (route-level concern)
- Aesthetic coupled to transition lab (rounded-[1.75rem], backdrop-blur)

### `components/transition-lab/GradientVeil.tsx`
**Why Not Portable:**
- Depends on `@/lib/transition-lab` (layers, easings)
- Depends on `transitionLabDurations`, `transitionLabEasings`
- Aesthetic coupled to transition lab (fluid easing, linger duration)

### `components/transition-lab/SceneFrame.tsx`
**Why Not Portable:**
- Depends on `@/lib/transition-lab`
- Uses CSS variables for theming (`var(--text-primary)`, etc.)
- Layout pattern specific to transition lab pages

### `components/transition-lab/TransitionPreviewCard.tsx`
**Why Not Portable:**
- Complex, depends on `AnimationMeta` from `@/lib/animation-registry`
- Switch statement mapping slugs to preview animations
- Uses `TransitionStage`, `GradientVeil`, `Link` (Next.js)
- Full page-level component

### `components/transition-lab/TransitionGallery.tsx`
**Why Not Portable:**
- Complex, depends on `@/lib/transition-renderers`
- Uses `showcaseModes`, `getDuration`, `getOverlayForMode`
- Full page-level component

### `components/transition-lab/DimensionalRift/` (entire folder)
**Why Not Portable:**
- Multi-file complex scene (Shard, StarField, VoidPull, DimensionalTunnel, RealityFracture, Reassembly)
- Orchestrates 4-phase animation sequence
- Depends on `dimensional-rift-presets.ts`, `DemoToolbar`, `TransitionStage`
- Represents the most complex animation in the gallery

### `components/transition-lab/TransitionSectionNav.tsx`
**Why Not Portable:**
- Depends on `@/lib/route-matching`
- Uses Next.js `Link`
- Gallery navigation component

### `components/transition-lab/ShowcaseController.tsx`
**Why Not Portable:**
- Depends on `@/lib/transition-renderers`
- Complex controller for transition showcase

### `components/transition-lab/TransitionShowcase.tsx`
**Why Not Portable:**
- Page-level component
- Depends on multiple transition-lab components

### `components/scroll-reveal-section.tsx`
**Why Not Portable:**
- Fixed/sticky scroll behavior specific to gallery layout
- Hardcoded gradient backgrounds and text content
- Fixed viewport height (`400vh`)

### `components/peek-snap-sections.tsx`
**Why Not Portable:**
- Complex scroll-driven snap behavior with fixed positioning
- `PEEK_CONFIG` embedded in file
- Progress indicator and scroll hint tied to viewport
- Uses `useScroll`, `useTransform`, `useSpring` extensively

### `components/bottom-peek-card.tsx`, `components/bottom-peek-card-v2.tsx`
**Why Not Portable:**
- Depend on `@/components/peek-cards/configs`
- Scroll-driven behavior tied to gallery page structure
- `BottomPeekContent` has gallery-specific content layout

### `components/center-peek-card.tsx`, `components/center-peek-shrink-card.tsx`
**Why Not Portable:**
- Scroll-driven behavior
- Depend on peek-cards configs
- Gallery-specific demo content

### `components/animation-nav.tsx`
**Why Not Portable:**
- Depends on `@/lib/animation-registry`
- Uses Next.js routing
- Gallery navigation component

### `components/code-panel.tsx`
**Why Not Portable:**
- Code display panel for demos
- Likely depends on gallery code display infrastructure

### `components/ControlsPanel.tsx`
**Why Not Portable:**
- Gallery control panel for demos
- Depends on animation registry

### `components/anchor-elements-demo.tsx`
**Why Not Portable:**
- Demo-specific page component

### `components/scroll-expand-grid.tsx`
**Why Not Portable:**
- Scroll-driven grid expansion
- Gallery-specific layout

### `components/center-peek-expand-grid.tsx`
**Why Not Portable:**
- Gallery-specific scroll behavior

### `components/ui/controls.tsx`
**Why Not Portable:**
- Gallery-specific UI controls

---

## Recommended Pilot Set (3-5 Components)

For the first registry release, start with these well-isolated, highly reusable components:

### 1. `SlideToggleSwitch` (Highest Priority)
**Why:** Dead simple, fully self-contained, clear API, demonstrates toggle pattern with spring animation.

### 2. `TabUnderlineFollower`
**Why:** Shows off layoutId animation pattern, excellent accessibility, complete ARIA implementation.

### 3. `RipplePressButton`
**Why:** Adds tactile feedback pattern, well-documented props, reduced motion support.

### 4. `CopyChipButton`
**Why:** Practical utility (clipboard), animated state transitions, shows real-world interaction.

### 5. `LikeBurstButton` (if feeling ambitious)
**Why:** Demonstrates particle system, multi-state animation, accent color theming.

**Alternative for simpler pilot:** Replace `LikeBurstButton` with `SegmentedControlRail` — same complexity as others but less visually dramatic.

---

## Helper Libraries to Extract First

Before releasing components that use shared utilities:

1. **`lib/motion-utils.ts`** (if needed)
   - Extract `clamp()` for `MagneticCtaButton`
   - Current components don't heavily depend on this — may not need extraction

2. **`lib/animation-presets.ts`** — Already portable
   - `springPresets`, `revealPresets`, `clipPathPresets`, `transitionPresets`, `staggerPresets`
   - These are already framework-agnostic animation configs

3. **`lib/design-tokens.ts`** — Already portable
   - `borders`, `backgrounds`, `radii`, `shadows`, `typography`
   - These are already reusable Tailwind tokens

---

## Portability Blockers Per Non-Portable Candidate

| Component | Blocker 1 | Blocker 2 | Blocker 3 |
|-----------|-----------|-----------|-----------|
| `TransitionStage` | `@/lib/transition-lab` | CSS variables (`var(--surface-1)`) | `NoiseOverlay` dependency |
| `SharedElementShell` | `@/lib/transition-lab` | `layoutId` (route-level) | Gallery aesthetic classes |
| `GradientVeil` | `@/lib/transition-lab` | `transitionLabDurations` | `transitionLabEasings` |
| `useTransitionDemo` | Hook-only (not a component) | `startTransition` for routes | Gallery state pattern |
| `TransitionPreviewCard` | `AnimationMeta` type | Slug-to-preview mapping | `TransitionStage` dependency |
| `TransitionGallery` | `@/lib/transition-renderers` | `showcaseModes` | Page-level component |
| `DimensionalRift/*` | Multi-file orchestration | `@/lib/transition-lab` | Phase sequence logic |
| `PeekSnapSections` | Fixed scroll behavior | `PEEK_CONFIG` embedded | Progress indicator |
| `BottomPeekCard` | `@/components/peek-cards/configs` | Scroll-driven | Gallery layout |
| `ScrollRevealSection` | Fixed `400vh` height | Embedded content | Gallery layout |

---

## Out of Scope Confirmed

Per the task requirements:
- No refactoring of existing components
- No registry file creation
- No CLI behavior
- This audit document is the deliverable

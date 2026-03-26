# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start development server (localhost:3000)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Architecture Overview

This is a motion/animation gallery showcasing Framer Motion and GSAP techniques in Next.js 16.

### Animation Registry System

`lib/animation-registry.ts` is the central source of truth for all animations. Each animation has metadata (id, path, title, description, category, difficulty, library, keywords, color, group). New animations must be registered here to appear in navigation.

Animation groups:
- `core` - Main gallery demos (gsap, parallax, text-reveal, etc.)
- `transition-lab` - Route transition experiments under `/transition/`

### Reusable Animation Presets

`lib/animation-presets.ts` contains shared animation primitives:
- `springPresets` - Spring physics configurations (gentle, snappy, bouncy, etc.)
- `revealPresets` - Fade/scale/blur entrance animations
- `clipPathPresets` - Mask reveal patterns
- `transitionPresets` - Duration/easing combos
- `staggerPresets` - List stagger timings

### Transition Lab

The `/transition/` section has its own layout (`app/transition/layout.tsx`) with shared styling. Components in `components/transition-lab/` provide reusable primitives:
- `useTransitionDemo` - Hook for demo state management (active value, replay)
- `TransitionStage` - Wrapper for transition scenes
- `SharedElementShell` - Shared element transition container

### Path Alias

`@/*` maps to project root. Use `@/lib/...` and `@/components/...` imports.

## Next.js 16 Notes

This version has breaking changes. Read relevant guides in `node_modules/next/dist/docs/` before writing code.

For instant client-side navigations with Suspense boundaries, see `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.

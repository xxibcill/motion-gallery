# Micro-Interactions Roadmap

This roadmap turns the gallery into a second track focused on compact, high-feedback interactions instead of full-scene transitions. The goal is to ship isolated, reusable components that can live as their own demos and later be composed into richer interfaces.

## Direction

- Personality: tactile, polished, confident, and slightly playful.
- Motion rule: interaction feedback should usually resolve in `120ms` to `280ms`; only celebratory states should run longer.
- Easing rule: prefer decisive ease-out curves over bounce-heavy motion.
- Rendering rule: animate `transform`, `opacity`, `filter`, and CSS variables before touching layout properties.
- Accessibility rule: every component must respect `useReducedMotion()` and remain understandable with motion removed.
- Structure rule: each interaction should ship as a reusable component plus a dedicated demo route.

## Shared Foundation Tasks

- [x] Create `components/micro-interactions/` for reusable interaction primitives.
- [x] Create `app/micro-interactions/` for dedicated demo pages.
- [x] Add a shared `MicroInteractionScene` wrapper for title, description, control panel, and reduced-motion notes.
- [x] Add shared motion tokens in [app/globals.css](/Users/jjae/Documents/guthib/motion-gallery/app/globals.css) for duration and easing values.
- [x] Reuse `motion/react` as the default animation layer unless a specific demo truly benefits from GSAP.
- [x] Register completed demos in [lib/animation-registry.ts](/Users/jjae/Documents/guthib/motion-gallery/lib/animation-registry.ts) only when the route exists.

## Component Contract

Each micro-interaction component should follow the same contract:

- Component path: `components/micro-interactions/<ComponentName>.tsx`
- Demo route: `app/micro-interactions/<slug>/page.tsx`
- Demo content: short explanation, live example, adjustable controls, reduced-motion fallback note, and code sample later if desired
- Props baseline: `disabled`, `className`, and any interaction-specific knobs such as `intensity`, `duration`, or `defaultState`
- Accessibility baseline: keyboard trigger, focus-visible styling, ARIA label/state where needed, and a no-motion fallback that preserves the same state change

## Backlog Overview

| ID | Interaction | Why It Belongs | Component | Route | Difficulty |
| --- | --- | --- | --- | --- | --- |
| MI-01 | Magnetic CTA Button | High-value button feedback with intent pull | `MagneticCtaButton` | `/micro-interactions/magnetic-cta` | Beginner |
| MI-02 | Ripple Press Button | Crisp press acknowledgement for tap-heavy UIs | `RipplePressButton` | `/micro-interactions/ripple-press` | Beginner |
| MI-03 | Morphing Play/Pause Toggle | Icon state change with clear continuity | `MorphPlayPauseToggle` | `/micro-interactions/play-pause-toggle` | Beginner |
| MI-04 | Like Burst Button | Expressive save/favorite confirmation | `LikeBurstButton` | `/micro-interactions/like-burst` | Beginner |
| MI-05 | Copy Confirmation Chip | Tiny success state for copy actions | `CopyChipButton` | `/micro-interactions/copy-chip` | Beginner |
| MI-06 | Beam Focus Input | Stronger focus affordance for forms | `BeamFocusInput` | `/micro-interactions/beam-focus-input` | Beginner |
| MI-07 | Inline Validation Field | Error and success feedback without jank | `InlineValidationField` | `/micro-interactions/inline-validation` | Intermediate |
| MI-08 | Slide Toggle Switch | Familiar state change with better tactility | `SlideToggleSwitch` | `/micro-interactions/slide-toggle` | Beginner |
| MI-09 | Segmented Control Rail | Selection clarity across multiple options | `SegmentedControlRail` | `/micro-interactions/segmented-rail` | Beginner |
| MI-10 | Hover Tilt Product Card | Depth cue for browseable cards | `HoverTiltCard` | `/micro-interactions/hover-tilt-card` | Intermediate |
| MI-11 | Spotlight Hover Link List | Cursor-led emphasis for dense nav lists | `SpotlightLinkList` | `/micro-interactions/spotlight-links` | Intermediate |
| MI-12 | Accordion Chevron Reveal | Better expand/collapse communication | `ChevronAccordion` | `/micro-interactions/chevron-accordion` | Beginner |
| MI-13 | Tab Underline Follower | Shared-element selection feedback | `TabUnderlineFollower` | `/micro-interactions/tab-underline` | Beginner |
| MI-14 | Notification Bell Peek | Compact alert reveal from an icon trigger | `NotificationBellPeek` | `/micro-interactions/notification-bell` | Intermediate |
| MI-15 | Toast Stack Dismiss | Swipe and exit behavior for transient UI | `ToastStackDemo` | `/micro-interactions/toast-stack` | Intermediate |
| MI-16 | Drag Lift Sort Cards | Reorder feedback with lift and settle | `DragLiftSortCards` | `/micro-interactions/drag-sort` | Advanced |
| MI-17 | Dropzone Pulse Upload | Drop target confidence during drag-over | `DropzonePulseUpload` | `/micro-interactions/dropzone-upload` | Intermediate |
| MI-18 | Theme Switch Orb | Theme change with a contained visual handoff | `ThemeSwitchOrb` | `/micro-interactions/theme-switch` | Intermediate |
| MI-19 | Command Palette Result Hover | Keyboard and pointer highlight continuity | `CommandPaletteHighlight` | `/micro-interactions/command-palette` | Intermediate |
| MI-20 | Stepper Progress Pulse | Progress acknowledgment for multi-step flows | `StepperProgressPulse` | `/micro-interactions/stepper-progress` | Beginner |

## Execution Phases

### Phase 1: Fast Wins

- MI-01 Magnetic CTA Button
- MI-02 Ripple Press Button
- MI-03 Morphing Play/Pause Toggle
- MI-05 Copy Confirmation Chip
- MI-08 Slide Toggle Switch
- MI-09 Segmented Control Rail
- MI-12 Accordion Chevron Reveal
- MI-13 Tab Underline Follower

### Phase 2: Rich Feedback

- MI-04 Like Burst Button
- MI-06 Beam Focus Input
- MI-07 Inline Validation Field
- MI-10 Hover Tilt Product Card
- MI-11 Spotlight Hover Link List
- MI-14 Notification Bell Peek
- MI-15 Toast Stack Dismiss
- MI-20 Stepper Progress Pulse

### Phase 3: Advanced Interaction Systems

- MI-16 Drag Lift Sort Cards
- MI-17 Dropzone Pulse Upload
- MI-18 Theme Switch Orb
- MI-19 Command Palette Result Hover

## Task Breakdown

### MI-01 Magnetic CTA Button

Design:
An oversized pill CTA subtly drifts toward the pointer, compresses on press, and snaps into place with a confident spring. In reduced motion, keep the color and shadow response without positional pull.

Tasks:

- [x] Create `components/micro-interactions/MagneticCtaButton.tsx`.
- [x] Create `app/micro-interactions/magnetic-cta/page.tsx` with intensity and radius controls.
- [x] Support pointer hover, keyboard focus, pressed state, and disabled state.
- [x] Keep the travel distance capped so the button never feels slippery.
- [x] Add reduced-motion fallback with no translation and a tighter opacity/shadow response.

### MI-02 Ripple Press Button

Design:
A compact utility button emits a contained radial ripple from the click/tap origin, then settles with a fast scale rebound. The ripple should feel precise, not material-design-generic.

Tasks:

- [x] Create `components/micro-interactions/RipplePressButton.tsx`.
- [x] Create `app/micro-interactions/ripple-press/page.tsx` with ripple size and duration controls.
- [x] Calculate ripple origin from pointer coordinates and center it for keyboard activation.
- [x] Layer press scale, ripple, and label contrast shift without blocking repeated taps.
- [x] Provide reduced-motion mode that swaps the ripple for a brief surface flash.

### MI-03 Morphing Play/Pause Toggle

Design:
The icon should morph between play and pause rather than blink between two SVGs. The transition should preserve shape continuity and support a compact media-control use case.

Tasks:

- [x] Create `components/micro-interactions/MorphPlayPauseToggle.tsx`.
- [x] Create `app/micro-interactions/play-pause-toggle/page.tsx` with icon size and corner-rounding controls.
- [x] Animate between play and pause with shared path or masked bars.
- [x] Add accessible pressed state via `aria-pressed`.
- [x] Make reduced-motion mode use a simple crossfade plus label change.

### MI-04 Like Burst Button

Design:
Tapping the heart triggers a fast scale pop, soft rotation, and a controlled particle burst that stays within the component bounds. The celebration should read instantly and end quickly.

Tasks:

- [ ] Create `components/micro-interactions/LikeBurstButton.tsx`.
- [ ] Create `app/micro-interactions/like-burst/page.tsx` with burst density and accent color controls.
- [ ] Animate icon fill, scale, and decorative particles in one sequence.
- [ ] Support toggling off with a calmer reverse animation.
- [ ] Replace particles with glow and fill-only feedback when reduced motion is enabled.

### MI-05 Copy Confirmation Chip

Design:
A small chip button shifts from `Copy` to `Copied` with a sliding label swap and a compact checkmark draw. It should feel useful in docs, code blocks, and share sheets.

Tasks:

- [x] Create `components/micro-interactions/CopyChipButton.tsx`.
- [x] Create `app/micro-interactions/copy-chip/page.tsx` with timeout and label controls.
- [x] Simulate or wire clipboard success state with optimistic feedback.
- [x] Auto-reset the success state after a configurable delay.
- [x] Preserve the same message flow in reduced motion using instant label swap plus subtle color change.

### MI-06 Beam Focus Input

Design:
The input earns focus with a directional beam sweep and a faint edge glow that tracks the active state. This should make form focus feel deliberate without looking neon-heavy.

Tasks:

- [ ] Create `components/micro-interactions/BeamFocusInput.tsx`.
- [ ] Create `app/micro-interactions/beam-focus-input/page.tsx` with glow strength and beam speed controls.
- [ ] Animate focus-in, focus-out, hover, and invalid states.
- [ ] Ensure the beam effect does not reduce text contrast or caret clarity.
- [ ] Reduce the effect to border and background transitions in reduced motion mode.

### MI-07 Inline Validation Field

Design:
Validation should feel informative rather than punitive. Errors get a short lateral nudge and message reveal; success gets a restrained check-confirmation and border settle.

Tasks:

- [ ] Create `components/micro-interactions/InlineValidationField.tsx`.
- [ ] Create `app/micro-interactions/inline-validation/page.tsx` with validation mode controls.
- [ ] Implement idle, typing, error, and success states with distinct transitions.
- [ ] Keep layout stable by reserving helper text space or animating within a fixed region.
- [ ] Use color and icon change only in reduced motion mode.

### MI-08 Slide Toggle Switch

Design:
The switch thumb should glide with spring weight, while the track tint blooms underneath it. The motion should imply physical travel without overshoot.

Tasks:

- [x] Create `components/micro-interactions/SlideToggleSwitch.tsx`.
- [x] Create `app/micro-interactions/slide-toggle/page.tsx` with size and damping controls.
- [x] Support pointer, keyboard, and disabled interaction flows.
- [x] Sync thumb translation, track color, and on/off iconography.
- [x] Provide a no-motion fallback with immediate thumb placement and color swap.

### MI-09 Segmented Control Rail

Design:
The active option rides on a soft shared rail that slides between segments. This should feel more premium than simple text-color changes and work well for filters or view modes.

Tasks:

- [x] Create `components/micro-interactions/SegmentedControlRail.tsx`.
- [x] Create `app/micro-interactions/segmented-rail/page.tsx` with segment count and width controls.
- [x] Use a shared layout highlight that follows the selected item.
- [x] Support keyboard roving focus and pointer selection.
- [x] Fall back to instant highlight repositioning with color change when reduced motion is enabled.

### MI-10 Hover Tilt Product Card

Design:
The card tilts slightly in 3D, a sheen slides across the face, and content layers separate by depth. The effect should still feel usable, not like a game card.

Tasks:

- [ ] Create `components/micro-interactions/HoverTiltCard.tsx`.
- [ ] Create `app/micro-interactions/hover-tilt-card/page.tsx` with tilt and glare controls.
- [ ] Map pointer position to rotation and highlight offset.
- [ ] Clamp transforms aggressively for mobile and low-precision pointers.
- [ ] Offer reduced-motion mode with shadow, border, and static spotlight changes only.

### MI-11 Spotlight Hover Link List

Design:
A vertical list of links receives a cursor-led spotlight that follows hover and softly emphasizes the active row. This is useful for nav menus, command palettes, and sidebars.

Tasks:

- [ ] Create `components/micro-interactions/SpotlightLinkList.tsx`.
- [ ] Create `app/micro-interactions/spotlight-links/page.tsx` with spotlight size and easing controls.
- [ ] Animate the spotlight independently from text color so the effect still reads on keyboard focus.
- [ ] Ensure touch devices get a simplified tap-highlight version.
- [ ] Replace cursor-following movement with static focus highlight in reduced motion mode.

### MI-12 Accordion Chevron Reveal

Design:
The chevron rotates, the content container reveals cleanly, and the trigger line subtly shifts weight to show the relationship between control and content.

Tasks:

- [x] Create `components/micro-interactions/ChevronAccordion.tsx`.
- [x] Create `app/micro-interactions/chevron-accordion/page.tsx` with item count and spacing controls.
- [x] Animate icon rotation, content opacity, and masked reveal without height-jank.
- [x] Preserve accessibility with button semantics and `aria-expanded`.
- [x] Use instant content swap with icon rotation disabled in reduced motion mode.

### MI-13 Tab Underline Follower

Design:
An underline or pill highlight should travel between tabs with shared-element continuity, making the selected state feel connected instead of replaced.

Tasks:

- [x] Create `components/micro-interactions/TabUnderlineFollower.tsx`.
- [x] Create `app/micro-interactions/tab-underline/page.tsx` with underline style controls.
- [x] Support both click and keyboard navigation.
- [x] Animate associated content transition separately from the underline.
- [x] Collapse to an immediate underline jump and content swap when reduced motion is enabled.

### MI-14 Notification Bell Peek

Design:
Pressing the bell reveals a compact notification tray that grows from the icon anchor, using scale and fade to preserve spatial continuity. Badge count should pulse only when new items appear.

Tasks:

- [ ] Create `components/micro-interactions/NotificationBellPeek.tsx`.
- [ ] Create `app/micro-interactions/notification-bell/page.tsx` with tray size and badge count controls.
- [ ] Build anchor-to-panel choreography with focus management and outside-click dismissal.
- [ ] Animate badge pulse separately from tray open/close.
- [ ] Use a simple opacity reveal and static badge in reduced motion mode.

### MI-15 Toast Stack Dismiss

Design:
Toasts enter with slight stagger, sit in a layered stack, and dismiss with directional swipe energy. The stack should remain readable while showcasing ephemeral UI behavior.

Tasks:

- [ ] Create `components/micro-interactions/ToastStackDemo.tsx`.
- [ ] Create `app/micro-interactions/toast-stack/page.tsx` with stack size and timeout controls.
- [ ] Support swipe-to-dismiss, auto-dismiss, and action button hover states.
- [ ] Animate stack reflow without collisions or abrupt jumps.
- [ ] Remove drag gesture and use simple fade transitions in reduced motion mode.

### MI-16 Drag Lift Sort Cards

Design:
Dragging a card should lift it off the canvas with added shadow and scale, while surrounding cards make room smoothly. The settle animation needs to feel intentional and legible.

Tasks:

- [ ] Create `components/micro-interactions/DragLiftSortCards.tsx`.
- [ ] Create `app/micro-interactions/drag-sort/page.tsx` with card count and axis controls.
- [ ] Implement lift, placeholder spacing, reorder, and settle states.
- [ ] Keep pointer and keyboard reorder flows aligned where possible.
- [ ] Provide reduced-motion mode with minimal scale and immediate reorder.

### MI-17 Dropzone Pulse Upload

Design:
The dropzone should advertise itself during drag-over with a contained pulse, border expansion, and icon lift. Success should resolve into a calm progress or confirmation state.

Tasks:

- [ ] Create `components/micro-interactions/DropzonePulseUpload.tsx`.
- [ ] Create `app/micro-interactions/dropzone-upload/page.tsx` with drag state and progress controls.
- [ ] Implement idle, hover, drag-over, uploading, success, and error states.
- [ ] Separate drag-over pulse from upload progress animation.
- [ ] Reduce motion to color and copy changes only when needed.

### MI-18 Theme Switch Orb

Design:
The theme switch should feel like a contained environment shift: the thumb becomes an orb, the track behaves like a horizon, and small stars or glow accents reinforce the state without taking over the page.

Tasks:

- [ ] Create `components/micro-interactions/ThemeSwitchOrb.tsx`.
- [ ] Create `app/micro-interactions/theme-switch/page.tsx` with palette and orb-size controls.
- [ ] Animate thumb travel, icon morph, and background accents as one coordinated change.
- [ ] Ensure the demo works whether the app theme is real or simulated locally.
- [ ] Provide reduced-motion mode with instant state change plus color fade.

### MI-19 Command Palette Result Hover

Design:
Command palette results should have a hover and keyboard-active layer that glides between rows, reinforcing which result will execute next. This demo should prioritize parity between mouse and arrow-key navigation.

Tasks:

- [ ] Create `components/micro-interactions/CommandPaletteHighlight.tsx`.
- [ ] Create `app/micro-interactions/command-palette/page.tsx` with result count and density controls.
- [ ] Implement shared highlight movement across pointer hover and active keyboard index.
- [ ] Animate empty, loading, and no-results states without distracting from navigation.
- [ ] Reduce motion to a static active row treatment when required.

### MI-20 Stepper Progress Pulse

Design:
Completing a step should send a small pulse forward through the connector into the next step, helping users understand progress direction in onboarding or checkout flows.

Tasks:

- [ ] Create `components/micro-interactions/StepperProgressPulse.tsx`.
- [ ] Create `app/micro-interactions/stepper-progress/page.tsx` with step count and active index controls.
- [ ] Animate completed, active, and upcoming states with connector emphasis.
- [ ] Support forward and backward navigation to prove the state model is robust.
- [ ] Replace the pulse with direct color and icon transitions in reduced motion mode.

## Definition Of Done

- The component is reusable outside the demo route.
- The demo route explains the interaction purpose in one short paragraph.
- Pointer, keyboard, and reduced-motion states are implemented.
- Motion stays smooth on desktop and remains controlled on mobile.
- The effect feels specific and intentional rather than generic or over-animated.

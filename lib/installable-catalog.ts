/**
 * @fileoverview Distributable item catalog for installable animation components
 *
 * This module provides a dedicated source of truth for installable/distributable
 * animation items, separate from the gallery navigation registry.
 *
 * Each entry describes how to transplant a component into another project,
 * including source file locations, npm dependencies, and registry requirements.
 *
 * @module installable-catalog
 * @see lib/animation-registry.ts for gallery navigation metadata
 */

export type DistributableCategory =
  | "micro-interactions"
  | "page-transitions"
  | "scroll-animations"
  | "layout-animations";

export type AnimationLibrary = "framer-motion" | "gsap";

export interface NpmDependency {
  package: string;
  version: string;
}

export interface RegistryDependency {
  name: string;
  description?: string;
}

/**
 * Metadata for a single distributable/installable item
 *
 * @description Each distributable item in the catalog has this metadata structure,
 * which powers distribution, installation, and registry build inputs.
 *
 * @property name - Unique identifier (kebab-case)
 * @property title - Display title for the component
 * @property description - Brief explanation of what the component does
 * @property category - Primary classification for organizing distributable items
 * @property library - Animation libraries used for the implementation
 * @property keywords - Searchable terms for discovery
 * @property sourceFiles - Relative paths to component source files
 * @property npmDependencies - Required npm packages with version constraints
 * @property registryDependencies - Optional registry items this component needs
 * @property status - Implementation status (defaults to "ready")
 */
export interface DistributableItem {
  name: string;
  title: string;
  description: string;
  category: DistributableCategory;
  library: AnimationLibrary[];
  keywords: string[];
  sourceFiles: string[];
  npmDependencies: NpmDependency[];
  registryDependencies?: RegistryDependency[];
  status?: "ready" | "planned";
  pilot?: boolean;
}

const distributableItems: DistributableItem[] = [];

export function registerDistributableItem(item: DistributableItem): void {
  const existing = distributableItems.findIndex((i) => i.name === item.name);
  if (existing >= 0) {
    distributableItems[existing] = item;
    return;
  }
  distributableItems.push(item);
}

export function getAllDistributableItems(): DistributableItem[] {
  return [...distributableItems];
}

export function getDistributableItemByName(name: string): DistributableItem | undefined {
  return distributableItems.find((item) => item.name === name);
}

export function getDistributableItemsByCategory(
  category: DistributableCategory
): DistributableItem[] {
  return distributableItems.filter((item) => item.category === category);
}

export const PILOT_REGISTRY_ITEM_NAMES = [
  "slide-toggle-switch",
  "tab-underline-follower",
  "ripple-press-button",
  "copy-confirmation-chip",
  "like-burst-button",
  "center-peek-card",
  "center-peek-shrink",
  "chat-bar",
  "chat-page",
  "category-marquee",
  "floating-logos",
  "count-up-number",
] as const;

export type PilotRegistryItemName = (typeof PILOT_REGISTRY_ITEM_NAMES)[number];

export function getPilotDistributableItems(): DistributableItem[] {
  const pilotNameSet = new Set<string>(PILOT_REGISTRY_ITEM_NAMES);

  return distributableItems
    .filter((item) => item.status === "ready" && (item.pilot || pilotNameSet.has(item.name)))
    .sort(
      (a, b) =>
        PILOT_REGISTRY_ITEM_NAMES.indexOf(a.name as PilotRegistryItemName) -
        PILOT_REGISTRY_ITEM_NAMES.indexOf(b.name as PilotRegistryItemName)
    );
}

// Installable component entries (pilot items are flagged with `pilot: true`)

registerDistributableItem({
  name: "beam-focus-input",
  title: "Beam Focus Input",
  description:
    "Focus input with a directional beam sweep, edge glow, and reduced-motion border fallback",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["input", "focus", "beam", "glow", "form", "micro interaction"],
  sourceFiles: ["components/micro-interactions/BeamFocusInput.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "ripple-press-button",
  title: "Ripple Press Button",
  description:
    "Contained radial ripple feedback with keyboard-centered activation and a reduced-motion flash fallback",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["ripple", "press", "button", "tap", "feedback", "micro interaction"],
  sourceFiles: ["registry/components/micro-interactions/RipplePressButton.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  pilot: true,
  status: "ready",
});

registerDistributableItem({
  name: "magnetic-cta-button",
  title: "Magnetic CTA Button",
  description:
    "Intent-aware button pull with restrained hover travel, press compression, and reduced-motion fallback",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["magnetic", "cta", "button", "hover", "pointer", "micro interaction"],
  sourceFiles: ["components/micro-interactions/MagneticCtaButton.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "inline-validation-field",
  title: "Inline Validation Field",
  description:
    "Stable validation field with typing, error, and success states that avoid layout jump",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["validation", "field", "form", "error", "success", "micro interaction"],
  sourceFiles: ["components/micro-interactions/InlineValidationField.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "morph-play-pause-toggle",
  title: "Morph Play Pause Toggle",
  description:
    "Play and pause states morph through shared geometry instead of blinking between isolated icons",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["toggle", "play", "pause", "icon", "media", "micro interaction"],
  sourceFiles: ["components/micro-interactions/MorphPlayPauseToggle.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "like-burst-button",
  title: "Like Burst Button",
  description:
    "Favorite toggle with heart fill, compact celebratory particles, and a reduced-motion glow fallback",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["like", "favorite", "heart", "burst", "save", "micro interaction"],
  sourceFiles: ["registry/components/micro-interactions/LikeBurstButton.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  pilot: true,
  status: "ready",
});

registerDistributableItem({
  name: "copy-confirmation-chip",
  title: "Copy Confirmation Chip",
  description:
    "Compact copy confirmation with an optimistic state flip, checkmark draw, and timed reset",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["copy", "clipboard", "confirmation", "chip", "success", "micro interaction"],
  sourceFiles: ["registry/components/micro-interactions/CopyChipButton.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  pilot: true,
  status: "ready",
});

registerDistributableItem({
  name: "hover-tilt-card",
  title: "Hover Tilt Product Card",
  description:
    "Bounded 3D tilt, passing sheen, and depth-separated content layers for premium hover feedback",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["tilt", "card", "3d", "glare", "hover", "micro interaction"],
  sourceFiles: ["components/micro-interactions/HoverTiltCard.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "spotlight-link-list",
  title: "Spotlight Hover Link List",
  description:
    "Dense link list with cursor-led spotlight and shared active row treatment",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["spotlight", "links", "hover", "focus", "list", "micro interaction"],
  sourceFiles: ["components/micro-interactions/SpotlightLinkList.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "notification-bell-peek",
  title: "Notification Bell Peek",
  description:
    "Anchored notification tray with badge pulse, focus management, and restrained panel choreography",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["notification", "bell", "tray", "popover", "badge", "micro interaction"],
  sourceFiles: ["components/micro-interactions/NotificationBellPeek.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "toast-stack-dismiss",
  title: "Toast Stack Dismiss",
  description:
    "Stacked toast system with staggered entry, swipe dismissal, and clean layout reflow",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["toast", "stack", "dismiss", "swipe", "notification", "micro interaction"],
  sourceFiles: ["components/micro-interactions/ToastStackDemo.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "drag-lift-sort-cards",
  title: "Drag Lift Sort Cards",
  description:
    "Reorderable card list with lift, placeholder spacing, and keyboard-friendly fallback",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["drag", "sort", "reorder", "cards", "lift", "micro interaction"],
  sourceFiles: ["components/micro-interactions/DragLiftSortCards.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "dropzone-pulse-upload",
  title: "Dropzone Pulse Upload",
  description:
    "Dropzone with drag-over pulse, upload progress, and confirmation state handoff",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["dropzone", "upload", "progress", "drag", "file", "micro interaction"],
  sourceFiles: ["components/micro-interactions/DropzonePulseUpload.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "count-up-number",
  title: "Count Up Number",
  description:
    "Animated stat readout with fast acceleration, formatting support, and an immediate reduced-motion fallback",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["count up", "number", "counter", "stat", "metric", "micro interaction"],
  sourceFiles: ["components/micro-interactions/CountUpNumber.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "slide-toggle-switch",
  title: "Slide Toggle Switch",
  description:
    "Weighted switch travel with a track bloom that keeps state changes tactile and legible",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["switch", "toggle", "thumb", "track", "state", "micro interaction"],
  sourceFiles: ["registry/components/micro-interactions/SlideToggleSwitch.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  pilot: true,
  status: "ready",
});

registerDistributableItem({
  name: "segmented-control-rail",
  title: "Segmented Control Rail",
  description:
    "Selection state rides on a shared rail highlight for clearer filter and mode changes",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["segmented", "rail", "selection", "filter", "shared layout", "micro interaction"],
  sourceFiles: ["components/micro-interactions/SegmentedControlRail.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "chevron-accordion",
  title: "Chevron Accordion",
  description:
    "Chevron rotation and masked content reveal make expand and collapse feel directional",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["accordion", "chevron", "expand", "collapse", "reveal", "micro interaction"],
  sourceFiles: ["components/micro-interactions/ChevronAccordion.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "tab-underline-follower",
  title: "Tab Underline Follower",
  description:
    "Underline or pill highlights travel between tabs with separate content transitions",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["tabs", "underline", "follower", "shared element", "navigation", "micro interaction"],
  sourceFiles: ["registry/components/micro-interactions/TabUnderlineFollower.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  pilot: true,
  status: "ready",
});

registerDistributableItem({
  name: "center-peek-card",
  title: "Center Peek Card",
  description:
    "Sticky scroll reveal that grows a compact peek into a framed center-stage card with reduced-motion support",
  category: "scroll-animations",
  library: ["framer-motion"],
  keywords: ["center peek", "scroll", "sticky", "card", "reveal", "framed"],
  sourceFiles: ["registry/components/scroll-animations/CenterPeekCard.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  pilot: true,
  status: "ready",
});

registerDistributableItem({
  name: "center-peek-shrink",
  title: "Center Peek Shrink Card",
  description:
    "Two-phase scroll animation: card expands from peek to full viewport, then collapses to a compact header anchored at the top",
  category: "scroll-animations",
  library: ["framer-motion"],
  keywords: ["center peek", "shrink", "scroll", "sticky", "header", "card", "reveal"],
  sourceFiles: ["registry/components/scroll-animations/CenterPeekShrinkCard.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  pilot: true,
  status: "ready",
});

registerDistributableItem({
  name: "chat-bar",
  title: "Chat Bar",
  description:
    "Chat input bar with typing animation, blinking cursor, and send button",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["chat", "input", "typing", "message", "cursor", "micro interaction"],
  sourceFiles: ["registry/components/chat/ChatBar.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  pilot: true,
  status: "ready",
});

registerDistributableItem({
  name: "category-marquee",
  title: "Category Marquee",
  description:
    "Infinite horizontal scrolling marquee with alternating directions and edge fade",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["marquee", "scroll", "category", "infinite", "banner"],
  sourceFiles: ["registry/components/category-marquee/MarqueeRow.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  pilot: true,
  status: "ready",
});

registerDistributableItem({
  name: "floating-logos",
  title: "Floating Logos",
  description:
    "Ambient floating logo animation with spring physics and random drift",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["floating", "logos", "ambient", "animation", "drift"],
  sourceFiles: ["registry/components/floating-logos/FloatingLogos.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  pilot: true,
  status: "ready",
});

registerDistributableItem({
  name: "chat-page",
  title: "Chat Page",
  description:
    "Full chat interface with animated ChatBar, typing indicator, user/AI messages, and scroll-triggered demo sequence",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["chat", "message", "typing", "animation", "conversation", "demo"],
  sourceFiles: [
    "registry/components/chat/ChatComponents.tsx",
    "registry/components/chat/ChatDemo.tsx",
  ],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  pilot: true,
  status: "ready",
});

registerDistributableItem({
  name: "theme-switch-orb",
  title: "Theme Switch Orb",
  description:
    "Orb-like theme switch with contained palette shift and reduced-motion direct swap",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["theme", "switch", "toggle", "orb", "palette", "micro interaction"],
  sourceFiles: ["components/micro-interactions/ThemeSwitchOrb.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "command-palette-highlight",
  title: "Command Palette Highlight",
  description:
    "Command palette result list with a shared active highlight across pointer and keyboard input",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["command palette", "highlight", "listbox", "results", "keyboard", "micro interaction"],
  sourceFiles: ["components/micro-interactions/CommandPaletteHighlight.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

registerDistributableItem({
  name: "stepper-progress-pulse",
  title: "Stepper Progress Pulse",
  description:
    "Stepper connector pulse clarifies forward progress while preserving completed and active state contrast",
  category: "micro-interactions",
  library: ["framer-motion"],
  keywords: ["stepper", "progress", "pulse", "connector", "workflow", "micro interaction"],
  sourceFiles: ["components/micro-interactions/StepperProgressPulse.tsx"],
  npmDependencies: [{ package: "motion", version: "^12.0.0" }],
  status: "ready",
});

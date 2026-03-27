/**
 * @fileoverview Central registry for all animations in the motion gallery
 *
 * This module provides a single source of truth for animation metadata,
 * enabling navigation, search, and filtering across the entire gallery.
 * All animations (core gallery and transition lab) must be registered here.
 *
 * @module animation-registry
 * @see lib/animation-presets.ts for shared animation primitives
 *
 * @example
 * // Register a new animation
 * registerAnimation({
 *   id: "my-animation",
 *   path: "/my-animation",
 *   title: "My Animation",
 *   description: "A custom animation demo",
 *   category: "hover-interactions",
 *   difficulty: "beginner",
 *   library: ["framer-motion"],
 *   keywords: ["hover", "interactive"],
 *   color: "cyan",
 *   group: "core",
 * });
 *
 * // Retrieve all animations for navigation
 * const allAnimations = getAllAnimations();
 */

/** Categories for organizing animations by their primary motion type */
export type AnimationCategory =
  | "scroll-based"
  | "text-effects"
  | "hover-interactions"
  | "3d-transforms"
  | "page-transitions"
  | "layout-animations";

/** Skill level required to understand the animation implementation */
export type AnimationDifficulty = "beginner" | "intermediate" | "advanced";

/** Animation library used for the implementation */
export type AnimationLibrary = "framer-motion" | "gsap";

/**
 * Navigation group for organizing routes
 * - "core" - Main gallery demos (gsap, parallax, text-reveal, etc.)
 * - "transition-lab" - Route transition experiments under /transition/
 */
export type AnimationGroup = "core" | "transition-lab";

/** Implementation status of the animation */
export type AnimationStatus = "ready" | "planned";

/**
 * Complete metadata for a single animation entry
 *
 * @description Each animation in the gallery has this metadata structure,
 * which powers navigation, search, filtering, and display throughout the app.
 *
 * @property id - Unique identifier (kebab-case, matches route when possible)
 * @property path - URL path for the animation page
 * @property title - Display title shown in navigation and headers
 * @property description - Brief explanation of what the animation demonstrates
 * @property category - Primary classification for filtering
 * @property difficulty - Complexity level for filtering and badges
 * @property library - Animation libraries used (can be multiple for hybrids)
 * @property keywords - Searchable terms for discovery
 * @property color - Theme color for UI elements (Tailwind color name)
 * @property group - Navigation group for organizing routes
 * @property status - Optional implementation status (defaults to "ready")
 */
export interface AnimationMeta {
  id: string;
  path: string;
  title: string;
  description: string;
  category: AnimationCategory;
  difficulty: AnimationDifficulty;
  library: AnimationLibrary[];
  keywords: string[];
  color: string;
  group: AnimationGroup;
  status?: AnimationStatus;
}

/** Internal registry array - animations are added via registerAnimation() */
const animations: AnimationMeta[] = [];

/**
 * Sorts animations alphabetically by title for consistent display order
 * @param values - Array of animation metadata to sort
 * @returns New sorted array (does not mutate input)
 */
function sortAnimations(values: AnimationMeta[]): AnimationMeta[] {
  return [...values].sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Registers an animation in the global registry
 *
 * @description Adds a new animation or updates an existing one if the ID matches.
 * This is called at module load time for built-in animations, but can also be
 * called dynamically for plugins or extensions.
 *
 * @param meta - Complete animation metadata object
 *
 * @example
 * registerAnimation({
 *   id: "my-effect",
 *   path: "/my-effect",
 *   title: "My Effect",
 *   description: "A cool animation effect",
 *   category: "hover-interactions",
 *   difficulty: "intermediate",
 *   library: ["framer-motion"],
 *   keywords: ["hover", "interactive", "spring"],
 *   color: "violet",
 *   group: "core",
 * });
 */
export function registerAnimation(meta: AnimationMeta): void {
  const existing = animations.findIndex((animation) => animation.id === meta.id);
  if (existing >= 0) {
    animations[existing] = meta;
    return;
  }

  animations.push(meta);
}

/**
 * Retrieves all registered animations, sorted alphabetically by title
 *
 * @returns Sorted array of all animation metadata
 */
export function getAllAnimations(): AnimationMeta[] {
  return sortAnimations(animations);
}

/**
 * Finds an animation by its unique identifier
 *
 * @param id - The animation's unique ID
 * @returns Animation metadata or undefined if not found
 */
export function getAnimationById(id: string): AnimationMeta | undefined {
  return animations.find((animation) => animation.id === id);
}

/**
 * Finds an animation by its URL path
 *
 * @description Useful for determining which animation is active based on the current route
 * @param path - URL path (e.g., "/gsap", "/transition/kinetic-panels")
 * @returns Animation metadata or undefined if not found
 */
export function getAnimationByPath(path: string): AnimationMeta | undefined {
  return animations.find((animation) => animation.path === path);
}

/**
 * Filters animations by their navigation group
 *
 * @param group - Either "core" for main gallery or "transition-lab" for transitions
 * @returns Array of animations in the specified group
 */
export function getAnimationsByGroup(group: AnimationGroup): AnimationMeta[] {
  return animations.filter((animation) => animation.group === group);
}

/**
 * Convenience function to get all transition lab animations
 *
 * @returns All animations in the "transition-lab" group
 */
export function getTransitionLabAnimations(): AnimationMeta[] {
  return getAnimationsByGroup("transition-lab");
}

/**
 * Gets transition lab routes excluding the main index page
 *
 * @description Used for navigation within the transition lab section.
 * Excludes "/transition" (the index) to show only individual transition demos.
 * @returns Transition lab animations excluding the index page
 */
export function getTransitionLabRoutes(): AnimationMeta[] {
  return getTransitionLabAnimations().filter((animation) => animation.path !== "/transition");
}

/**
 * Searches animations by query string across multiple fields
 *
 * @description Performs case-insensitive search across title, description,
 * keywords, category, and library fields. Returns all animations if query is empty.
 *
 * @param query - Search string
 * @returns Array of matching animations
 *
 * @example
 * const results = searchAnimations("spring"); // Finds animations mentioning spring
 * const hoverResults = searchAnimations("hover"); // Finds hover-related animations
 */
export function searchAnimations(query: string): AnimationMeta[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return getAllAnimations();

  return animations.filter((animation) => {
    return (
      animation.title.toLowerCase().includes(lowerQuery) ||
      animation.description.toLowerCase().includes(lowerQuery) ||
      animation.keywords.some((keyword) => keyword.toLowerCase().includes(lowerQuery)) ||
      animation.category.toLowerCase().includes(lowerQuery) ||
      animation.library.some((library) => library.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Filters animations by multiple criteria (AND logic)
 *
 * @description All provided filters must match for an animation to be included.
 * Empty or undefined filters are ignored (treated as "match all").
 *
 * @param categories - Array of categories to include (optional)
 * @param difficulty - Array of difficulty levels to include (optional)
 * @param library - Array of libraries to include (animation must use at least one)
 * @returns Array of animations matching all specified criteria
 *
 * @example
 * // Get all beginner Framer Motion animations
 * const beginner = filterAnimations(undefined, ["beginner"], ["framer-motion"]);
 *
 * // Get advanced scroll-based animations
 * const advanced = filterAnimations(["scroll-based"], ["advanced"]);
 */
export function filterAnimations(
  categories?: AnimationCategory[],
  difficulty?: AnimationDifficulty[],
  library?: AnimationLibrary[]
): AnimationMeta[] {
  return animations.filter((animation) => {
    if (categories && categories.length > 0 && !categories.includes(animation.category)) {
      return false;
    }
    if (difficulty && difficulty.length > 0 && !difficulty.includes(animation.difficulty)) {
      return false;
    }
    if (library && library.length > 0 && !library.some((item) => animation.library.includes(item))) {
      return false;
    }

    return true;
  });
}

registerAnimation({
  id: "home",
  path: "/",
  title: "Home",
  description: "Premium scroll-based motion gallery with peek-snap transitions and spring physics",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["scroll", "snap", "peek", "sections", "spring"],
  color: "zinc",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "gallery",
  path: "/gallery",
  title: "Gallery",
  description: "Browse and discover all animations with search and filtering",
  category: "layout-animations",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["search", "filter", "browse", "catalog"],
  color: "slate",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "gsap",
  path: "/gsap",
  title: "GSAP",
  description: "GreenSock animations with timeline, ScrollTrigger, and scrub effects",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["gsap"],
  keywords: ["timeline", "scrolltrigger", "scrub", "stagger", "tween"],
  color: "indigo",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "parallax",
  path: "/parallax",
  title: "Parallax",
  description: "Multi-layered depth effects with different scroll speeds",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["depth", "layers", "scroll", "perspective"],
  color: "violet",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "text-reveal",
  path: "/text-reveal",
  title: "Text Reveal",
  description: "Character-by-character reveals, typewriter effects, and mask animations",
  category: "text-effects",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["character", "word", "typewriter", "mask", "stagger"],
  color: "fuchsia",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "horizontal",
  path: "/horizontal",
  title: "Horizontal",
  description: "Horizontal scrolling demos with scroll-driven navigation",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["horizontal", "scroll", "cards", "gallery"],
  color: "emerald",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "magnetic",
  path: "/magnetic",
  title: "Magnetic",
  description: "Interactive magnetic field effects with spring physics",
  category: "hover-interactions",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["magnetic", "hover", "cursor", "spring", "interactive"],
  color: "rose",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "reveal",
  path: "/reveal",
  title: "Reveal",
  description: "Content reveal animations with various transitions",
  category: "layout-animations",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["reveal", "fade", "scale", "clip-path", "mask"],
  color: "amber",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "3d",
  path: "/3d",
  title: "3D",
  description: "Three-dimensional animations and transforms",
  category: "3d-transforms",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["3d", "perspective", "rotate", "transform", "card"],
  color: "cyan",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "floating-logos",
  path: "/floating-logos",
  title: "Floating Logos",
  description: "Multiple rounded squares floating around with adjustable speed and distance",
  category: "layout-animations",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["floating", "logos", "squares", "ambient", "background"],
  color: "violet",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "scroll-reveal",
  path: "/scroll-reveal",
  title: "Scroll Reveal",
  description: "Scroll-locked section with progressive text reveal and spring animations",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["scroll", "reveal", "locked", "sticky", "spring", "text"],
  color: "indigo",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "anchor-elements",
  path: "/anchor-elements",
  title: "Anchor Elements",
  description: "Sticky viewport rails with three independently timed enter and exit windows",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["anchor", "sticky", "viewport", "scroll", "pin", "overlap"],
  color: "cyan",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "transition",
  path: "/transition",
  title: "Transition Lab",
  description: "A premium section for route transitions, reveal systems, and high-drama scene changes",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["transition", "lab", "showcase", "scene", "navigation"],
  color: "slate",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "transition-showcase",
  path: "/transition/showcase",
  title: "Transition Showcase",
  description: "Flagship comparison route that cycles one shared scene through every transition mode",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["showcase", "comparison", "modes", "replay", "controller"],
  color: "cyan",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "kinetic-panels",
  path: "/transition/kinetic-panels",
  title: "Kinetic Panels",
  description: "Oversized editorial slabs slam in from multiple directions with graphic contrast",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["editorial", "panels", "stagger", "poster", "impact"],
  color: "amber",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "liquid-reveal",
  path: "/transition/liquid-reveal",
  title: "Liquid Reveal",
  description: "Organic morphing masks, elastic timing, and bloom-heavy diffusion",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["liquid", "blob", "morph", "mask", "fluid"],
  color: "violet",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "shutter-slice",
  path: "/transition/shutter-slice",
  title: "Shutter Slice",
  description: "Segmented shutters peel away at offset speeds for a mechanical scene break",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["shutter", "slice", "strips", "wipe", "mechanical"],
  color: "zinc",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "shared-element-spotlight",
  path: "/transition/shared-element-spotlight",
  title: "Shared Element Spotlight",
  description: "One persistent hero element anchors the scene while everything else rebuilds around it",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["shared element", "hero", "continuity", "card", "focus"],
  color: "emerald",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "parallax-stage",
  path: "/transition/parallax-stage",
  title: "Parallax Stage",
  description: "Foreground, midground, and background layers shift independently for cinematic depth",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["depth", "stage", "cinematic", "layers", "scene"],
  color: "indigo",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "glitch-scan",
  path: "/transition/glitch-scan",
  title: "Glitch Scan",
  description: "A deliberate digital transition with scan lines, RGB splits, and controlled distortion",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["glitch", "scan", "rgb", "distortion", "broadcast"],
  color: "rose",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "paper-fold",
  path: "/transition/paper-fold",
  title: "Paper Fold",
  description: "Tactile fold planes and hinge-driven reveals sell a physical card transition",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["paper", "fold", "hinge", "material", "shadow"],
  color: "amber",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "magnetic-collapse",
  path: "/transition/magnetic-collapse",
  title: "Magnetic Collapse",
  description: "Fragments pull toward a focal attractor before reassembling into the next scene",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["magnetic", "collapse", "attractor", "fragments", "rebuild"],
  color: "fuchsia",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "void-portal",
  path: "/transition/void-portal",
  title: "Void Portal",
  description: "A central aperture consumes the current scene and reveals the next one in two phases",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["portal", "void", "vortex", "radial", "consume"],
  color: "slate",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "gallery-curtain",
  path: "/transition/gallery-curtain",
  title: "Gallery Curtain",
  description: "Layered veils sweep across the stage with theatrical timing and soft weight",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["curtain", "veil", "fabric", "theatrical", "gradient"],
  color: "violet",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "transition-gallery",
  path: "/transition/gallery",
  title: "Transition Gallery",
  description: "All 10 transitions in a vertical scroll gallery with individual replay controls",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["gallery", "scroll", "comparison", "all transitions", "vertical"],
  color: "cyan",
  group: "transition-lab",
  status: "ready",
});

registerAnimation({
  id: "chat",
  path: "/chat",
  title: "Chat",
  description: "Typing animations, message bubbles, and chatbar interactions with spring physics",
  category: "layout-animations",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["chat", "typing", "message", "bubble", "cursor", "stagger"],
  color: "slate",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "category-marquee",
  path: "/category-marquee",
  title: "Category Marquee",
  description: "Infinite horizontal scrolling category pills with alternating directions",
  category: "layout-animations",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["marquee", "scroll", "infinite", "categories", "horizontal"],
  color: "sky",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "shrinkable-sticky-box",
  path: "/shrinkable-sticky-box",
  title: "Shrinkable Sticky Box",
  description: "A peek card that settles centered in the viewport instead of taking over the full screen",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["peek", "sticky", "center", "reveal", "scroll", "card"],
  color: "orange",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "center-peek-shrink",
  path: "/center-peek-shrink",
  title: "Center Peek Shrink",
  description: "Two-phase animation: card expands to fill viewport, then shrinks into a compact header anchored at the top",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["peek", "shrink", "anchor", "header", "scroll", "two-phase"],
  color: "amber",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "micro-magnetic-cta",
  path: "/micro-interactions/magnetic-cta",
  title: "Magnetic CTA Button",
  description: "Intent-aware button pull with restrained hover travel, press compression, and reduced-motion fallback",
  category: "hover-interactions",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["micro interaction", "magnetic", "cta", "button", "hover", "pointer"],
  color: "cyan",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "micro-ripple-press",
  path: "/micro-interactions/ripple-press",
  title: "Ripple Press Button",
  description: "Contained radial ripple feedback with keyboard-centered activation and a reduced-motion flash fallback",
  category: "hover-interactions",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["micro interaction", "ripple", "press", "button", "tap", "feedback"],
  color: "rose",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "micro-play-pause-toggle",
  path: "/micro-interactions/play-pause-toggle",
  title: "Morph Play Pause Toggle",
  description: "Play and pause states morph through shared geometry instead of blinking between isolated icons",
  category: "hover-interactions",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["micro interaction", "toggle", "play", "pause", "icon", "media"],
  color: "emerald",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "micro-copy-chip",
  path: "/micro-interactions/copy-chip",
  title: "Copy Confirmation Chip",
  description: "Compact copy confirmation with an optimistic state flip, checkmark draw, and timed reset",
  category: "hover-interactions",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["micro interaction", "copy", "clipboard", "confirmation", "chip", "success"],
  color: "amber",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "micro-slide-toggle",
  path: "/micro-interactions/slide-toggle",
  title: "Slide Toggle Switch",
  description: "Weighted switch travel with a track bloom that keeps state changes tactile and legible",
  category: "hover-interactions",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["micro interaction", "switch", "toggle", "thumb", "track", "state"],
  color: "sky",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "micro-segmented-rail",
  path: "/micro-interactions/segmented-rail",
  title: "Segmented Control Rail",
  description: "Selection state rides on a shared rail highlight for clearer filter and mode changes",
  category: "layout-animations",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["micro interaction", "segmented", "rail", "selection", "filter", "shared layout"],
  color: "violet",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "micro-chevron-accordion",
  path: "/micro-interactions/chevron-accordion",
  title: "Chevron Accordion",
  description: "Chevron rotation and masked content reveal make expand and collapse feel directional",
  category: "layout-animations",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["micro interaction", "accordion", "chevron", "expand", "collapse", "reveal"],
  color: "slate",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "micro-tab-underline",
  path: "/micro-interactions/tab-underline",
  title: "Tab Underline Follower",
  description: "Underline or pill highlights travel between tabs with separate content transitions",
  category: "layout-animations",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["micro interaction", "tabs", "underline", "follower", "shared element", "navigation"],
  color: "fuchsia",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "scroll-expand-grid",
  path: "/scroll-expand-grid",
  title: "Scroll Expand Grid",
  description: "Grid cards expand to reveal content with scroll-triggered spring animations",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["scroll", "expand", "grid", "card", "reveal", "spring"],
  color: "teal",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "image-compare",
  path: "/image-compare",
  title: "Image Compare",
  description: "Side-by-side image comparison slider with hover-driven divider and spring physics",
  category: "hover-interactions",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["compare", "slider", "before", "after", "image", "hover"],
  color: "fuchsia",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "dimensional-rift",
  path: "/dimensional-rift",
  title: "Dimensional Rift",
  description: "4-phase dimensional tear with 3D shard physics, gravitational void, chromatic tunnel, and magnetic reassembly",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["rift", "dimensional", "3d", "physics", "fragments", "tunnel", "chromatic", "void"],
  color: "fuchsia",
  group: "core",
  status: "ready",
});

registerAnimation({
  id: "transition-dimensional-rift",
  path: "/transition/dimensional-rift",
  title: "Dimensional Rift (Full Breakdown)",
  description: "Detailed breakdown of the 4-phase dimensional tear with technical specs and code examples",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["rift", "dimensional", "3d", "physics", "fragments", "tunnel", "chromatic", "void", "breakdown"],
  color: "fuchsia",
  group: "transition-lab",
  status: "ready",
});

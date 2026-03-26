export type AnimationCategory =
  | "scroll-based"
  | "text-effects"
  | "hover-interactions"
  | "3d-transforms"
  | "page-transitions"
  | "layout-animations";

export type AnimationDifficulty = "beginner" | "intermediate" | "advanced";
export type AnimationLibrary = "framer-motion" | "gsap";
export type AnimationGroup = "core" | "transition-lab";
export type AnimationStatus = "ready" | "planned";

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

const animations: AnimationMeta[] = [];

function sortAnimations(values: AnimationMeta[]): AnimationMeta[] {
  return [...values].sort((a, b) => a.title.localeCompare(b.title));
}

export function registerAnimation(meta: AnimationMeta): void {
  const existing = animations.findIndex((animation) => animation.id === meta.id);
  if (existing >= 0) {
    animations[existing] = meta;
    return;
  }

  animations.push(meta);
}

export function getAllAnimations(): AnimationMeta[] {
  return sortAnimations(animations);
}

export function getAnimationById(id: string): AnimationMeta | undefined {
  return animations.find((animation) => animation.id === id);
}

export function getAnimationByPath(path: string): AnimationMeta | undefined {
  return animations.find((animation) => animation.path === path);
}

export function getAnimationsByGroup(group: AnimationGroup): AnimationMeta[] {
  return animations.filter((animation) => animation.group === group);
}

export function getTransitionLabAnimations(): AnimationMeta[] {
  return getAnimationsByGroup("transition-lab");
}

export function getTransitionLabRoutes(): AnimationMeta[] {
  return getTransitionLabAnimations().filter((animation) => animation.path !== "/transition");
}

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

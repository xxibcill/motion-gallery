export type AnimationCategory =
  | "scroll-based"
  | "text-effects"
  | "hover-interactions"
  | "3d-transforms"
  | "page-transitions"
  | "layout-animations";

export type AnimationDifficulty = "beginner" | "intermediate" | "advanced";
export type AnimationLibrary = "framer-motion" | "gsap";

export interface AnimationMeta {
  id: string;
  title: string;
  description: string;
  category: AnimationCategory;
  difficulty: AnimationDifficulty;
  library: AnimationLibrary[];
  keywords: string[];
  color: string;
}

const animations: AnimationMeta[] = [];

export function registerAnimation(meta: AnimationMeta): void {
  const existing = animations.findIndex((a) => a.id === meta.id);
  if (existing >= 0) {
    animations[existing] = meta;
  } else {
    animations.push(meta);
  }
}

export function getAllAnimations(): AnimationMeta[] {
  return [...animations].sort((a, b) => a.title.localeCompare(b.title));
}

export function getAnimationById(id: string): AnimationMeta | undefined {
  return animations.find((a) => a.id === id);
}

export function searchAnimations(query: string): AnimationMeta[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return getAllAnimations();

  return animations.filter((a) => {
    return (
      a.title.toLowerCase().includes(lowerQuery) ||
      a.description.toLowerCase().includes(lowerQuery) ||
      a.keywords.some((k) => k.toLowerCase().includes(lowerQuery)) ||
      a.category.toLowerCase().includes(lowerQuery) ||
      a.library.some((l) => l.toLowerCase().includes(lowerQuery))
    );
  });
}

export function filterAnimations(
  categories?: AnimationCategory[],
  difficulty?: AnimationDifficulty[],
  library?: AnimationLibrary[]
): AnimationMeta[] {
  return animations.filter((a) => {
    if (categories && categories.length > 0 && !categories.includes(a.category)) {
      return false;
    }
    if (difficulty && difficulty.length > 0 && !difficulty.includes(a.difficulty)) {
      return false;
    }
    if (library && library.length > 0 && !library.some((l) => a.library.includes(l))) {
      return false;
    }
    return true;
  });
}

// Register all animations upfront
registerAnimation({
  id: "home",
  title: "Home",
  description: "Premium scroll-based motion gallery with peek-snap transitions and spring physics",
  category: "page-transitions",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["scroll", "snap", "peek", "sections", "spring"],
  color: "zinc",
});

registerAnimation({
  id: "gallery",
  title: "Gallery",
  description: "Browse and discover all animations with search and filtering",
  category: "layout-animations",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["search", "filter", "browse", "catalog"],
  color: "slate",
});

registerAnimation({
  id: "gsap",
  title: "GSAP",
  description: "GreenSock animations with timeline, ScrollTrigger, and scrub effects",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["gsap"],
  keywords: ["timeline", "scrolltrigger", "scrub", "stagger", "tween"],
  color: "indigo",
});

registerAnimation({
  id: "parallax",
  title: "Parallax",
  description: "Multi-layered depth effects with different scroll speeds",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["depth", "layers", "scroll", "perspective"],
  color: "violet",
});

registerAnimation({
  id: "text-reveal",
  title: "Text Reveal",
  description: "Character-by-character reveals, typewriter effects, and mask animations",
  category: "text-effects",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["character", "word", "typewriter", "mask", "stagger"],
  color: "fuchsia",
});

registerAnimation({
  id: "horizontal",
  title: "Horizontal",
  description: "Horizontal scrolling demos with scroll-driven navigation",
  category: "scroll-based",
  difficulty: "intermediate",
  library: ["framer-motion"],
  keywords: ["horizontal", "scroll", "cards", "gallery"],
  color: "emerald",
});

registerAnimation({
  id: "magnetic",
  title: "Magnetic",
  description: "Interactive magnetic field effects with spring physics",
  category: "hover-interactions",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["magnetic", "hover", "cursor", "spring", "interactive"],
  color: "rose",
});

registerAnimation({
  id: "reveal",
  title: "Reveal",
  description: "Content reveal animations with various transitions",
  category: "layout-animations",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["reveal", "fade", "scale", "clip-path", "mask"],
  color: "amber",
});

registerAnimation({
  id: "3d",
  title: "3D",
  description: "Three-dimensional animations and transforms",
  category: "3d-transforms",
  difficulty: "advanced",
  library: ["framer-motion"],
  keywords: ["3d", "perspective", "rotate", "transform", "card"],
  color: "cyan",
});

registerAnimation({
  id: "floating-logos",
  title: "Floating Logos",
  description: "Multiple rounded squares floating around with adjustable speed and distance",
  category: "layout-animations",
  difficulty: "beginner",
  library: ["framer-motion"],
  keywords: ["floating", "logos", "squares", "ambient", "background"],
  color: "violet",
});

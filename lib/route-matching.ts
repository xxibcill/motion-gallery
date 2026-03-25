import type { AnimationMeta } from "@/lib/animation-registry";

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function isPathActive(
  pathname: string,
  targetPath: string,
  matchNested = true
): boolean {
  const current = normalizePathname(pathname);
  const target = normalizePathname(targetPath);

  if (target === "/") {
    return current === "/";
  }

  if (current === target) {
    return true;
  }

  return matchNested ? current.startsWith(`${target}/`) : false;
}

export function isAnimationActive(
  pathname: string,
  animation: Pick<AnimationMeta, "id" | "path">
): boolean {
  if (animation.path === "/") {
    return isPathActive(pathname, animation.path, false);
  }

  if (animation.id === "transition") {
    return isPathActive(pathname, animation.path, false);
  }

  return isPathActive(pathname, animation.path, true);
}

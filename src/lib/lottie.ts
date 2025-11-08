// Lottie Animation Utilities

/**
 * All available Lottie animations
 */
export type LottieAnimation =
  // Hero
  | "hero-circuit-bg"
  | "scroll-down-arrow"
  | "hero-blob-morph"
  // About
  | "profile-line-draw"
  | "chip-pulse"
  // Research
  | "equation-reveal"
  | "doc-analyze"
  // Achievements
  | "medal-shimmer"
  | "timeline-dot-pop"
  // Gallery
  | "gallery-shutter"
  | "lens-flare-sweep"
  // Resume
  | "pdf-open"
  | "download-tick"
  // Contact
  | "message-send"
  | "error-shake"
  // Global Utilities
  | "loader"
  | "success"
  | "error"
  | "toggle-dark"
  | "toggle-light"
  | "section-divider"
  // Projects Page
  | "code-window-load"
  | "card-glow-border"
  | "deploy-rocket"
  // Certifications Page
  | "certificate-reveal"
  | "seal-stamp"
  // Blog Page
  | "typing-cursor"
  | "page-turn"
  | "empty-folder-soft"
  // Legacy
  | "hero-accent";

/**
 * Get Lottie animation path with theme support
 * @param name - Animation name
 * @param mode - Theme mode (dark or light)
 * @returns Path to the animation JSON file
 */
export function getLottie(
  name: LottieAnimation,
  mode: "dark" | "light" = "dark"
): string {
  return `/animations/${name}-${mode}.json`;
}

/**
 * Preload Lottie animations for better performance
 */
export async function preloadLottie(
  name: LottieAnimation,
  mode: "dark" | "light" = "dark"
): Promise<unknown> {
  try {
    const response = await fetch(getLottie(name, mode));
    if (!response.ok) throw new Error(`Failed to load ${name}-${mode}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to preload Lottie: ${name}-${mode}`, error);
    return null;
  }
}

/**
 * Preload all critical animations for both themes
 */
export function preloadCriticalLotties(mode: "dark" | "light" = "dark") {
  if (typeof window === "undefined") return;
  
  // Preload loader first (most critical)
  preloadLottie("loader", mode);
  
  // Preload theme toggles
  requestIdleCallback(() => {
    preloadLottie("toggle-dark", mode);
    preloadLottie("toggle-light", mode);
  });
  
  // Preload others
  requestIdleCallback(() => {
    preloadLottie("success", mode);
    preloadLottie("error", mode);
  }, { timeout: 2000 });
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Fallback for browsers without requestIdleCallback
if (typeof window !== "undefined" && !window.requestIdleCallback) {
  (window as any).requestIdleCallback = (cb: Function) => {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50.0 - (Date.now() - start)),
      });
    }, 1);
  };
}

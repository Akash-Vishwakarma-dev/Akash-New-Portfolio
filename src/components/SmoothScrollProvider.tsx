"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return; // Skip smooth scrolling if user prefers reduced motion
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Request animation frame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

// Hook to access Lenis instance
export function useLenis() {
  return useRef<Lenis | null>(null);
}

// Scroll to function
export function scrollTo(target: string | number, options?: { offset?: number; duration?: number }) {
  if (typeof window === "undefined") return;

  const lenis = (window as any).lenis;
  if (!lenis) {
    // Fallback to native scroll
    if (typeof target === "string") {
      const element = document.querySelector(target);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
    return;
  }

  lenis.scrollTo(target, {
    offset: options?.offset || 0,
    duration: options?.duration || 1.2,
  });
}

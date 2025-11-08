/**
 * Scroll Utilities
 * Helper functions for scroll-based animations
 */

import { useEffect, useState, useRef, RefObject } from 'react';

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Linear interpolation
 */
export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

/**
 * Map a value from one range to another
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Easing functions
 */
export const easing = {
  easeInOut: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number): number => t * (2 - t),
  easeIn: (t: number): number => t * t,
};

/**
 * Get scroll progress between two elements
 */
export const useScrollProgress = (
  targetRef: RefObject<HTMLElement>,
  options: {
    start?: number; // 0-1, when to start (0 = top of viewport)
    end?: number; // 0-1, when to end (1 = bottom of viewport)
    offset?: number; // px offset
  } = {}
): number => {
  const { start = 0, end = 1, offset = 0 } = options;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!targetRef.current) return;

      const rect = targetRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      
      const elementTop = rect.top + offset;
      const elementHeight = rect.height;
      
      const startPoint = vh * (1 - start);
      const endPoint = vh * (1 - end);
      
      const scrolled = startPoint - elementTop;
      const totalDistance = startPoint - endPoint + elementHeight;
      
      const rawProgress = scrolled / totalDistance;
      const clampedProgress = clamp(rawProgress, 0, 1);
      
      setProgress(clampedProgress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [targetRef, start, end, offset]);

  return progress;
};

/**
 * Get bounded scroll position (clamped between 0 and max scroll)
 */
export const useBoundedScroll = (): number => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const bounded = clamp(currentScroll / maxScroll, 0, 1);
      setScrollY(bounded);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
};

/**
 * Smooth scroll to element
 */
export const scrollToElement = (
  elementId: string,
  options: {
    offset?: number;
    behavior?: ScrollBehavior;
  } = {}
): void => {
  const { offset = 0, behavior = 'smooth' } = options;
  const element = document.getElementById(elementId);
  
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior,
  });
};

/**
 * Check if element is in viewport
 */
export const isInViewport = (element: HTMLElement, threshold = 0): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
  );
};

/**
 * Parallax hook
 */
export const useParallax = (
  ref: RefObject<HTMLElement>,
  speed: number = 0.5
): { y: number } => {
  const [y, setY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;

      setY(rate);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref, speed]);

  return { y };
};

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { interpolate } from 'flubber';

interface MorphBlobProps {
  shapes?: string[]; // Array of SVG path d attributes
  duration?: number; // Duration of each morph in ms
  className?: string;
  colors?: {
    light: string[];
    dark: string[];
  };
}

// Default organic blob shapes
const defaultShapes = [
  'M60.5,-55.1C76.8,-40.8,87.1,-20.4,86.9,-0.3C86.7,19.9,75.9,39.8,59.6,52.4C43.3,65,21.6,70.3,0.9,69.4C-19.8,68.5,-39.6,61.4,-54.3,48.8C-69,36.2,-78.6,18.1,-78.4,0.2C-78.2,-17.7,-68.3,-35.4,-53.6,-49.7C-38.9,-64,-19.5,-75,-0.1,-74.9C19.2,-74.8,44.2,-69.4,60.5,-55.1Z',
  'M57.3,-50.5C72.9,-36.1,83.7,-18.1,83.8,0.1C83.9,18.2,73.4,36.5,57.8,48.9C42.2,61.3,21.1,67.9,1.4,66.5C-18.3,65.1,-36.6,55.7,-49.8,43.3C-63,30.9,-71.1,15.4,-71.4,-0.3C-71.7,-16,-64.2,-32,-51,-46.4C-37.8,-60.8,-18.9,-73.6,-0.4,-73.2C18.1,-72.8,41.7,-64.9,57.3,-50.5Z',
  'M51.9,-48.3C66.3,-34.2,76.4,-17.1,76.9,0.3C77.4,17.7,68.3,35.4,53.9,47.8C39.5,60.2,19.7,67.3,0.5,66.8C-18.7,66.3,-37.5,58.2,-50.4,45.8C-63.3,33.4,-70.4,16.7,-70.2,0.2C-70,-16.3,-62.5,-32.6,-49.6,-46.7C-36.7,-60.8,-18.3,-72.7,-0.3,-72.4C17.7,-72.1,37.5,-62.4,51.9,-48.3Z',
  'M54.8,-53.9C69.8,-39.8,80.3,-19.9,80.1,-0.2C79.9,19.5,69,39,54,52C39,65,19.5,71.5,0.3,71.2C-18.9,70.9,-37.8,63.8,-51.8,51C-65.8,38.2,-74.9,19.1,-74.8,0.2C-74.7,-18.7,-65.4,-37.4,-51.4,-51.5C-37.4,-65.6,-18.7,-75.1,0.4,-75.5C19.9,-75.9,39.8,-68,54.8,-53.9Z',
];

export const MorphBlob: React.FC<MorphBlobProps> = ({
  shapes = defaultShapes,
  duration = 3000,
  className = '',
  colors = {
    light: ['#0ea5e9', '#6366f1', '#8b5cf6'],
    dark: ['#22d3ee', '#a78bfa', '#c084fc'],
  },
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!pathRef.current || shapes.length < 2 || prefersReducedMotion) return;

    const morphPath = () => {
      const nextIndex = (currentIndex + 1) % shapes.length;
      const interpolator = interpolate(shapes[currentIndex], shapes[nextIndex], {
        maxSegmentLength: 2,
      });

      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth transition
        const eased = progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

        if (pathRef.current) {
          pathRef.current.setAttribute('d', interpolator(eased));
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setCurrentIndex(nextIndex);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(morphPath, duration);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentIndex, shapes, duration, prefersReducedMotion]);

  // Get current color based on theme
  // Use light theme colors during SSR to prevent hydration mismatch
  const isDark = mounted && theme === 'dark';
  const colorArray = isDark ? colors.dark : colors.light;
  const currentColor = colorArray[currentIndex % colorArray.length];

  // If reduced motion, just show static first shape
  const displayPath = prefersReducedMotion ? shapes[0] : shapes[currentIndex];

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      key={mounted ? 'mounted' : 'ssr'}
      suppressHydrationWarning
    >
      <defs>
        <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={currentColor} stopOpacity="0.6" suppressHydrationWarning />
          <stop offset="100%" stopColor={currentColor} stopOpacity="0.2" suppressHydrationWarning />
        </linearGradient>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
      <path
        ref={pathRef}
        d={displayPath}
        fill="url(#blobGradient)"
        filter="url(#goo)"
        transform="translate(100 100)"
      />
    </svg>
  );
};

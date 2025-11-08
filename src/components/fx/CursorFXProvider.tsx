'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

export interface CursorFXConfig {
  magnet?: boolean;
  trail?: boolean;
  intensity?: number;
  disableOnMobile?: boolean;
}

interface CursorContextValue {
  setMagnetic: (element: HTMLElement | null, intensity?: number) => void;
  clearMagnetic: () => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export const useCursorFX = () => {
  const context = useContext(CursorContext);
  if (!context) {
    // Return no-op functions if context is not available (SSR)
    return {
      setMagnetic: () => {},
      clearMagnetic: () => {},
    };
  }
  return context;
};

interface Props {
  children: React.ReactNode;
  config?: CursorFXConfig;
}

export const CursorFXProvider: React.FC<Props> = ({ 
  children, 
  config = {} 
}) => {
  const {
    magnet = true,
    trail = false,
    intensity = 0.3,
    disableOnMobile = true,
  } = config;

  const { theme } = useTheme();
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ dot: { x: 0, y: 0 }, ring: { x: 0, y: 0 } });
  const magneticTarget = useRef<HTMLElement | null>(null);
  const magneticIntensity = useRef(intensity);
  const rafRef = useRef<number>();
  const trailParticles = useRef<Array<{ x: number; y: number; alpha: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check for touch device
    const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touchCheck);

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isMounted || (disableOnMobile && isTouch) || prefersReducedMotion) {
      return;
    }

    // Hide default cursor
    document.body.classList.add('cursor-none');

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Add trail particle
      if (trail && Math.random() > 0.7) {
        trailParticles.current.push({
          x: e.clientX,
          y: e.clientY,
          alpha: 1,
        });

        // Limit particles
        if (trailParticles.current.length > 20) {
          trailParticles.current.shift();
        }
      }
    };

    const animate = () => {
      if (!cursorDotRef.current || !cursorRingRef.current) return;

      let targetX = mousePos.current.x;
      let targetY = mousePos.current.y;

      // Apply magnetic effect
      if (magneticTarget.current && magnet) {
        const rect = magneticTarget.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = centerX - mousePos.current.x;
        const deltaY = centerY - mousePos.current.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Apply magnetic pull within 100px radius
        if (distance < 100) {
          const pullStrength = (1 - distance / 100) * magneticIntensity.current;
          targetX += deltaX * pullStrength;
          targetY += deltaY * pullStrength;
        }
      }

      // Smooth follow for dot (fast)
      currentPos.current.dot.x += (targetX - currentPos.current.dot.x) * 0.3;
      currentPos.current.dot.y += (targetY - currentPos.current.dot.y) * 0.3;

      // Smooth follow for ring (slower)
      currentPos.current.ring.x += (targetX - currentPos.current.ring.x) * 0.15;
      currentPos.current.ring.y += (targetY - currentPos.current.ring.y) * 0.15;

      cursorDotRef.current.style.transform = `translate(${currentPos.current.dot.x}px, ${currentPos.current.dot.y}px)`;
      cursorRingRef.current.style.transform = `translate(${currentPos.current.ring.x}px, ${currentPos.current.ring.y}px)`;

      // Animate trail particles
      if (trail && trailParticles.current.length > 0) {
        trailParticles.current = trailParticles.current
          .map(p => ({ ...p, alpha: p.alpha * 0.95 }))
          .filter(p => p.alpha > 0.01);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.classList.remove('cursor-none');
    };
  }, [isMounted, isTouch, disableOnMobile, magnet, trail, prefersReducedMotion]);

  const setMagnetic = (element: HTMLElement | null, customIntensity?: number) => {
    magneticTarget.current = element;
    if (customIntensity !== undefined) {
      magneticIntensity.current = customIntensity;
    }
  };

  const clearMagnetic = () => {
    magneticTarget.current = null;
    magneticIntensity.current = intensity;
  };

  // Don't render cursor on touch devices or if reduced motion is preferred
  const shouldRenderCursor = isMounted && !(disableOnMobile && isTouch) && !prefersReducedMotion;

  // Theme colors
  const isDark = theme === 'dark';
  const dotColor = isDark ? 'rgba(34, 211, 238, 0.8)' : 'rgba(14, 165, 233, 0.8)'; // cyan
  const ringColor = isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(99, 102, 241, 0.4)'; // indigo
  const trailColor = isDark ? 'rgba(34, 211, 238, 0.3)' : 'rgba(14, 165, 233, 0.3)';

  return (
    <CursorContext.Provider value={{ setMagnetic, clearMagnetic }}>
      {shouldRenderCursor && (
        <>
          {/* Cursor Dot */}
          <div
            ref={cursorDotRef}
            className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{
              backgroundColor: dotColor,
              marginLeft: '-4px',
              marginTop: '-4px',
              willChange: 'transform',
            }}
          />
          
          {/* Cursor Ring */}
          <div
            ref={cursorRingRef}
            className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998] border-2 transition-[width,height,border-color]"
            style={{
              borderColor: ringColor,
              marginLeft: '-16px',
              marginTop: '-16px',
              willChange: 'transform',
            }}
          />

          {/* Trail Particles */}
          {trail && trailParticles.current.length > 0 && (
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9997]">
              {trailParticles.current.map((particle, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    left: particle.x,
                    top: particle.y,
                    backgroundColor: trailColor,
                    opacity: particle.alpha,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
      {children}
    </CursorContext.Provider>
  );
};

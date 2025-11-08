'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCursorFX } from './CursorFXProvider';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  as?: 'button' | 'a' | 'div';
  href?: string;
  onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  intensity = 0.5,
  as: Component = 'div',
  href,
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { setMagnetic, clearMagnetic } = useCursorFX();

  useEffect(() => {
    setIsMounted(true);
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!buttonRef.current || prefersReducedMotion) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    // Apply magnetic pull
    setPosition({
      x: deltaX * intensity,
      y: deltaY * intensity,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (buttonRef.current) {
      setMagnetic(buttonRef.current, intensity);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
    clearMagnetic();
  };

  const MotionComponent = motion[Component as keyof typeof motion] as any;

  const props = {
    ref: buttonRef,
    className,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick,
    ...(href && { href }),
  };

  // Prevent hydration mismatch by rendering static version first
  if (!isMounted) {
    const StaticComponent = Component as any;
    return (
      <StaticComponent {...props}>
        {children}
      </StaticComponent>
    );
  }

  return (
    <MotionComponent
      {...props}
      animate={{
        x: prefersReducedMotion ? 0 : position.x,
        y: prefersReducedMotion ? 0 : position.y,
        scale: isHovered && !prefersReducedMotion ? 1.05 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
      }}
    >
      {children}
    </MotionComponent>
  );
};

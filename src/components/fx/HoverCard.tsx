'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // 0-1, strength of tilt effect
  glowEffect?: boolean;
  scaleOnHover?: boolean;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className = '',
  intensity = 0.3,
  glowEffect = true,
  scaleOnHover = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -10 * intensity;
    const rotateYValue = (mouseX / (rect.width / 2)) * 10 * intensity;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const isDark = theme === 'dark';
  const glowColor = isDark 
    ? 'rgba(34, 211, 238, 0.3)' // cyan in dark mode
    : 'rgba(14, 165, 233, 0.3)'; // blue in light mode

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        scale: scaleOnHover && isHovered && !prefersReducedMotion ? 1.03 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={cn(
        'relative rounded-lg transition-shadow duration-300',
        glowEffect && isHovered && !prefersReducedMotion && 'shadow-xl',
        className
      )}
    >
      {/* Glow effect */}
      {glowEffect && isHovered && !prefersReducedMotion && (
        <div
          className="absolute inset-0 rounded-lg opacity-50 blur-xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`,
            zIndex: -1,
          }}
        />
      )}
      
      {/* Gradient border on hover */}
      {isHovered && !prefersReducedMotion && (
        <div
          className="absolute inset-0 rounded-lg opacity-30"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.5), rgba(167, 139, 250, 0.5))'
              : 'linear-gradient(135deg, rgba(14, 165, 233, 0.5), rgba(99, 102, 241, 0.5))',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}
      
      {children}
    </motion.div>
  );
};

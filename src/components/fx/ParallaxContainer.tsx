'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number; // -1 to 1, negative = slower, positive = faster
  direction?: 'vertical' | 'horizontal';
  className?: string;
  springConfig?: {
    stiffness?: number;
    damping?: number;
  };
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  speed = 0.5,
  direction = 'vertical',
  className = '',
  springConfig = { stiffness: 100, damping: 30 },
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Transform scroll progress to parallax value
  const range = 100 * speed; // pixels to move
  const rawTransform = useTransform(scrollYProgress, [0, 1], [-range, range]);
  
  // Apply spring physics for smooth motion
  const smoothTransform = useSpring(rawTransform, springConfig);

  // Skip parallax if reduced motion is preferred
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const motionStyle = direction === 'vertical' 
    ? { y: smoothTransform }
    : { x: smoothTransform };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={motionStyle}>
        {children}
      </motion.div>
    </div>
  );
};

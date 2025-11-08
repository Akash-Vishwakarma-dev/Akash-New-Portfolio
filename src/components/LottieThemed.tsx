"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { useTheme } from "next-themes";
import { getLottie, prefersReducedMotion, type LottieAnimation } from "@/lib/lottie";

interface LottieThemedProps {
  name: LottieAnimation;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  size?: number;
  onComplete?: () => void;
}

/**
 * Theme-aware Lottie component
 * Automatically loads the correct animation variant based on the current theme
 */
export function LottieThemed({
  name,
  loop = false,
  autoplay = true,
  className = "",
  size,
  onComplete,
}: LottieThemedProps) {
  const { theme, resolvedTheme } = useTheme();
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [mounted, setMounted] = useState(false);

  // Determine if we should use dark or light variant
  const isDark = (theme === "dark" || resolvedTheme === "dark");
  const mode = isDark ? "dark" : "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Skip if user prefers reduced motion
    if (prefersReducedMotion()) {
      return;
    }

    const src = getLottie(name, mode);
    
    fetch(src)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => {
        console.error(`Failed to load ${name}-${mode} animation:`, err);
      });
  }, [name, mode, mounted]);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || prefersReducedMotion()) {
    return null;
  }

  if (!animationData) {
    return (
      <div 
        className={`animate-pulse bg-muted/20 ${className}`} 
        style={size ? { width: size, height: size } : undefined}
      />
    );
  }

  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={className} style={style}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        onComplete={onComplete}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

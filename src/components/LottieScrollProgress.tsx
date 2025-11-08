"use client";

import { useEffect, useState, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useTheme } from "next-themes";
import { useScroll, useTransform } from "framer-motion";
import { getLottie, prefersReducedMotion, type LottieAnimation } from "@/lib/lottie";

interface LottieScrollProgressProps {
  name: LottieAnimation;
  className?: string;
  size?: number;
  scrollRange?: [number, number]; // e.g., [0, 0.25] for first 25% of page
}

/**
 * Lottie animation controlled by scroll progress
 * Perfect for hero blob morphs and scroll-linked effects
 */
export function LottieScrollProgress({
  name,
  className = "",
  size,
  scrollRange = [0, 0.25],
}: LottieScrollProgressProps) {
  const { theme, resolvedTheme } = useTheme();
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [mounted, setMounted] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const isDark = (theme === "dark" || resolvedTheme === "dark");
  const mode = isDark ? "dark" : "light";

  // Get scroll progress
  const { scrollYProgress } = useScroll();
  
  // Map scroll to animation frame
  const animationProgress = useTransform(
    scrollYProgress,
    scrollRange,
    [0, 1]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || prefersReducedMotion()) return;

    const src = getLottie(name, mode);
    
    fetch(src)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => {
        console.error(`Failed to load ${name}-${mode} animation:`, err);
      });
  }, [name, mode, mounted]);

  useEffect(() => {
    if (!lottieRef.current || !animationData) return;

    const unsubscribe = animationProgress.on("change", (latest) => {
      if (lottieRef.current) {
        const totalFrames = lottieRef.current.getDuration(true);
        if (totalFrames) {
          const targetFrame = Math.floor(latest * totalFrames);
          lottieRef.current.goToAndStop(targetFrame, true);
        }
      }
    });

    return () => unsubscribe();
  }, [animationProgress, animationData]);

  if (!mounted || prefersReducedMotion() || !animationData) {
    return null;
  }

  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className={className} style={style}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        autoplay={false}
        loop={false}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

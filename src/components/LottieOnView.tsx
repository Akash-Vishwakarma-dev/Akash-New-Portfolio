"use client";

import { useInView } from "react-intersection-observer";
import { LottieThemed } from "./LottieThemed";
import type { LottieAnimation } from "@/lib/lottie";

interface LottieOnViewProps {
  name: LottieAnimation;
  loop?: boolean;
  className?: string;
  size?: number;
  threshold?: number;
  triggerOnce?: boolean;
  onComplete?: () => void;
}

/**
 * Lottie component that plays when it comes into view
 * Uses Intersection Observer for performance
 */
export function LottieOnView({
  name,
  loop = false,
  className,
  size,
  threshold = 0.2,
  triggerOnce = true,
  onComplete,
}: LottieOnViewProps) {
  const { ref, inView } = useInView({
    triggerOnce,
    threshold,
  });

  return (
    <div ref={ref} className={className} style={size ? { width: size, height: size } : undefined}>
      {inView && (
        <LottieThemed
          name={name}
          loop={loop}
          autoplay={true}
          className="w-full h-full"
          onComplete={onComplete}
        />
      )}
    </div>
  );
}

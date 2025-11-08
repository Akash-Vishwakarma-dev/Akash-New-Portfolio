"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { getLottie } from "@/lib/lottie";

interface LottieLoaderProps {
  size?: number;
  className?: string;
}

export function LottieLoader({ size = 100, className }: LottieLoaderProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(getLottie("loader"))
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error("Failed to load loader animation:", err));
  }, []);

  if (!animationData) {
    // Fallback while loading
    return (
      <div className={className} style={{ width: size, height: size }}>
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ width: size, height: size }}>
      <Lottie animationData={animationData} loop autoplay />
    </div>
  );
}

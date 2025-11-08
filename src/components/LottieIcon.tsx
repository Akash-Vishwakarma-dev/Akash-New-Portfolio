"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { getLottie } from "@/lib/lottie";

interface LottieIconProps {
  name: "success" | "error" | "loader";
  size?: number;
  className?: string;
  loop?: boolean;
}

export function LottieIcon({
  name,
  size = 100,
  className = "",
  loop = name === "loader",
}: LottieIconProps) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(getLottie(name))
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error(`Failed to load ${name} animation:`, err));
  }, [name]);

  if (!animationData) {
    return <div className={`animate-pulse ${className}`} style={{ width: size, height: size }} />;
  }

  return (
    <div className={className} style={{ width: size, height: size }}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

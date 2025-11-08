"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad"> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "landscape";
}

/**
 * Optimized Image Component
 * - Automatic blur placeholder
 * - Loading skeleton
 * - Error fallback
 * - Optimized loading priority
 */
export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  showSkeleton = true,
  aspectRatio,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  const imageSrc = error && fallbackSrc ? fallbackSrc : src;

  return (
    <div className={cn("relative overflow-hidden", aspectRatio && aspectRatioClasses[aspectRatio])}>
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        {...props}
      />
    </div>
  );
}

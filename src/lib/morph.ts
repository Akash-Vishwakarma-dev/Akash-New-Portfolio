import { interpolate } from "flubber";

export interface MorphPath {
  d: string;
  id?: string;
}

/**
 * Create interpolated SVG path between two paths
 */
export function createMorphPath(
  fromPath: string,
  toPath: string,
  progress: number
): string {
  try {
    const interpolator = interpolate(fromPath, toPath, {
      maxSegmentLength: 10,
    });
    return interpolator(progress);
  } catch (error) {
    console.error("Failed to interpolate SVG paths:", error);
    return fromPath;
  }
}

/**
 * Create multi-path morph interpolator
 */
export function createMultiPathMorph(paths: string[]): (progress: number) => string {
  if (paths.length < 2) return () => paths[0] || "";

  return (progress: number) => {
    const totalSegments = paths.length - 1;
    const scaledProgress = progress * totalSegments;
    const fromIndex = Math.floor(scaledProgress);
    const toIndex = Math.min(fromIndex + 1, paths.length - 1);
    const segmentProgress = scaledProgress - fromIndex;

    return createMorphPath(paths[fromIndex], paths[toIndex], segmentProgress);
  };
}

/**
 * Generate blob-like SVG path
 */
export function generateBlobPath(
  width: number = 400,
  height: number = 400,
  complexity: number = 8,
  randomness: number = 0.3
): string {
  const centerX = width / 2;
  const centerY = height / 2;
  const radiusX = width * 0.35;
  const radiusY = height * 0.35;

  const points: [number, number][] = [];
  const angleStep = (Math.PI * 2) / complexity;

  for (let i = 0; i < complexity; i++) {
    const angle = angleStep * i;
    const randomFactor = 1 + (Math.random() - 0.5) * randomness;
    const x = centerX + Math.cos(angle) * radiusX * randomFactor;
    const y = centerY + Math.sin(angle) * radiusY * randomFactor;
    points.push([x, y]);
  }

  // Create smooth curve through points
  let path = `M ${points[0][0]},${points[0][1]}`;
  
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const nextNext = points[(i + 2) % points.length];

    // Calculate control points for smooth bezier curve
    const cp1x = current[0] + (next[0] - current[0]) * 0.5;
    const cp1y = current[1] + (next[1] - current[1]) * 0.5;
    const cp2x = next[0] - (nextNext[0] - current[0]) * 0.15;
    const cp2y = next[1] - (nextNext[1] - current[1]) * 0.15;

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next[0]},${next[1]}`;
  }

  path += " Z";
  return path;
}

/**
 * Predefined professional blob paths
 */
export const HERO_BLOB_PATHS = [
  // Blob 1: Smooth organic shape
  "M400 200 C400 270 370 330 310 360 C250 390 180 390 120 360 C60 330 30 270 30 200 C30 130 60 70 120 40 C180 10 250 10 310 40 C370 70 400 130 400 200 Z",
  
  // Blob 2: More angular variation
  "M380 200 C380 280 340 340 270 370 C200 400 130 380 80 330 C30 280 20 210 40 140 C60 70 110 20 180 10 C250 0 320 30 360 90 C380 120 380 160 380 200 Z",
  
  // Blob 3: Stretched horizontal
  "M420 200 C420 250 400 300 350 330 C300 360 240 370 180 350 C120 330 70 290 50 240 C30 190 30 130 60 80 C90 30 140 0 200 0 C260 0 320 20 370 60 C420 100 420 150 420 200 Z",
];

/**
 * Generate random blob paths for variety
 */
export function generateRandomBlobPaths(count: number = 3): string[] {
  return Array.from({ length: count }, () =>
    generateBlobPath(400, 400, 8, 0.35)
  );
}

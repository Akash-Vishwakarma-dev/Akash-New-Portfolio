/**
 * Dynamic Import Utilities
 * Optimized code splitting and lazy loading helpers
 */

import dynamic from "next/dynamic";
import { ComponentType, ReactNode } from "react";

interface LoadingComponentProps {
  fallback?: ReactNode;
}

const LoadingComponent = ({ fallback }: LoadingComponentProps) => {
  if (!fallback) return null;
  return <>{fallback}</>;
};

/**
 * Create a lazy-loaded component with loading fallback
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  return dynamic(importFunc, {
    loading: () => <LoadingComponent fallback={fallback} />,
    ssr: true,
  });
}

/**
 * Create a client-only lazy component (no SSR)
 */
export function lazyLoadClient<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  return dynamic(importFunc, {
    loading: () => <LoadingComponent fallback={fallback} />,
    ssr: false,
  });
}

/**
 * Preload a dynamic component
 */
export async function preloadComponent<T>(
  importFunc: () => Promise<{ default: T }>
): Promise<void> {
  if (typeof window !== "undefined") {
    try {
      await importFunc();
    } catch (error) {
      console.error("Failed to preload component:", error);
    }
  }
}

/**
 * Lazy load multiple components
 */
export function lazyLoadMultiple<T extends Record<string, ComponentType<any>>>(
  imports: { [K in keyof T]: () => Promise<{ default: T[K] }> }
): { [K in keyof T]: ReturnType<typeof dynamic> } {
  const result = {} as any;
  
  for (const [key, importFunc] of Object.entries(imports)) {
    result[key] = dynamic(importFunc as any, { ssr: true });
  }
  
  return result;
}

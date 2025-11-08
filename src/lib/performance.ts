/**
 * Performance Monitoring Utilities
 */

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: PerformanceMetrics) {
  // Log in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.log("Web Vitals:", metric);
  }
  
  // Send to analytics in production
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    // Add your analytics code here
    // Example: gtag('event', metric.name, { value: metric.value });
  }
}

/**
 * Measure component render time
 */
export function measureRender(componentName: string) {
  if (typeof window === "undefined") return;
  
  const startMark = `${componentName}-start`;
  const endMark = `${componentName}-end`;
  const measureName = `${componentName}-render`;
  
  performance.mark(startMark);
  
  return () => {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    
    const measure = performance.getEntriesByName(measureName)[0];
    if (process.env.NODE_ENV === "development") {
      console.log(`${componentName} rendered in ${measure.duration.toFixed(2)}ms`);
    }
    
    // Clean up marks
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
  };
}

/**
 * Measure async operation
 */
export async function measureAsync<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  const endMeasure = measureRender(operationName);
  try {
    const result = await operation();
    if (endMeasure) endMeasure();
    return result;
  } catch (error) {
    if (endMeasure) endMeasure();
    throw error;
  }
}

/**
 * Check if user is on slow connection
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === "undefined" || !("connection" in navigator)) {
    return false;
  }
  
  const connection = (navigator as Navigator & { 
    connection?: { 
      effectiveType?: string; 
      saveData?: boolean;
    } 
  }).connection;
  
  return (
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g" ||
    connection?.saveData === true
  );
}

/**
 * Defer execution until browser is idle
 */
export function whenIdle(callback: () => void, timeout = 2000): void {
  if (typeof window === "undefined") return;

  type WindowWithIdleCallback = Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  };

  if ("requestIdleCallback" in window) {
    (window as WindowWithIdleCallback).requestIdleCallback?.(callback, { timeout });
  } else {
    setTimeout(callback, 1);
  }
}/**
 * Prefetch a route
 */
export function prefetchRoute(href: string): void {
  if (typeof window === "undefined") return;
  
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Preload a resource
 */
export function preloadResource(href: string, as: string): void {
  if (typeof window === "undefined") return;
  
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

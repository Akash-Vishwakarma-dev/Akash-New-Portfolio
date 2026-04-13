import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "../env";

/**
 * Check if rate limiting is enabled
 */
const isRateLimitEnabled = !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);

/**
 * Redis client for rate limiting (only if credentials are provided)
 */
const redis = isRateLimitEnabled
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL!,
      token: env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

/**
 * Rate limiters for different endpoints
 */

// Public API endpoints: 10 requests per 10 seconds
export const publicRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
      prefix: "@ratelimit/public",
    })
  : null;

// Admin API endpoints: 100 requests per minute
export const adminRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      analytics: true,
      prefix: "@ratelimit/admin",
    })
  : null;

// Contact form:
// - Development: generous limit for testing
// - Production: conservative limit to reduce abuse
export const contactRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter:
        env.NODE_ENV === "development"
          ? Ratelimit.slidingWindow(100, "1 h")
          : Ratelimit.slidingWindow(10, "1 h"),
      analytics: true,
      prefix: "@ratelimit/contact-v2",
    })
  : null;

// Auth endpoints: 5 requests per minute
export const authRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "@ratelimit/auth",
    })
  : null;

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
  return ip;
}

/**
 * Check rate limit and return response if exceeded
 */
export async function checkRateLimit(
  ratelimit: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; response?: Response }> {
  // Skip rate limiting if not configured (development mode)
  if (!ratelimit) {
    if (env.NODE_ENV === "development") {
      console.warn("⚠️  Rate limiting disabled (Upstash Redis not configured)");
    }
    return { success: true };
  }

  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  if (!success) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({
          error: "Too many requests",
          message: "You have exceeded the rate limit. Please try again later.",
          limit,
          remaining,
          reset: new Date(reset).toISOString(),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }

  return { success: true };
}

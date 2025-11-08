import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-side environment variables schema
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().url(),
    
    // NextAuth
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    
    // OAuth Providers (optional)
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    
    // Cloudflare R2 (optional)
    R2_ENDPOINT: z.string().url().optional(),
    R2_BUCKET: z.string().optional(),
    R2_ACCESS_KEY: z.string().optional(),
    R2_SECRET_KEY: z.string().optional(),
    R2_PUBLIC_URL: z.string().url().optional(),
    
    // Email (optional)
    RESEND_API_KEY: z.string().optional(),
    ADMIN_EMAIL: z.string().email().optional(),
    
    // Rate Limiting (optional)
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    
    // Admin users (comma-separated emails)
    ADMIN_EMAILS: z.string().default(""),
  },

  /**
   * Client-side environment variables schema
   * Must be prefixed with NEXT_PUBLIC_
   */
  client: {
    // Add any public env vars here
    // NEXT_PUBLIC_API_URL: z.string().url(),
  },

  /**
   * Runtime environment variables
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    R2_ENDPOINT: process.env.R2_ENDPOINT,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_ACCESS_KEY: process.env.R2_ACCESS_KEY,
    R2_SECRET_KEY: process.env.R2_SECRET_KEY,
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
  },

  /**
   * Skip validation during build if set to true
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Make sure env vars are not empty strings
   */
  emptyStringAsUndefined: true,
});

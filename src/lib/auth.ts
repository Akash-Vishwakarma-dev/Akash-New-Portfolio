import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * NextAuth handlers and utilities
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/**
 * Get the current session server-side
 */
export const getSession = auth;

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}

/**
 * Check if user is an admin
 */
export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

/**
 * Require authentication (throw if not authenticated)
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Require admin role (throw if not admin)
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }
  return session;
}

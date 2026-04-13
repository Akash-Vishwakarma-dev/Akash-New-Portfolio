import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "./db";
import { env } from "../env";
import { UserRole } from "@prisma/client";

/**
 * NextAuth configuration
 */
export const authConfig = {
  adapter: PrismaAdapter(prisma) as NextAuthConfig["adapter"],
  providers: [
    // GitHub provider (always enabled)
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // Google provider (only if configured)
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role as UserRole;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Check if user is an admin
      const isAdmin = env.ADMIN_EMAILS.includes(user.email);

      // Update user role if they're an admin
      if (isAdmin) {
        try {
          // Use upsert to handle both new and existing users
          await prisma.user.upsert({
            where: { email: user.email },
            update: { role: UserRole.ADMIN },
            create: {
              email: user.email,
              name: user.name,
              image: user.image,
              role: UserRole.ADMIN,
            },
          });
        } catch (err) {
          // Don't block sign-in if role update fails
          // The user will be created with default role by the adapter
          if (process.env.NODE_ENV === "development") {
            console.error("Failed to update user role during signIn callback:", err);
          }
        }
      }

      return true;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

/**
 * Type augmentation for NextAuth session
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: UserRole;
  }
}

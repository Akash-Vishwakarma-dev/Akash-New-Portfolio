import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { successResponse, handleApiError } from "@/lib/api-utils";

/**
 * GET /api/theme
 * Get the current user's theme preference
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // If user is not authenticated, return default theme
    if (!session?.user) {
      return successResponse({ mode: "LIGHT" });
    }

    // Get user's theme preference
    const preference = await prisma.themePreference.findUnique({
      where: { userId: session.user.id },
    });

    return successResponse({
      mode: preference?.theme || "LIGHT",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

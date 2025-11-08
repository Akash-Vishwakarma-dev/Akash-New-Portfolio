import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { successResponse, handleApiError, parseRequestBody } from "@/lib/api-utils";
import { updateThemeSchema } from "@/lib/validations";

/**
 * PATCH /api/admin/theme
 * Update theme preference for the authenticated user (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    // Parse and validate request body
    const parseResult = await parseRequestBody(request, updateThemeSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const { mode } = parseResult.data;

    // Upsert theme preference
    const preference = await prisma.themePreference.upsert({
      where: { userId: session.user.id },
      update: { mode },
      create: {
        userId: session.user.id,
        mode,
      },
    });

    return successResponse({ mode: preference.mode });
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, handleApiError } from "@/lib/api-utils";
/**
 * GET /api/achievements
 * Get all achievements ordered by year (newest first)
 */
export async function GET(request: NextRequest) {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: [{ achievedAt: "desc" }, { createdAt: "desc" }],
    });

    return successResponse(achievements);
  } catch (error) {
    return handleApiError(error);
  }
}

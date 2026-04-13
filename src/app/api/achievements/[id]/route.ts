import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody } from "@/lib/api-utils";
import { z } from "zod";

const updateAchievementSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  category: z.string().min(1).max(100).optional(),
  achievedAt: z.string().datetime().optional(),
  description: z.string().min(1).optional(),
  url: z.string().url().optional().nullable(),
  iconUrl: z.string().url().optional().nullable(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

function isObjectId(value: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(value);
}

/**
 * GET /api/achievements/[id]
 * Get one achievement
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const achievement = await prisma.achievement.findUnique({
      where: isObjectId(id) ? { id } : { slug: id },
    });

    if (!achievement) {
      return errorResponse("Achievement not found", 404, "NOT_FOUND");
    }

    return successResponse(achievement);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/achievements/[id]
 * Update an achievement
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parseResult = await parseRequestBody(request, updateAchievementSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const existing = await prisma.achievement.findUnique({
      where: isObjectId(id) ? { id } : { slug: id },
      select: { id: true },
    });
    if (!existing) {
      return errorResponse("Achievement not found", 404, "NOT_FOUND");
    }

    const nextPublished =
      parseResult.data.published !== undefined
        ? !!parseResult.data.published
        : undefined;

    const updated = await prisma.achievement.update({
      where: { id: existing.id },
      data: {
        ...parseResult.data,
        ...(nextPublished !== undefined && { published: nextPublished }),
        ...(parseResult.data.achievedAt !== undefined && {
          achievedAt: new Date(parseResult.data.achievedAt),
        }),
      },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/achievements/[id]
 * Delete an achievement
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.achievement.findUnique({
      where: isObjectId(id) ? { id } : { slug: id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Achievement not found", 404, "NOT_FOUND");
    }

    await prisma.achievement.delete({
      where: { id: existing.id },
    });

    return successResponse({ message: "Achievement deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

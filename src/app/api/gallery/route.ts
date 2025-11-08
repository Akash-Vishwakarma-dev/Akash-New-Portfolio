import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, handleApiError, parseSearchParams } from "@/lib/api-utils";
import { z } from "zod";

const galleryQuerySchema = z.object({
  category: z.string().optional(),
  projectId: z.string().optional(),
});

/**
 * GET /api/gallery
 * Get all media items with optional filtering by category or project
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const parseResult = parseSearchParams(searchParams, galleryQuerySchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const { category, projectId } = parseResult.data;

    // Build where clause
    const where: {
      category?: string;
      projectId?: string;
    } = {};

    if (category) where.category = category;
    if (projectId) where.projectId = projectId;

    const mediaItems = await prisma.mediaItem.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: [{ takenAt: "desc" }, { createdAt: "desc" }],
    });

    return successResponse(mediaItems);
  } catch (error) {
    return handleApiError(error);
  }
}

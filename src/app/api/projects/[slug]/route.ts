import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { checkRateLimit, getClientIdentifier, publicRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/projects/[slug]
 * Get a single project by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(publicRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const { slug } = params;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        mediaItems: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            thumbnailUrl: true,
            altText: true,
            takenAt: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!project) {
      return errorResponse("Project not found", 404, "NOT_FOUND");
    }

    // Only return published projects for public API
    if (!project.published) {
      return errorResponse("Project not found", 404, "NOT_FOUND");
    }

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

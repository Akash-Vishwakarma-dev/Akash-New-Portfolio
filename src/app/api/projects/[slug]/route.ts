import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { checkRateLimit, getClientIdentifier, publicRateLimit } from "@/lib/rate-limit";

function isObjectId(value: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(value);
}

/**
 * GET /api/projects/[slug]
 * Get a single project by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(publicRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(rawSlug);

    const project = await prisma.project.findFirst({
      where: isObjectId(slug)
        ? {
            OR: [{ slug }, { id: slug }],
          }
        : { slug },
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
            url: true,
            type: true,
            caption: true,
            displayOrder: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    if (!project) {
      return errorResponse("Project not found", 404, "NOT_FOUND");
    }

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

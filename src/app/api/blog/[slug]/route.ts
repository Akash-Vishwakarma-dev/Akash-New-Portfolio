import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { checkRateLimit, getClientIdentifier, publicRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/blog/[slug]
 * Get a single blog post by slug and increment views
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

    const post = await prisma.blogPost.findUnique({
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
      },
    });

    if (!post) {
      return errorResponse("Blog post not found", 404, "NOT_FOUND");
    }

    // Only return published posts for public API
    if (!post.published) {
      return errorResponse("Blog post not found", 404, "NOT_FOUND");
    }

    // Increment view count asynchronously
    prisma.blogPost
      .update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((error) => console.error("Failed to increment views:", error));

    return successResponse(post);
  } catch (error) {
    return handleApiError(error);
  }
}

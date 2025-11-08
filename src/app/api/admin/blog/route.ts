import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody, calculateReadingTime } from "@/lib/api-utils";
import { createBlogPostSchema, updateBlogPostSchema } from "@/lib/validations";

/**
 * POST /api/admin/blog
 * Create a new blog post (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const parseResult = await parseRequestBody(request, createBlogPostSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const { tagIds, readingTime: providedReadingTime, publishedAt, ...postData } = parseResult.data;

    // Calculate reading time if not provided
    const readingTime = providedReadingTime || calculateReadingTime(postData.content);

    // Check if slug already exists
    const existing = await prisma.blogPost.findUnique({
      where: { slug: postData.slug },
    });

    if (existing) {
      return errorResponse("A blog post with this slug already exists", 409, "CONFLICT");
    }

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        readingTime,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        ...(tagIds && {
          tags: {
            connect: tagIds.map((id: string) => ({ id })),
          },
        }),
      },
      include: {
        tags: true,
      },
    });

    return successResponse(post);
  } catch (error) {
    return handleApiError(error);
  }
}

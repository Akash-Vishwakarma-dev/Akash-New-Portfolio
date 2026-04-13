import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody, calculateReadingTime } from "@/lib/api-utils";
import { updateBlogPostSchema } from "@/lib/validations";

/**
 * GET /api/admin/blog/[id]
 * Get a single blog post by id (admin only)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
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

    return successResponse(post);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/admin/blog/[id]
 * Update a blog post (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Parse and validate request body
    const parseResult = await parseRequestBody(request, updateBlogPostSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const {
      tagIds,
      publishedAt,
      content,
      readingTime: providedReadingTime,
      ...postData
    } = parseResult.data;

    // Get existing post
    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("Blog post not found", 404, "NOT_FOUND");
    }

    // Recalculate reading time if content changed
    let readTime = providedReadingTime;
    if (content && !readTime) {
      readTime = calculateReadingTime(content);
    }

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...postData,
        ...(content && { content }),
        ...(readTime !== undefined && { readTime }),
        ...(publishedAt !== undefined && { 
          publishedAt: publishedAt ? new Date(publishedAt) : null 
        }),
        ...(tagIds && {
          tags: {
            set: tagIds.map((id: string) => ({ id })),
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

/**
 * DELETE /api/admin/blog/[id]
 * Delete a blog post (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.blogPost.delete({
      where: { id },
    });

    return successResponse({ message: "Blog post deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

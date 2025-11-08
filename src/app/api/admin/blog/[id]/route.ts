import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody, calculateReadingTime } from "@/lib/api-utils";
import { updateBlogPostSchema } from "@/lib/validations";

/**
 * PATCH /api/admin/blog/[id]
 * Update a blog post (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Parse and validate request body
    const parseResult = await parseRequestBody(request, updateBlogPostSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const { tagIds, publishedAt, content, ...postData } = parseResult.data;

    // Get existing post
    const existing = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("Blog post not found", 404, "NOT_FOUND");
    }

    // Recalculate reading time if content changed
    let readingTime = postData.readingTime;
    if (content && !readingTime) {
      readingTime = calculateReadingTime(content);
    }

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...postData,
        ...(content && { content }),
        ...(readingTime && { readingTime }),
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.blogPost.delete({
      where: { id },
    });

    return successResponse({ message: "Blog post deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

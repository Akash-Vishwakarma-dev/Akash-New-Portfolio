import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, handleApiError, parseSearchParams, calculatePaginationMeta } from "@/lib/api-utils";
import { blogQuerySchema } from "@/lib/validations";

/**
 * GET /api/blog
 * Get all published blog posts with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const parseResult = parseSearchParams(searchParams, blogQuerySchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const { page, limit, published, featured, tag, search } = parseResult.data;

    // Build where clause
    const where: {
      published?: boolean;
      featured?: boolean;
      tags?: { some: { slug: string } };
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        excerpt?: { contains: string; mode: "insensitive" };
        content?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (published !== undefined) where.published = published;
    if (featured !== undefined) where.featured = featured;
    if (tag) where.tags = { some: { slug: tag } };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.blogPost.count({ where });

    // Get blog posts
    const posts = await prisma.blogPost.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImageUrl: true,
        published: true,
        featured: true,
        readTime: true,
        viewCount: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    });

    return successResponse(posts, calculatePaginationMeta(total, page, limit));
  } catch (error) {
    return handleApiError(error);
  }
}

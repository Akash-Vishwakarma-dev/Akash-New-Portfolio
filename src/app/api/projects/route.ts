import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseSearchParams, calculatePaginationMeta } from "@/lib/api-utils";
import { projectQuerySchema } from "@/lib/validations";

/**
 * GET /api/projects
 * Get all published projects with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const parseResult = parseSearchParams(searchParams, projectQuerySchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const { page, limit, published, featured, tag, search } = parseResult.data;
    const currentPage = page ?? 1;
    const pageSize = limit ?? 10;

    // Build where clause
    const where: {
      published?: boolean;
      featured?: boolean;
      tags?: { some: { slug: string } };
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        summary?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    if (published !== undefined) where.published = published;
    if (featured !== undefined) where.featured = featured;
    if (tag) where.tags = { some: { slug: tag } };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.project.count({ where });

    // Get projects
    const projects = await prisma.project.findMany({
      where,
      include: {
        tags: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        _count: {
          select: {
            mediaItems: true,
          },
        },
      },
      orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });

    return successResponse(projects, calculatePaginationMeta(total, currentPage, pageSize));
  } catch (error) {
    return handleApiError(error);
  }
}

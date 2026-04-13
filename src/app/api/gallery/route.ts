import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, handleApiError, parseRequestBody, parseSearchParams } from "@/lib/api-utils";
import { z } from "zod";

const galleryQuerySchema = z.object({
  category: z.string().optional(),
  type: z.string().optional(),
  projectId: z.string().optional(),
});

const createGalleryItemSchema = z.object({
  // Preferred fields
  url: z.string().url().optional(),
  caption: z.string().optional().nullable(),
  type: z.enum(["image", "video", "demo"]).optional(),
  projectId: z.string().optional().nullable(),
  displayOrder: z.number().int().min(0).optional(),

  // Backward-compatible aliases
  imageUrl: z.string().url().optional(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
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

    const { category, type, projectId } = parseResult.data;

    // Build where clause
    const where: {
      type?: string;
      projectId?: string;
    } = {};

    if (type) {
      where.type = type;
    } else if (category) {
      where.type = category;
    }

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
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    const normalized = mediaItems.map((item) => ({
      id: item.id,
      url: item.url,
      caption: item.caption,
      capturedAt: item.createdAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      type: item.type,
      projectId: item.projectId,
      displayOrder: item.displayOrder,
      project: item.project,
    }));

    return successResponse(normalized);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/gallery
 * Create a gallery item
 */
export async function POST(request: NextRequest) {
  try {
    const parsed = await parseRequestBody(request, createGalleryItemSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const payload = parsed.data;
    const url = payload.url || payload.imageUrl;

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: { message: "Image URL is required" } }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const normalizedType = (payload.type || payload.category || "image").toLowerCase();
    const type = normalizedType === "video" || normalizedType === "demo" ? normalizedType : "image";

    const created = await prisma.mediaItem.create({
      data: {
        url,
        caption: payload.caption ?? payload.description ?? null,
        type,
        projectId: payload.projectId || null,
        displayOrder: payload.displayOrder ?? 0,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return successResponse({
      id: created.id,
      url: created.url,
      caption: created.caption,
      capturedAt: created.createdAt,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      type: created.type,
      projectId: created.projectId,
      displayOrder: created.displayOrder,
      project: created.project,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

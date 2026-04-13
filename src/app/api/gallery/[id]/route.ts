import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { errorResponse, handleApiError, parseRequestBody, successResponse } from "@/lib/api-utils";
import { z } from "zod";

const updateGalleryItemSchema = z.object({
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
 * GET /api/gallery/[id]
 * Get one gallery item
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await prisma.mediaItem.findUnique({
      where: { id },
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

    if (!item) {
      return errorResponse("Gallery item not found", 404, "NOT_FOUND");
    }

    return successResponse({
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
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/gallery/[id]
 * Update one gallery item
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parsed = await parseRequestBody(request, updateGalleryItemSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const existing = await prisma.mediaItem.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Gallery item not found", 404, "NOT_FOUND");
    }

    const payload = parsed.data;

    const normalizedType = (payload.type || payload.category || "").toLowerCase();
    const mappedType =
      normalizedType === "video" || normalizedType === "demo" || normalizedType === "image"
        ? normalizedType
        : undefined;

    const updated = await prisma.mediaItem.update({
      where: { id },
      data: {
        ...(payload.url !== undefined && { url: payload.url }),
        ...(payload.imageUrl !== undefined && { url: payload.imageUrl }),
        ...(payload.caption !== undefined && { caption: payload.caption }),
        ...(payload.description !== undefined && { caption: payload.description }),
        ...(mappedType !== undefined && { type: mappedType }),
        ...(payload.projectId !== undefined && { projectId: payload.projectId || null }),
        ...(payload.displayOrder !== undefined && { displayOrder: payload.displayOrder }),
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
      id: updated.id,
      url: updated.url,
      caption: updated.caption,
      capturedAt: updated.createdAt,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      type: updated.type,
      projectId: updated.projectId,
      displayOrder: updated.displayOrder,
      project: updated.project,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/gallery/[id]
 * Delete one gallery item
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.mediaItem.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Gallery item not found", 404, "NOT_FOUND");
    }

    await prisma.mediaItem.delete({
      where: { id },
    });

    return successResponse({ message: "Gallery item deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

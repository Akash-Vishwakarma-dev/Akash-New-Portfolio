import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { r2Storage } from "@/lib/storage";
import { successResponse, errorResponse, handleApiError, parseRequestBody, generateSlug } from "@/lib/api-utils";
import { checkRateLimit, getClientIdentifier, adminRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const updateLottieSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  jsonUrl: z.string().min(1).optional(),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  published: z.boolean().optional(),
});

/**
 * GET /api/admin/lottie/[name]
 * Get one Lottie animation metadata (admin)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(adminRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const { name } = await params;
    const animation = await prisma.lottieAnimation.findUnique({ where: { name } });

    if (!animation) {
      return errorResponse("Animation not found", 404, "NOT_FOUND");
    }

    return successResponse(animation);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/admin/lottie/[name]
 * Update (or create) Lottie animation metadata (admin)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(adminRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const { name } = await params;
    const parsed = await parseRequestBody(request, updateLottieSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const payload = parsed.data;
    const nextName = payload.name?.trim() || name;
    const slug = generateSlug(nextName);
    const jsonUrl = payload.jsonUrl?.trim() || `/animations/${name}.json`;

    const existing = await prisma.lottieAnimation.findUnique({ where: { name } });

    if (!existing) {
      const created = await prisma.lottieAnimation.create({
        data: {
          name: nextName,
          slug,
          jsonUrl,
          category: payload.category ?? null,
          description: payload.description ?? null,
          published: payload.published ?? true,
        },
      });
      return successResponse(created);
    }

    const updated = await prisma.lottieAnimation.update({
      where: { id: existing.id },
      data: {
        name: nextName,
        slug,
        jsonUrl,
        ...(payload.category !== undefined && { category: payload.category }),
        ...(payload.description !== undefined && { description: payload.description }),
        ...(payload.published !== undefined && { published: !!payload.published }),
      },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/lottie/[name]
 * Delete a Lottie animation (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(adminRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const { name } = await params;

    // Get animation to retrieve the file key
    const animation = await prisma.lottieAnimation.findUnique({
      where: { name },
    });

    if (!animation) {
      return errorResponse("Animation not found", 404, "NOT_FOUND");
    }

    // Extract key from URL
    const url = new URL(animation.jsonUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    // Delete from R2
    try {
      await r2Storage.deleteFile(key);
    } catch (storageError) {
      console.error("Failed to delete file from R2:", storageError);
      // Continue to delete database record even if R2 deletion fails
    }

    // Delete from database
    await prisma.lottieAnimation.delete({
      where: { name },
    });

    return successResponse({ message: "Animation deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

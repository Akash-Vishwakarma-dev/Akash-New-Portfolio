import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { r2Storage } from "@/lib/storage";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { checkRateLimit, getClientIdentifier, adminRateLimit } from "@/lib/rate-limit";

/**
 * DELETE /api/admin/lottie/[name]
 * Delete a Lottie animation (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(adminRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const { name } = params;

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

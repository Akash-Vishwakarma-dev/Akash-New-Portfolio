import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody } from "@/lib/api-utils";
import { createLottieAnimationSchema } from "@/lib/validations";

/**
 * POST /api/admin/lottie
 * Upload/register a new Lottie animation (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const parseResult = await parseRequestBody(request, createLottieAnimationSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const animationData = parseResult.data;

    // Check if name already exists
    const existing = await prisma.lottieAnimation.findUnique({
      where: { name: animationData.name },
    });

    if (existing) {
      return errorResponse("An animation with this name already exists", 409, "CONFLICT");
    }

    // Create animation
    const animation = await prisma.lottieAnimation.create({
      data: animationData,
    });

    return successResponse(animation);
  } catch (error) {
    return handleApiError(error);
  }
}

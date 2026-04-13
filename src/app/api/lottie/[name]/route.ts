import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
import { checkRateLimit, getClientIdentifier, publicRateLimit } from "@/lib/rate-limit";

/**
 * GET /api/lottie/[name]
 * Get a Lottie animation JSON by name
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(publicRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const { name } = await params;

    const animation = await prisma.lottieAnimation.findUnique({
      where: { name },
    });

    if (!animation) {
      return errorResponse("Animation not found", 404, "NOT_FOUND");
    }

    // Fetch the actual JSON from R2
    try {
      const response = await fetch(animation.jsonUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch animation JSON");
      }

      const animationData = await response.json();

      return new Response(JSON.stringify(animationData), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (fetchError) {
      console.error("Failed to fetch animation JSON:", fetchError);
      return errorResponse("Failed to load animation", 500, "FETCH_ERROR");
    }
  } catch (error) {
    return handleApiError(error);
  }
}

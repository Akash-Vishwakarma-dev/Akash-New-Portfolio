import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError } from "@/lib/api-utils";
/**
 * GET /api/resume/latest
 * Get the current/latest resume
 */
export async function GET(request: NextRequest) {
  try {
    const resume = await prisma.resume.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!resume) {
      return errorResponse("No resume available", 404, "NOT_FOUND");
    }

    return successResponse(resume);
  } catch (error) {
    return handleApiError(error);
  }
}

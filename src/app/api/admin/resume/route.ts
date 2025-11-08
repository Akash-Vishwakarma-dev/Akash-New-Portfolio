import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, handleApiError, parseRequestBody } from "@/lib/api-utils";
import { createResumeSchema } from "@/lib/validations";

/**
 * POST /api/admin/resume
 * Upload and mark a new resume as current (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const parseResult = await parseRequestBody(request, createResumeSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const resumeData = parseResult.data;

    // If this resume should be current, mark all others as not current
    if (resumeData.isCurrent) {
      await prisma.resume.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
    }

    // Create new resume
    const resume = await prisma.resume.create({
      data: resumeData,
    });

    return successResponse(resume);
  } catch (error) {
    return handleApiError(error);
  }
}

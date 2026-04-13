import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, handleApiError, parseRequestBody } from "@/lib/api-utils";
import { createResumeSchema } from "@/lib/validations";
import { normalizeResumeUrl } from "@/lib/resume-url";

/**
 * GET /api/admin/resume
 * List all resumes (admin)
 */
export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    });

    return successResponse(resumes);
  } catch (error) {
    return handleApiError(error);
  }
}

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

    // If this resume should be active, mark all others as inactive.
    if (resumeData.isActive) {
      await prisma.resume.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    // Create new resume
    const resume = await prisma.resume.create({
      data: {
        version: resumeData.version,
        fileUrl: normalizeResumeUrl(resumeData.fileUrl),
        fileName: resumeData.fileName,
        description: resumeData.description || null,
        isActive: !!resumeData.isActive,
      },
    });

    return successResponse(resume);
  } catch (error) {
    return handleApiError(error);
  }
}

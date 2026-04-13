import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { errorResponse, handleApiError, parseRequestBody, successResponse } from "@/lib/api-utils";
import { updateResumeSchema } from "@/lib/validations";
import { normalizeResumeUrl } from "@/lib/resume-url";

function isObjectId(value: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(value);
}

/**
 * PATCH /api/admin/resume/[id]
 * Update resume metadata or active state
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isObjectId(id)) {
      return errorResponse("Invalid resume id", 400, "VALIDATION_ERROR");
    }

    const parseResult = await parseRequestBody(request, updateResumeSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const existing = await prisma.resume.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Resume not found", 404, "NOT_FOUND");
    }

    const payload = parseResult.data;

    if (payload.isActive) {
      await prisma.resume.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }

    const updated = await prisma.resume.update({
      where: { id },
      data: {
        ...(payload.version !== undefined && { version: payload.version }),
        ...(payload.fileUrl !== undefined && { fileUrl: normalizeResumeUrl(payload.fileUrl) }),
        ...(payload.fileName !== undefined && { fileName: payload.fileName }),
        ...(payload.description !== undefined && { description: payload.description || null }),
        ...(payload.isActive !== undefined && { isActive: !!payload.isActive }),
      },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/resume/[id]
 * Delete a resume
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isObjectId(id)) {
      return errorResponse("Invalid resume id", 400, "VALIDATION_ERROR");
    }

    const existing = await prisma.resume.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Resume not found", 404, "NOT_FOUND");
    }

    await prisma.resume.delete({ where: { id } });

    return successResponse({ message: "Resume deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

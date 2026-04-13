import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody } from "@/lib/api-utils";
import { z } from "zod";

const updateCertificationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  issuer: z.string().min(1).max(120).optional(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url().optional().nullable(),
  issuedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  description: z.string().optional().nullable(),
  skills: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

/**
 * GET /api/certifications/[id]
 * Get one certification
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const certification = await prisma.certification.findUnique({
      where: { id },
    });

    if (!certification) {
      return errorResponse("Certification not found", 404, "NOT_FOUND");
    }

    return successResponse(certification);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/certifications/[id]
 * Update a certification
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parseResult = await parseRequestBody(request, updateCertificationSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const existing = await prisma.certification.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Certification not found", 404, "NOT_FOUND");
    }

    const updated = await prisma.certification.update({
      where: { id },
      data: {
        ...parseResult.data,
        ...(parseResult.data.issuedAt !== undefined && {
          issuedAt: new Date(parseResult.data.issuedAt),
        }),
        ...(parseResult.data.expiresAt !== undefined && {
          expiresAt: parseResult.data.expiresAt ? new Date(parseResult.data.expiresAt) : null,
        }),
      },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/certifications/[id]
 * Delete a certification
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.certification.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Certification not found", 404, "NOT_FOUND");
    }

    await prisma.certification.delete({
      where: { id },
    });

    return successResponse({ message: "Certification deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

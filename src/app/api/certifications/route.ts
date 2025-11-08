import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, handleApiError } from "@/lib/api-utils";
/**
 * GET /api/certifications
 * Get all certifications ordered by issue date (newest first)
 */
export async function GET(request: NextRequest) {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: [{ issuedAt: "desc" }, { createdAt: "desc" }],
    });

    return successResponse(certifications);
  } catch (error) {
    return handleApiError(error);
  }
}

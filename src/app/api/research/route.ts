import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, handleApiError } from "@/lib/api-utils";
/**
 * GET /api/research
 * Get all research papers ordered by year (newest first)
 */
export async function GET(request: NextRequest) {
  try {
    const papers = await prisma.research.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    return successResponse(papers);
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody, generateSlug } from "@/lib/api-utils";
import { z } from "zod";

const createResearchSchema = z.object({
  title: z.string().min(1).max(300),
  venue: z.string().min(1).max(200),
  year: z.number().int().min(1900).max(2100),
  abstract: z.string().min(1),
  doi: z.string().optional().nullable(),
  pdfUrl: z.string().url().optional().nullable(),
  authors: z.array(z.string()).min(1),
  keywords: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});
/**
 * GET /api/research
 * Get all research papers ordered by year (newest first)
 */
export async function GET(request: NextRequest) {
  try {
    const papers = await prisma.research.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    const normalized = papers.map((paper) => ({
      id: paper.id,
      title: paper.title,
      venue: paper.publishedIn || "",
      year: paper.publishedAt ? new Date(paper.publishedAt).getUTCFullYear() : new Date(paper.createdAt).getUTCFullYear(),
      abstract: paper.description,
      pdfUrl: paper.paperUrl || undefined,
      doi: undefined,
      authors: paper.authors,
      keywords: [],
      published: paper.published,
      createdAt: paper.createdAt,
    }));

    return successResponse(normalized);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/research
 * Create a research paper
 */
export async function POST(request: NextRequest) {
  try {
    const parsed = await parseRequestBody(request, createResearchSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { title, venue, year, abstract, doi, pdfUrl, authors, keywords, published } = parsed.data;
    const baseSlug = generateSlug(title);

    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.research.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const publishedAt = new Date(Date.UTC(year, 0, 1));

    const created = await prisma.research.create({
      data: {
        slug,
        title,
        summary: abstract.slice(0, 240),
        description: abstract,
        authors,
        paperUrl: pdfUrl || undefined,
        publishedIn: venue,
        publishedAt,
        published: !!published,
        featured: false,
      },
    });

    return successResponse(created);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return errorResponse("A research paper with this title already exists", 409, "CONFLICT");
    }
    return handleApiError(error);
  }
}

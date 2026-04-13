import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody } from "@/lib/api-utils";
import { z } from "zod";

const updateResearchSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  venue: z.string().min(1).max(200).optional(),
  abstract: z.string().min(1).optional(),
  pdfUrl: z.string().url().optional().nullable(),
  authors: z.array(z.string().min(1)).min(1).optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().datetime().optional().nullable(),
});

/**
 * GET /api/research/[id]
 * Get one research paper
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const paper = await prisma.research.findUnique({
      where: { id },
    });

    if (!paper) {
      return errorResponse("Research paper not found", 404, "NOT_FOUND");
    }

    const normalized = {
      id: paper.id,
      title: paper.title,
      slug: paper.slug,
      venue: paper.publishedIn || "",
      year: paper.publishedAt
        ? new Date(paper.publishedAt).getUTCFullYear()
        : new Date(paper.createdAt).getUTCFullYear(),
      abstract: paper.description,
      pdfUrl: paper.paperUrl || "",
      doi: undefined,
      authors: paper.authors,
      keywords: [],
      published: paper.published,
      featured: paper.featured,
      publishedAt: paper.publishedAt,
      createdAt: paper.createdAt,
    };

    return successResponse(normalized);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/research/[id]
 * Update a research paper
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const parseResult = await parseRequestBody(request, updateResearchSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const { venue, abstract, pdfUrl, publishedAt, ...rest } = parseResult.data;

    const existing = await prisma.research.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Research paper not found", 404, "NOT_FOUND");
    }

    if (rest.slug && rest.slug !== existing.slug) {
      const slugExists = await prisma.research.findUnique({
        where: { slug: rest.slug },
      });
      if (slugExists) {
        return errorResponse("A research paper with this slug already exists", 409, "CONFLICT");
      }
    }

    const updated = await prisma.research.update({
      where: { id },
      data: {
        ...rest,
        ...(abstract !== undefined && {
          description: abstract,
          summary: abstract.slice(0, 240),
        }),
        ...(venue !== undefined && { publishedIn: venue }),
        ...(pdfUrl !== undefined && { paperUrl: pdfUrl || null }),
        ...(publishedAt !== undefined && {
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        }),
      },
    });

    return successResponse(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/research/[id]
 * Delete a research paper
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.research.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Research paper not found", 404, "NOT_FOUND");
    }

    await prisma.research.update({
      where: { id },
      data: {
        tags: {
          set: [],
        },
      },
    });

    await prisma.research.delete({
      where: { id },
    });

    return successResponse({ message: "Research paper deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

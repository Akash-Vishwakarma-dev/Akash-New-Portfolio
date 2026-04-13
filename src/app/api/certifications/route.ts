import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody, generateSlug } from "@/lib/api-utils";
import { z } from "zod";

const createCertificationSchema = z.object({
  title: z.string().min(1).max(200),
  issuer: z.string().min(1).max(120),
  issuedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url().optional().nullable(),
  skills: z.array(z.string()).optional(),
  description: z.string().optional().nullable(),
  published: z.boolean().optional(),
});
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

/**
 * POST /api/certifications
 * Create a certification
 */
export async function POST(request: NextRequest) {
  try {
    const parsed = await parseRequestBody(request, createCertificationSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const {
      title,
      issuer,
      issuedAt,
      expiresAt,
      credentialId,
      credentialUrl,
      skills,
      description,
      published,
    } = parsed.data;

    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.certification.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const created = await prisma.certification.create({
      data: {
        slug,
        title,
        issuer,
        issuedAt: new Date(issuedAt),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        credentialId: credentialId || null,
        credentialUrl: credentialUrl || null,
        skills: skills ?? [],
        description: description || null,
        published: !!published,
      },
    });

    return successResponse(created);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return errorResponse("A certification with this title already exists", 409, "CONFLICT");
    }
    return handleApiError(error);
  }
}

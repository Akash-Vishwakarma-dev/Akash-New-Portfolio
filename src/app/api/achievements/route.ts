import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody, generateSlug } from "@/lib/api-utils";
import { z } from "zod";

const createAchievementSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  achievedAt: z.string().datetime(),
  description: z.string().min(1),
  url: z.string().url().optional().nullable(),
  iconUrl: z.string().url().optional().nullable(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});
/**
 * GET /api/achievements
 * Get all achievements ordered by year (newest first)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedParam = searchParams.get("published");
    const featuredParam = searchParams.get("featured");

    const where: {
      published?: boolean;
      featured?: boolean;
    } = {};

    if (publishedParam !== null) {
      where.published = publishedParam === "true";
    }

    if (featuredParam !== null) {
      where.featured = featuredParam === "true";
    }

    const achievements = await prisma.achievement.findMany({
      where,
      orderBy: [{ achievedAt: "desc" }, { createdAt: "desc" }],
    });

    return successResponse(achievements);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/achievements
 * Create an achievement
 */
export async function POST(request: NextRequest) {
  try {
    const parsed = await parseRequestBody(request, createAchievementSchema);
    if (!parsed.success) {
      return parsed.response;
    }

    const { title, category, achievedAt, description, url, iconUrl, published, featured } = parsed.data;

    const baseSlug = generateSlug(title);
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.achievement.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const created = await prisma.achievement.create({
      data: {
        slug,
        title,
        category,
        achievedAt: new Date(achievedAt),
        description,
        url: url || null,
        iconUrl: iconUrl || null,
        published: !!published,
        featured: !!featured,
      },
    });

    return successResponse(created);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return errorResponse("An achievement with this title already exists", 409, "CONFLICT");
    }
    return handleApiError(error);
  }
}

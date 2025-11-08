import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody, calculateReadingTime } from "@/lib/api-utils";
import { createProjectSchema, updateProjectSchema } from "@/lib/validations";

/**
 * POST /api/admin/projects
 * Create a new project (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const parseResult = await parseRequestBody(request, createProjectSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const { tagIds, ...projectData } = parseResult.data;

    // Check if slug already exists
    const existing = await prisma.project.findUnique({
      where: { slug: projectData.slug },
    });

    if (existing) {
      return errorResponse("A project with this slug already exists", 409, "CONFLICT");
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        ...projectData,
        ...(tagIds && {
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        tags: true,
      },
    });

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

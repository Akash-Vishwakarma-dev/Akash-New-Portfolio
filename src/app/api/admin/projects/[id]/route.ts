import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { successResponse, errorResponse, handleApiError, parseRequestBody } from "@/lib/api-utils";
import { checkRateLimit, getClientIdentifier, adminRateLimit } from "@/lib/rate-limit";
import { updateProjectSchema } from "@/lib/validations";

/**
 * PATCH /api/admin/projects/[id]
 * Update a project (admin only)
 */
async function updateProjectHandler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(adminRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const { id } = await params;

    // Parse and validate request body
    const parseResult = await parseRequestBody(request, updateProjectSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const { tagIds, ...projectData } = parseResult.data;

    // Check if project exists
    const existing = await prisma.project.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("Project not found", 404, "NOT_FOUND");
    }

    // Check if new slug conflicts
    if (projectData.slug && projectData.slug !== existing.slug) {
      const slugExists = await prisma.project.findUnique({
        where: { slug: projectData.slug },
      });

      if (slugExists) {
        return errorResponse("A project with this slug already exists", 409, "CONFLICT");
      }
    }

    // Update project
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        ...(tagIds && {
          tags: {
            set: tagIds.map((id) => ({ id })),
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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return updateProjectHandler(request, context);
}

/**
 * PUT /api/admin/projects/[id]
 * Backward-compatible update handler
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return updateProjectHandler(request, context);
}

/**
 * DELETE /api/admin/projects/[id]
 * Delete a project (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = await checkRateLimit(adminRateLimit, identifier);
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    const { id } = await params;

    // Check if project exists before deleting
    const existing = await prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return errorResponse("Project not found", 404, "NOT_FOUND");
    }

    // Clear tag relations before delete to avoid relation constraint failures.
    await prisma.project.update({
      where: { id },
      data: {
        tags: {
          set: [],
        },
      },
    });

    // Delete project
    await prisma.project.delete({
      where: { id },
    });

    return successResponse({ message: "Project deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

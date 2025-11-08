import { NextRequest } from "next/server";
import { r2Storage, validateFileUpload } from "@/lib/storage";
import { successResponse, errorResponse, handleApiError, parseRequestBody } from "@/lib/api-utils";
import { uploadRequestSchema } from "@/lib/validations";

/**
 * POST /api/admin/upload-url
 * Generate a presigned URL for file upload to R2 (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const parseResult = await parseRequestBody(request, uploadRequestSchema);
    if (!parseResult.success) {
      return parseResult.response;
    }

    const { fileName, contentType, fileSize, folder } = parseResult.data;

    // Determine file category based on content type
    let category: "images" | "documents" | "animations";
    if (contentType.startsWith("image/")) {
      category = "images";
    } else if (contentType === "application/pdf") {
      category = "documents";
    } else if (contentType === "application/json") {
      category = "animations";
    } else {
      return errorResponse("Unsupported file type", 400, "INVALID_FILE_TYPE");
    }

    // Validate file
    const validation = validateFileUpload(contentType, fileSize, category);
    if (!validation.valid) {
      return errorResponse(validation.error || "Invalid file", 400, "VALIDATION_ERROR");
    }

    // Generate unique key
    const key = r2Storage.generateUniqueKey(folder, fileName);

    // Generate presigned upload URL
    const { uploadUrl, publicUrl } = await r2Storage.getUploadUrl(key, contentType);

    return successResponse({
      uploadUrl,
      publicUrl,
      key,
      expiresIn: 3600, // 1 hour
    });
  } catch (error) {
    return handleApiError(error);
  }
}

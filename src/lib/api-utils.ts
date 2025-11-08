import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Create a success response
 */
export function successResponse<T>(data: T, meta?: ApiResponse["meta"]): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status: 200 }
  );
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: unknown
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        ...(code && { code }),
        ...(details && { details }),
      },
    },
    { status }
  );
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(error: ZodError): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.errors,
      },
    },
    { status: 400 }
  );
}

/**
 * Parse and validate request body
 */
export async function parseRequestBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, response: validationErrorResponse(error) };
    }
    return {
      success: false,
      response: errorResponse("Invalid request body", 400),
    };
  }
}

/**
 * Parse and validate URL search params
 */
export function parseSearchParams<T>(
  searchParams: URLSearchParams,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; response: NextResponse } {
  try {
    const params = Object.fromEntries(searchParams.entries());
    const validatedData = schema.parse(params);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, response: validationErrorResponse(error) };
    }
    return {
      success: false,
      response: errorResponse("Invalid query parameters", 400),
    };
  }
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error("API Error:", error);

  if (error instanceof Error) {
    // Authentication/Authorization errors
    if (error.message === "Unauthorized") {
      return errorResponse("Authentication required", 401, "UNAUTHORIZED");
    }
    if (error.message.includes("Forbidden")) {
      return errorResponse("Insufficient permissions", 403, "FORBIDDEN");
    }

    // Prisma errors
    if (error.message.includes("Unique constraint")) {
      return errorResponse("Resource already exists", 409, "CONFLICT");
    }
    if (error.message.includes("Record to update not found")) {
      return errorResponse("Resource not found", 404, "NOT_FOUND");
    }

    return errorResponse(error.message, 500, "INTERNAL_ERROR");
  }

  return errorResponse("An unexpected error occurred", 500, "INTERNAL_ERROR");
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number
): ApiResponse["meta"] {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * API Type Definitions
 * Centralized type definitions for API responses and requests
 */

// Base API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Error Response
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

// Axios Error with response
export interface AxiosErrorWithResponse extends Error {
  response?: {
    data?: {
      error?: string | ApiError;
      message?: string;
    };
    status?: number;
  };
}

// Helper to extract error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const axiosError = error as AxiosErrorWithResponse;
    if (axiosError.response?.data?.error) {
      const apiError = axiosError.response.data.error;
      return typeof apiError === 'string' ? apiError : apiError.message || 'An error occurred';
    }
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    return error.message;
  }
  return 'An unexpected error occurred';
}

// Project types
export interface ProjectData {
  slug: string;
  title: string;
  summary: string;
  description: string;
  stack: string[];
  repoUrl?: string;
  liveUrl?: string;
  paperUrl?: string;
  coverImageUrl?: string;
  metrics?: Record<string, number>;
  published: boolean;
  featured: boolean;
  displayOrder?: number;
  tagIds?: string[];
}

// Blog Post types
export interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  readTime?: number;
  published: boolean;
  featured: boolean;
  publishedAt?: string;
  tagIds?: string[];
}

// Mutation data types
export type CreateProjectData = Omit<ProjectData, 'slug'> & { slug?: string };
export type UpdateProjectData = Partial<ProjectData>;
export type CreateBlogPostData = Omit<BlogPostData, 'slug'> & { slug?: string };
export type UpdateBlogPostData = Partial<BlogPostData>;

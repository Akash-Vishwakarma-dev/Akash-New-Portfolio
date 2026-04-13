import { z } from "zod";

// ============================================
// PROJECT SCHEMAS
// ============================================

export const createProjectSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(500),
  description: z.string().min(1),
  stack: z.array(z.string()).min(1),
  repoUrl: z.string().url().optional().nullable(),
  liveUrl: z.string().url().optional().nullable(),
  paperUrl: z.string().url().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  metrics: z
    .object({
      stars: z.number().optional(),
      forks: z.number().optional(),
      views: z.number().optional(),
    })
    .optional()
    .nullable(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  tagIds: z.array(z.string()).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

// ============================================
// BLOG POST SCHEMAS
// ============================================

export const createBlogPostSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1), // MDX content
  coverImageUrl: z.string().url().optional().nullable(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  readingTime: z.number().int().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

// ============================================
// CERTIFICATION SCHEMAS
// ============================================

export const createCertificationSchema = z.object({
  title: z.string().min(1).max(200),
  issuer: z.string().min(1).max(100),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().url().optional().nullable(),
  issuedOn: z.string().datetime(),
  expiresOn: z.string().datetime().optional().nullable(),
  summary: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  skills: z.array(z.string()).default([]),
});

export const updateCertificationSchema = createCertificationSchema.partial();

// ============================================
// ACHIEVEMENT SCHEMAS
// ============================================

export const createAchievementSchema = z.object({
  title: z.string().min(1).max(200),
  organization: z.string().min(1).max(100),
  year: z.number().int().min(2000).max(2100),
  summary: z.string().min(1),
  link: z.string().url().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  type: z.string().optional().nullable(),
});

export const updateAchievementSchema = createAchievementSchema.partial();

// ============================================
// RESEARCH SCHEMAS
// ============================================

export const createResearchSchema = z.object({
  title: z.string().min(1).max(300),
  venue: z.string().min(1).max(200),
  year: z.number().int().min(2000).max(2100),
  abstract: z.string().min(1),
  pdfUrl: z.string().url().optional().nullable(),
  doi: z.string().optional().nullable(),
  bibtex: z.string().optional().nullable(),
  authors: z.array(z.string()).min(1),
  keywords: z.array(z.string()).default([]),
  citedBy: z.number().int().default(0),
});

export const updateResearchSchema = createResearchSchema.partial();

// ============================================
// MEDIA ITEM SCHEMAS
// ============================================

export const createMediaItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  takenAt: z.string().datetime().optional().nullable(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().nullable(),
  altText: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
});

export const updateMediaItemSchema = createMediaItemSchema.partial();

// ============================================
// RESUME SCHEMAS
// ============================================

export const createResumeSchema = z.object({
  fileUrl: z.string().url(),
  version: z.string().min(1).max(50),
  fileName: z.string().min(1),
  isActive: z.boolean().default(false),
  description: z.string().max(500).optional().nullable(),
});

export const updateResumeSchema = createResumeSchema.partial();

// ============================================
// TAG SCHEMAS
// ============================================

export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().nullable(),
});

export const updateTagSchema = createTagSchema.partial();

// ============================================
// THEME PREFERENCE SCHEMAS
// ============================================

export const updateThemeSchema = z.object({
  mode: z.enum(["LIGHT", "DARK"]),
});

// ============================================
// LOTTIE ANIMATION SCHEMAS
// ============================================

export const createLottieAnimationSchema = z.object({
  name: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  jsonUrl: z.string().url(),
  category: z.string().optional().nullable(),
  fileSize: z.number().int().positive(),
});

export const updateLottieAnimationSchema = createLottieAnimationSchema.partial();

// ============================================
// FILE UPLOAD SCHEMAS
// ============================================

export const uploadRequestSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  fileSize: z.number().int().positive(),
  folder: z.enum(["media", "resume", "animations", "projects", "blog", "certifications"]),
});

// ============================================
// CONTACT FORM SCHEMAS
// ============================================

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  subject: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().min(1).max(2000),
});

export const updateContactSubmissionSchema = z.object({
  read: z.boolean().optional(),
  replied: z.boolean().optional(),
});

// ============================================
// QUERY PARAMETER SCHEMAS
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const projectQuerySchema = paginationSchema.extend({
  published: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
});

export const blogQuerySchema = paginationSchema.extend({
  published: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
});

// ============================================
// RESPONSE TYPES (for type inference)
// ============================================

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type CreateCertificationInput = z.infer<typeof createCertificationSchema>;
export type UpdateCertificationInput = z.infer<typeof updateCertificationSchema>;
export type CreateAchievementInput = z.infer<typeof createAchievementSchema>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementSchema>;
export type CreateResearchInput = z.infer<typeof createResearchSchema>;
export type UpdateResearchInput = z.infer<typeof updateResearchSchema>;
export type CreateMediaItemInput = z.infer<typeof createMediaItemSchema>;
export type UpdateMediaItemInput = z.infer<typeof updateMediaItemSchema>;
export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;
export type CreateLottieAnimationInput = z.infer<typeof createLottieAnimationSchema>;
export type UpdateLottieAnimationInput = z.infer<typeof updateLottieAnimationSchema>;
export type UploadRequestInput = z.infer<typeof uploadRequestSchema>;
export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type ProjectQuery = z.infer<typeof projectQuerySchema>;
export type BlogQuery = z.infer<typeof blogQuerySchema>;

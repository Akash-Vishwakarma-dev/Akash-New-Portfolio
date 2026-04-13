import axios, { AxiosError } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request deduplication cache
const pendingRequests = new Map<string, Promise<unknown>>();

// Create cache key from request
function getCacheKey(url: string, params?: Record<string, unknown>): string {
  return `${url}${params ? JSON.stringify(params) : ""}`;
}

// Deduplicate identical requests
apiClient.interceptors.request.use((config) => {
  const cacheKey = getCacheKey(config.url || "", config.params);
  
  if (config.method === "get" && pendingRequests.has(cacheKey)) {
    // Return existing pending request
    return Promise.reject({ __isDuplicate: true, promise: pendingRequests.get(cacheKey) });
  }
  
  return config;
});

// Clean up pending requests
apiClient.interceptors.response.use(
  (response) => {
    const cacheKey = getCacheKey(response.config.url || "", response.config.params);
    pendingRequests.delete(cacheKey);
    return response;
  },
  (error) => {
    if (error.__isDuplicate) {
      return error.promise;
    }
    const cacheKey = getCacheKey(error.config?.url || "", error.config?.params);
    pendingRequests.delete(cacheKey);
    return Promise.reject(error);
  }
);

// Types for API responses
export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage?: string;
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  published: boolean;
  featured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

type ProjectApiPayload = Omit<Project, "coverImage" | "githubUrl"> & {
  coverImage?: string;
  coverImageUrl?: string | null;
  githubUrl?: string;
  repoUrl?: string | null;
};

function normalizeProject(project: ProjectApiPayload): Project {
  return {
    ...project,
    coverImage: project.coverImage ?? project.coverImageUrl ?? undefined,
    githubUrl: project.githubUrl ?? project.repoUrl ?? undefined,
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  featured: boolean;
  viewCount: number;
  readTime: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

type BlogPostApiPayload = Omit<BlogPost, "coverImage"> & {
  coverImage?: string;
  coverImageUrl?: string | null;
};

function normalizeBlogPost(post: BlogPostApiPayload): BlogPost {
  return {
    ...post,
    coverImage: post.coverImage ?? post.coverImageUrl ?? undefined,
  };
}

export interface Research {
  id: string;
  title: string;
  venue: string;
  year: number;
  abstract: string;
  pdfUrl?: string;
  doi?: string;
  authors: string[];
  keywords: string[];
  published: boolean;
  createdAt: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  credentialId?: string;
  credentialUrl?: string;
  issuedAt: string;
  expiresAt?: string;
  description?: string;
  skills: string[];
  badgeUrl?: string;
  published: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  achievedAt: string;
  iconUrl?: string;
  url?: string;
  published: boolean;
  featured: boolean;
}

export interface MediaItem {
  id: string;
  url: string;
  caption?: string;
  capturedAt?: string;
  projectId?: string;
  type?: "image" | "video" | "demo";
  displayOrder?: number;
  createdAt: string;
}

export interface Resume {
  id: string;
  version: string;
  fileUrl: string;
  fileName: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// API Functions

// Projects
export async function getProjects(params?: {
  published?: boolean;
  featured?: boolean;
  tag?: string;
}): Promise<Project[]> {
  const { data } = await apiClient.get("/api/projects", { params });
  const projects = (data.data || data) as ProjectApiPayload[];
  return projects.map(normalizeProject);
}

export async function getProject(slug: string): Promise<Project> {
  const { data } = await apiClient.get(`/api/projects/${slug}`);
  const project = (data.data || data) as ProjectApiPayload;
  return normalizeProject(project);
}

export async function incrementProjectViews(slug: string): Promise<void> {
  await apiClient.post(`/api/projects/${slug}/view`);
}

// Blog
export async function getBlogPosts(params?: {
  published?: boolean;
  featured?: boolean;
  tag?: string;
  search?: string;
}): Promise<BlogPost[]> {
  const { data } = await apiClient.get("/api/blog", { params });
  const posts = (data.data || data) as BlogPostApiPayload[];
  return posts.map(normalizeBlogPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const { data } = await apiClient.get(`/api/blog/${slug}`);
  const post = (data.data || data) as BlogPostApiPayload;
  return normalizeBlogPost(post);
}

export async function incrementBlogViews(slug: string): Promise<void> {
  await apiClient.post(`/api/blog/${slug}/view`);
}

// Research
export async function getResearch(): Promise<Research[]> {
  const { data } = await apiClient.get("/api/research");
  return data.data || data;
}

// Certifications
export async function getCertifications(): Promise<Certification[]> {
  const { data } = await apiClient.get("/api/certifications");
  return data.data || data;
}

// Achievements
export async function getAchievements(params?: {
  published?: boolean;
  featured?: boolean;
}): Promise<Achievement[]> {
  const { data } = await apiClient.get("/api/achievements", { params });
  return data.data || data;
}

// Gallery
export async function getGallery(projectId?: string): Promise<MediaItem[]> {
  const { data } = await apiClient.get("/api/gallery", {
    params: projectId ? { projectId } : undefined,
  });
  return data.data || data;
}

// Resume
export async function getLatestResume(): Promise<Resume> {
  const { data } = await apiClient.get("/api/resume/latest");
  return data.data || data;
}

// Contact
export async function submitContactForm(
  formData: ContactFormData
): Promise<{ success: boolean; message: string }> {
  const { data } = await apiClient.post("/api/contact", formData);
  return data.data || data;
}

// Tags
export async function getTags(): Promise<Tag[]> {
  const { data } = await apiClient.get("/api/tags");
  return data.data || data;
}

// Error handler utility
export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "An error occurred"
    );
  }
  return "An unexpected error occurred";
}

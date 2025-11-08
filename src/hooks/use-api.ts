"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";
import { getErrorMessage } from "@/types/api";
import type { CreateProjectData, UpdateProjectData, CreateBlogPostData, UpdateBlogPostData } from "@/types/api";

// Projects API
export function useProjects(filters?: { published?: boolean; featured?: boolean }) {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.published !== undefined) params.set("published", String(filters.published));
      if (filters?.featured !== undefined) params.set("featured", String(filters.featured));
      
      const { data } = await apiClient.get(`/api/projects?${params}`);
      return data;
    },
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/projects/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: CreateProjectData) => {
      const { data } = await apiClient.post("/api/admin/projects", projectData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectData }) => {
      const response = await apiClient.put(`/api/admin/projects/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/admin/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Blog Posts API
export function useBlogPosts(filters?: { published?: boolean; featured?: boolean }) {
  return useQuery({
    queryKey: ["blogPosts", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.published !== undefined) params.set("published", String(filters.published));
      if (filters?.featured !== undefined) params.set("featured", String(filters.featured));
      
      const { data } = await apiClient.get(`/api/blog?${params}`);
      return data;
    },
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (blogData: CreateBlogPostData) => {
      const { data } = await apiClient.post("/api/admin/blog", blogData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      toast.success("Blog post created successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBlogPostData }) => {
      const response = await apiClient.put(`/api/admin/blog/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      toast.success("Blog post updated successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/admin/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      toast.success("Blog post deleted successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// Tags API
export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/tags");
      return data;
    },
  });
}

// Stats API
export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/admin/stats");
      return data;
    },
  });
}

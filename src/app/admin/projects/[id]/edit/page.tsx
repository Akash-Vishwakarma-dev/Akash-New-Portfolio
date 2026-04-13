"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProjects, useUpdateProject } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieIcon } from "@/components/LottieIcon";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { slugify } from "@/lib/utils";

const editProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().min(1, "Description is required"),
  stack: z.string().min(1, "Stack is required"),
  repoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  paperUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  displayOrder: z.string().optional(),
  published: z.boolean(),
  featured: z.boolean(),
});

type EditProjectFormData = z.infer<typeof editProjectSchema>;

type AdminProject = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  stack?: string[];
  repoUrl?: string | null;
  liveUrl?: string | null;
  paperUrl?: string | null;
  coverImageUrl?: string | null;
  displayOrder?: number;
  published?: boolean;
  featured?: boolean;
};

function getSingleParam(value: string | string[] | undefined): string {
  if (!value) return "";
  return Array.isArray(value) ? value[0] || "" : value;
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = getSingleParam(params.id);

  const { data: projectsResponse, isLoading } = useProjects();
  const updateProject = useUpdateProject();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditProjectFormData>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      description: "",
      stack: "",
      repoUrl: "",
      liveUrl: "",
      paperUrl: "",
      coverImageUrl: "",
      displayOrder: "0",
      published: false,
      featured: false,
    },
  });

  const projects: AdminProject[] = projectsResponse?.data ?? [];
  const project = projects.find((item) => item.id === projectId);

  useEffect(() => {
    if (!project) return;

    reset({
      title: project.title || "",
      slug: project.slug || "",
      summary: project.summary || "",
      description: project.description || "",
      stack: project.stack?.join(", ") || "",
      repoUrl: project.repoUrl || "",
      liveUrl: project.liveUrl || "",
      paperUrl: project.paperUrl || "",
      coverImageUrl: project.coverImageUrl || "",
      displayOrder: String(project.displayOrder ?? 0),
      published: !!project.published,
      featured: !!project.featured,
    });
  }, [project, reset]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    if (!watch("slug")) {
      setValue("slug", slugify(newTitle));
    }
  };

  const onSubmit = async (data: EditProjectFormData) => {
    const payload = {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      description: data.description,
      stack: data.stack.split(",").map((s) => s.trim()).filter(Boolean),
      repoUrl: data.repoUrl || undefined,
      liveUrl: data.liveUrl || undefined,
      paperUrl: data.paperUrl || undefined,
      coverImageUrl: data.coverImageUrl || undefined,
      displayOrder: data.displayOrder ? Number(data.displayOrder) : 0,
      published: data.published,
      featured: data.featured,
    } as any;

    await updateProject.mutateAsync(
      {
        id: projectId,
        data: payload,
      },
      {
        onSuccess: () => {
          router.push("/admin/projects");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LottieLoader size={100} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
            <p className="text-muted-foreground">Project not found</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            The project could not be loaded. It may have been deleted.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
          <p className="text-muted-foreground">Update project details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input {...register("title")} onChange={handleTitleChange} />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug *</label>
                <Input {...register("slug")} />
                {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Summary *</label>
              <Input {...register("summary")} />
              {errors.summary && (
                <p className="text-sm text-destructive">{errors.summary.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea {...register("description")} rows={10} />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tech Stack (comma-separated) *</label>
              <Input {...register("stack")} />
              {errors.stack && <p className="text-sm text-destructive">{errors.stack.message}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Repository URL</label>
                <Input {...register("repoUrl")} placeholder="https://github.com/..." />
                {errors.repoUrl && (
                  <p className="text-sm text-destructive">{errors.repoUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Live Demo URL</label>
                <Input {...register("liveUrl")} placeholder="https://example.com" />
                {errors.liveUrl && (
                  <p className="text-sm text-destructive">{errors.liveUrl.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Paper URL</label>
                <Input {...register("paperUrl")} placeholder="https://arxiv.org/..." />
                {errors.paperUrl && (
                  <p className="text-sm text-destructive">{errors.paperUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image URL</label>
                <Input {...register("coverImageUrl")} placeholder="https://..." />
                {errors.coverImageUrl && (
                  <p className="text-sm text-destructive">{errors.coverImageUrl.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Display Order</label>
              <Input {...register("displayOrder")} type="number" min="0" />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("published")} className="h-4 w-4" />
                <span className="text-sm font-medium">Published</span>
              </label>

              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("featured")} className="h-4 w-4" />
                <span className="text-sm font-medium">Featured</span>
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={updateProject.isPending}>
                {updateProject.isPending ? (
                  <>
                    <LottieIcon name="loader" size={20} className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Link href="/admin/projects">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

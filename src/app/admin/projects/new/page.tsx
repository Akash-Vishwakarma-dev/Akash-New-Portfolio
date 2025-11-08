"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProject } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { LottieIcon } from "@/components/LottieIcon";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().min(1, "Summary is required"),
  description: z.string().min(1, "Description is required"),
  stack: z.string().min(1, "Stack is required"),
  repoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  paperUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
  featured: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      published: false,
      featured: false,
    },
  });

  const title = watch("title");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    setValue("slug", slugify(newTitle));
  };

  const onSubmit = async (data: ProjectFormData) => {
    const stack = data.stack.split(",").map((s) => s.trim()).filter(Boolean);
    
    await createProject.mutateAsync(
      {
        ...data,
        stack,
        repoUrl: data.repoUrl || undefined,
        liveUrl: data.liveUrl || undefined,
        paperUrl: data.paperUrl || undefined,
        coverImageUrl: data.coverImageUrl || undefined,
      },
      {
        onSuccess: () => {
          router.push("/admin/projects");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Project</h1>
          <p className="text-muted-foreground">Add a new project to your portfolio</p>
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
              <Input {...register("summary")} placeholder="Brief one-line description" />
              {errors.summary && (
                <p className="text-sm text-destructive">{errors.summary.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Markdown) *</label>
              <Textarea
                {...register("description")}
                rows={10}
                placeholder="Full project description in Markdown format..."
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tech Stack (comma-separated) *</label>
              <Input {...register("stack")} placeholder="Next.js, TypeScript, Tailwind CSS" />
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
                <label className="text-sm font-medium">Paper URL (for research projects)</label>
                <Input {...register("paperUrl")} placeholder="https://arxiv.org/..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image URL</label>
                <Input {...register("coverImageUrl")} placeholder="https://..." />
              </div>
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
              <Button type="submit" disabled={createProject.isPending}>
                {createProject.isPending ? (
                  <>
                    <LottieIcon name="loader" size={20} className="mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
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

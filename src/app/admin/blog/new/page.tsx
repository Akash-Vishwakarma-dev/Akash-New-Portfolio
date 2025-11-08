"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateBlogPost } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { LottieIcon } from "@/components/LottieIcon";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  readTime: z.string().optional(),
  published: z.boolean(),
  featured: z.boolean(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export default function NewBlogPostPage() {
  const router = useRouter();
  const createBlogPost = useCreateBlogPost();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
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

  const onSubmit = async (data: BlogPostFormData) => {
    await createBlogPost.mutateAsync(
      {
        ...data,
        readTime: data.readTime ? parseInt(data.readTime) : undefined,
        coverImageUrl: data.coverImageUrl || undefined,
      },
      {
        onSuccess: () => {
          router.push("/admin/blog");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Blog Post</h1>
          <p className="text-muted-foreground">Write a new blog post</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
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
              <label className="text-sm font-medium">Excerpt *</label>
              <Textarea {...register("excerpt")} rows={2} placeholder="Brief summary..." />
              {errors.excerpt && (
                <p className="text-sm text-destructive">{errors.excerpt.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content (MDX/Markdown) *</label>
              <Textarea
                {...register("content")}
                rows={15}
                placeholder="Write your blog post content in Markdown format..."
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image URL</label>
                <Input {...register("coverImageUrl")} placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Read Time (minutes)</label>
                <Input {...register("readTime")} type="number" placeholder="5" />
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
              <Button type="submit" disabled={createBlogPost.isPending}>
                {createBlogPost.isPending ? (
                  <>
                    <LottieIcon name="loader" size={20} className="mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Post"
                )}
              </Button>
              <Link href="/admin/blog">
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

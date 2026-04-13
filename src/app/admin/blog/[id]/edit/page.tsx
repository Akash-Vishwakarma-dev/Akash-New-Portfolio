"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAdminBlogPost, useUpdateBlogPost } from "@/hooks/use-api";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieIcon } from "@/components/LottieIcon";
import { LottieLoader } from "@/components/admin/lottie-loader";

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  coverImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  readTime: z.string().optional(),
  publishedAt: z.string().optional(),
  published: z.boolean(),
  featured: z.boolean(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

type AdminBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string | null;
  readTime?: number | null;
  publishedAt?: string | Date | null;
  published: boolean;
  featured: boolean;
};

function getSingleParam(value: string | string[] | undefined): string {
  if (!value) return "";
  return Array.isArray(value) ? value[0] || "" : value;
}

function toDateInputValue(date?: string | Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = getSingleParam(params.id);

  const { data, isLoading } = useAdminBlogPost(id);
  const updateBlogPost = useUpdateBlogPost();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImageUrl: "",
      readTime: "",
      publishedAt: "",
      published: false,
      featured: false,
    },
  });

  const post: AdminBlogPost | undefined = data?.data;

  useEffect(() => {
    if (!post) return;

    reset({
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      coverImageUrl: post.coverImageUrl || "",
      readTime: post.readTime ? String(post.readTime) : "",
      publishedAt: toDateInputValue(post.publishedAt),
      published: !!post.published,
      featured: !!post.featured,
    });
  }, [post, reset]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    if (!watch("slug")) {
      setValue("slug", slugify(newTitle));
    }
  };

  const onSubmit = async (formData: BlogPostFormData) => {
    await updateBlogPost.mutateAsync(
      {
        id,
        data: {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          coverImageUrl: formData.coverImageUrl || undefined,
          readingTime: formData.readTime ? parseInt(formData.readTime, 10) : undefined,
          publishedAt: formData.publishedAt
            ? new Date(`${formData.publishedAt}T00:00:00.000Z`).toISOString()
            : undefined,
          published: formData.published,
          featured: formData.featured,
        } as any,
      },
      {
        onSuccess: () => {
          router.push("/admin/blog");
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

  if (!post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
            <p className="text-muted-foreground">Post not found</p>
          </div>
        </div>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            The blog post could not be loaded. It may have been deleted.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Blog Post</h1>
          <p className="text-muted-foreground">Update your blog post details</p>
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
              <Textarea {...register("excerpt")} rows={2} />
              {errors.excerpt && (
                <p className="text-sm text-destructive">{errors.excerpt.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content (MDX/Markdown) *</label>
              <Textarea {...register("content")} rows={15} />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image URL</label>
                <Input {...register("coverImageUrl")} placeholder="https://..." />
                {errors.coverImageUrl && (
                  <p className="text-sm text-destructive">{errors.coverImageUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Read Time (minutes)</label>
                <Input {...register("readTime")} type="number" placeholder="5" min="1" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Published Date</label>
              <Input {...register("publishedAt")} type="date" />
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
              <Button type="submit" disabled={updateBlogPost.isPending}>
                {updateBlogPost.isPending ? (
                  <>
                    <LottieIcon name="loader" size={20} className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
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

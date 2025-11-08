"use client";

import { useBlogPosts, useDeleteBlogPost } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

export default function BlogPage() {
  const { data: posts, isLoading } = useBlogPosts();
  const deleteBlogPost = useDeleteBlogPost();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LottieLoader size={100} />
      </div>
    );
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteBlogPost.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {posts?.data?.length === 0 && (
          <Card>
            <CardContent className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">No blog posts yet. Write your first one!</p>
            </CardContent>
          </Card>
        )}

        {posts?.data?.map((post: any) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <div className="flex gap-1">
                      {post.published && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                          Published
                        </span>
                      )}
                      {post.featured && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.viewCount || 0} views
                    </span>
                    {post.readTime && <span>{post.readTime} min read</span>}
                    <span>Updated {formatDateTime(post.updatedAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/blog/${post.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deleteBlogPost.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

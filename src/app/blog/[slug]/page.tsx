"use client";
import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Eye, Share2 } from "lucide-react";
import { Section } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { MDXRenderer } from "@/components/mdx/MDXRenderer";
import { getBlogPost, incrementBlogViews } from "@/lib/api";
import type { BlogPost } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    getBlogPost(slug)
      .then((data) => {
        setPost(data);
        // Increment view count
        incrementBlogViews(slug).catch(console.error);
      })
      .catch((err) => {
        console.error("Failed to load blog post:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (!loading && !post) {
    notFound();
  }

  return (
    <>
      <LoaderOverlay isLoading={loading} message="Loading post..." />

      {post && (
        <div className="min-h-screen">
          {/* Header */}
          <section className="relative overflow-hidden bg-gradient-to-b from-card/50 to-transparent py-20">
            {post.coverImage && (
              <div className="absolute inset-0 -z-10 opacity-10">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
              </div>
            )}

            <div className="container mx-auto max-w-4xl px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link
                  href="/blog"
                  className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>

                {/* Tags */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link key={tag.id} href={`/blog?tag=${tag.slug}`}>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>

                <h1 className="mb-6 font-heading text-4xl font-bold md:text-5xl">
                  {post.title}
                </h1>

                <p className="mb-8 text-xl text-muted-foreground">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.readTime} min read
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {post.viewCount} views
                  </span>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 transition-colors hover:text-primary"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Cover Image */}
          {post.coverImage && (
            <Section>
              <div className="container mx-auto max-w-4xl px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl"
                >
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </div>
            </Section>
          )}

          {/* Content */}
          <Section>
            <div className="container mx-auto max-w-4xl px-4">
              <div className="grid gap-12 lg:grid-cols-4 lg:items-start">
                {/* Main Content */}
                <div className="min-w-0 lg:col-span-3">
                  <MDXRenderer content={post.content} />
                </div>

                {/* Sidebar - Table of Contents (placeholder) */}
                <div className="min-w-0 lg:col-span-1">
                  <div className="sticky top-24 space-y-4">
                    <Card className="p-4">
                      <h3 className="mb-4 font-semibold">On This Page</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p className="cursor-pointer hover:text-primary">
                          Introduction
                        </p>
                        <p className="cursor-pointer hover:text-primary">
                          Main Content
                        </p>
                        <p className="cursor-pointer hover:text-primary">
                          Conclusion
                        </p>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="mb-4 font-semibold">Share</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleShare}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Post
                      </Button>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* CTA Section */}
          <Section className="bg-card/50">
            <div className="container mx-auto max-w-4xl px-4">
              <Card className="border-primary/20 p-8">
                <div className="text-center">
                  <h3 className="mb-4 font-heading text-2xl font-bold">
                    Enjoyed this post?
                  </h3>
                  <p className="mb-6 text-muted-foreground">
                    Check out more articles or subscribe to stay updated with the
                    latest content.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <MagneticButton>
                      <Button asChild>
                        <Link href="/blog">View All Posts</Link>
                      </Button>
                    </MagneticButton>
                    <MagneticButton>
                      <Button variant="outline" asChild>
                        <Link href="/contact">Get in Touch</Link>
                      </Button>
                    </MagneticButton>
                  </div>
                </div>
              </Card>
            </div>
          </Section>
        </div>
      )}
    </>
  );
}

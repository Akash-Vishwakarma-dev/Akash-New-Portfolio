"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Section } from "@/components/Section";
import { PostCard } from "@/components/cards/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getBlogPosts, getTags } from "@/lib/api";
import type { BlogPost, Tag } from "@/lib/api";

function BlogContent() {
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(
    searchParams.get("tag")
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query for caching
  const { data: posts = [] } = useQuery({
    queryKey: ['blog-posts', { published: true }],
    queryFn: () => getBlogPosts({ published: true }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    staleTime: 10 * 60 * 1000,
  });

  const filteredPosts = posts.filter((post) => {
    const matchesTag =
      !selectedTag || post.tags.some((t) => t.slug === selectedTag);
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen">
        {/* Header */}
        <Section className="bg-gradient-to-b from-card/50 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="mb-4 font-heading text-5xl font-bold">Blog & Notes</h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Thoughts on software development, AI/ML, web technologies, and
                lessons learned building real-world applications.
              </p>
            </motion.div>

            {/* Search & Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 space-y-6"
            >
              {/* Search Bar */}
              <div className="relative mx-auto max-w-xl">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search posts by title or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tag Filters */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Button
                  variant={selectedTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                >
                  All
                </Button>
                {tags.slice(0, 10).map((tag) => (
                  <Button
                    key={tag.id}
                    variant={selectedTag === tag.slug ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag.slug)}
                  >
                    {tag.name}
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Posts Grid */}
        <Section>
          <div className="container mx-auto px-4">
            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <p className="text-lg text-muted-foreground">
                  No blog posts found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedTag(null);
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 text-sm text-muted-foreground"
                >
                  Showing {filteredPosts.length} of {posts.length} posts
                </motion.p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts.map((post, index) => (
                    <PostCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              </>
            )}
          </div>
        </Section>
      </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}

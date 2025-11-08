"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getProjects, getTags } from "@/lib/api";
import type { Project, Tag } from "@/lib/api";

function ProjectsContent() {
  const searchParams = useSearchParams();
  const [selectedTag, setSelectedTag] = useState<string | null>(
    searchParams.get("tag")
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query for automatic caching and background refetching
  const { data: projects = [], isLoading: loadingProjects } = useQuery({
    queryKey: ['projects', { published: true }],
    queryFn: () => getProjects({ published: true }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: tags = [], isLoading: loadingTags } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const loading = loadingProjects || loadingTags;

  const filteredProjects = projects.filter((project) => {
    const matchesTag = !selectedTag || project.tags.some((t) => t.slug === selectedTag);
    const matchesSearch =
      !searchQuery ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.stack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
              <h1 className="mb-4 font-heading text-5xl font-bold">Projects</h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                A showcase of my work in full-stack development, AI/ML, and modern
                web technologies. Each project represents a unique challenge and
                learning experience.
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
                  placeholder="Search projects by name, description, or tech stack..."
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

        {/* Projects Grid */}
        <Section>
          <div className="container mx-auto px-4">
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <p className="text-lg text-muted-foreground">
                  No projects found matching your criteria.
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
                  Showing {filteredProjects.length} of {projects.length} projects
                </motion.p>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                  ))}
                </div>
              </>
            )}
          </div>
        </Section>
      </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Section } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { ParallaxContainer } from "@/components/fx/ParallaxContainer";
import { getProject, incrementProjectViews } from "@/lib/api";
import type { Project } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { TechBadge } from "@/components/TechIcon";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    getProject(slug)
      .then((data) => {
        setProject(data);
        // Increment view count
        incrementProjectViews(slug).catch(console.error);
      })
      .catch((err) => {
        console.error("Failed to load project:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (!loading && !project) {
    notFound();
  }

  return (
    <>
      <LoaderOverlay isLoading={loading} message="Loading project..." />

      {project && (
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-card/50 to-transparent py-20">
            {project.coverImage && (
              <div className="absolute inset-0 -z-10 opacity-10">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
              </div>
            )}

            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link
                  href="/projects"
                  className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Projects
                </Link>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {project.featured && (
                    <Badge variant="secondary" className="text-sm">
                      Featured
                    </Badge>
                  )}
                  {!project.published && (
                    <Badge variant="destructive" className="text-sm">
                      Draft
                    </Badge>
                  )}
                </div>

                <h1 className="mb-4 font-heading text-5xl font-bold lg:text-6xl">
                  {project.title}
                </h1>

                <p className="mb-6 max-w-3xl text-xl text-muted-foreground">
                  {project.summary}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(project.createdAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {project.viewCount} views
                  </span>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  {project.liveUrl && (
                    <MagneticButton intensity={0.3}>
                      <Button size="lg" asChild>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-5 w-5" />
                          View Live Demo
                        </a>
                      </Button>
                    </MagneticButton>
                  )}
                  {project.githubUrl && (
                    <MagneticButton intensity={0.3}>
                      <Button size="lg" variant="outline" asChild>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="mr-2 h-5 w-5" />
                          View Source Code
                        </a>
                      </Button>
                    </MagneticButton>
                  )}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Cover Image */}
          {project.coverImage && (
            <Section>
              <div className="container mx-auto px-4">
                <ParallaxContainer speed={0.2}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl"
                  >
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </ParallaxContainer>
              </div>
            </Section>
          )}

          {/* Case Study Content */}
          <Section>
            <div className="container mx-auto px-4">
              <div className="grid gap-12 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                  {/* Problem */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="mb-4 flex items-center gap-2 font-heading text-3xl font-bold">
                      <ChevronRight className="h-6 w-6 text-primary" />
                      The Problem
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p className="text-muted-foreground">
                        {project.description.split("\n\n")[0] || project.summary}
                      </p>
                    </div>
                  </motion.div>

                  {/* Solution */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="mb-4 flex items-center gap-2 font-heading text-3xl font-bold">
                      <ChevronRight className="h-6 w-6 text-primary" />
                      The Solution
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p className="text-muted-foreground">
                        {project.description.split("\n\n")[1] || 
                          "Built a comprehensive solution leveraging modern technologies and best practices to address the core challenges."}
                      </p>
                    </div>
                  </motion.div>

                  {/* Architecture */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="mb-4 flex items-center gap-2 font-heading text-3xl font-bold">
                      <ChevronRight className="h-6 w-6 text-primary" />
                      Technical Architecture
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p className="text-muted-foreground">
                        {project.description.split("\n\n")[2] || 
                          "The project follows modern architectural patterns with a focus on scalability, performance, and maintainability."}
                      </p>
                    </div>
                  </motion.div>

                  {/* Impact */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="mb-4 flex items-center gap-2 font-heading text-3xl font-bold">
                      <ChevronRight className="h-6 w-6 text-primary" />
                      Impact & Results
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <p className="text-muted-foreground">
                        {project.description.split("\n\n")[3] || 
                          "This project demonstrates practical application of cutting-edge technologies and delivers measurable value to users."}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Tech Stack */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tech Stack</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {project.stack.map((tech) => (
                            <TechBadge key={tech} name={tech} size={14} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Tags */}
                  {project.tags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Link
                                key={tag.id}
                                href={`/projects?tag=${tag.slug}`}
                              >
                                <Badge variant="outline" className="hover:bg-accent cursor-pointer">
                                  {tag.name}
                                </Badge>
                              </Link>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Links */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Project Links</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                            Live Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <Github className="h-4 w-4" />
                            Source Code
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </Section>

          {/* CTA Section */}
          <Section className="bg-card/50">
            <div className="container mx-auto px-4">
              <Card className="border-primary/20">
                <CardContent className="p-8 text-center">
                  <h3 className="mb-4 font-heading text-2xl font-bold">
                    Interested in Similar Projects?
                  </h3>
                  <p className="mb-6 text-muted-foreground">
                    Check out more of my work or get in touch to discuss your next project.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <MagneticButton>
                      <Button asChild>
                        <Link href="/projects">View All Projects</Link>
                      </Button>
                    </MagneticButton>
                    <MagneticButton>
                      <Button variant="outline" asChild>
                        <Link href="/contact">Get in Touch</Link>
                      </Button>
                    </MagneticButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>
        </div>
      )}
    </>
  );
}

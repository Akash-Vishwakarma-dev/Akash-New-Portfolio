"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Github, Eye } from "lucide-react";
import type { Project } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { TechIcon } from "../TechIcon";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
          {project.coverImage && (
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          )}
          
          <CardHeader>
            <div className="flex items-start justify-between">
              <Link href={`/projects/${project.slug}`} className="flex-1">
                <CardTitle className="line-clamp-1 font-heading text-xl hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
              </Link>
              <div className="flex gap-2">
                {project.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {project.summary}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.stack.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="outline" className="inline-flex items-center gap-1.5 text-xs">
                  <TechIcon name={tech} size={12} />
                  {tech}
                </Badge>
              ))}
              {project.stack.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{project.stack.length - 4}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {project.viewCount}
              </span>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="h-4 w-4" />
                  Code
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                  Live
                </a>
              )}
            </div>
          </CardContent>
        </Card>
    </motion.div>
  );
}

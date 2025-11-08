"use client";

import { useProjects, useDeleteProject } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LottieLoader size={100} />
      </div>
    );
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteProject.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {projects?.data?.length === 0 && (
          <Card>
            <CardContent className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">No projects yet. Create your first one!</p>
            </CardContent>
          </Card>
        )}

        {projects?.data?.map((project: any) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <div className="flex gap-1">
                      {project.published && (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                          Published
                        </span>
                      )}
                      {project.featured && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{project.summary}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.stack?.slice(0, 5).map((tech: string) => (
                      <span
                        key={tech}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Updated {formatDateTime(project.updatedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(project.id, project.title)}
                    disabled={deleteProject.isPending}
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

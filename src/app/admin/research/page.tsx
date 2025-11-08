"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Temporary mock data
const researchPapers = [
  {
    id: "1",
    title: "Machine Learning in Web Development",
    journal: "IEEE Computer Society",
    publishedAt: "2024-03-15",
    url: "https://doi.org/example",
    published: true,
  },
];

export default function ResearchPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this research paper?")) return;
    
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Research paper deleted successfully!");
      setIsLoading(false);
    }, 500);
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success(`Research paper ${currentStatus ? "unpublished" : "published"}!`);
      setIsLoading(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LottieLoader size={100} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Papers</h1>
          <p className="text-muted-foreground">Manage your research publications</p>
        </div>
        <Link href="/admin/research/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Research Paper
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {researchPapers.length === 0 ? (
          <Card>
            <CardContent className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">No research papers found. Add your first publication!</p>
            </CardContent>
          </Card>
        ) : (
          researchPapers.map((paper) => (
            <Card key={paper.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-medium">{paper.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTogglePublish(paper.id, paper.published)}
                  >
                    {paper.published ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Link href={`/admin/research/${paper.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(paper.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Journal:</strong> {paper.journal}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Published:</strong> {new Date(paper.publishedAt).toLocaleDateString()}
                  </p>
                  {paper.url && (
                    <p className="text-muted-foreground">
                      <strong>URL:</strong>{" "}
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:underline"
                      >
                        View Paper
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    <strong>Status:</strong>{" "}
                    <span className={paper.published ? "text-green-600" : "text-yellow-600"}>
                      {paper.published ? "Published" : "Draft"}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

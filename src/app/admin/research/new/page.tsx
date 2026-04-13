"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieIcon } from "@/components/LottieIcon";

interface ResearchFormData {
  title: string;
  venue: string;
  year: string;
  abstract: string;
  doi: string;
  pdfUrl: string;
  authors: string;
  keywords: string;
  published: boolean;
}

export default function NewResearchPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ResearchFormData>({
    title: "",
    venue: "",
    year: new Date().getFullYear().toString(),
    abstract: "",
    doi: "",
    pdfUrl: "",
    authors: "",
    keywords: "",
    published: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.venue.trim() || !formData.abstract.trim()) {
      toast.error("Title, venue, and abstract are required.");
      return;
    }

    const authors = formData.authors
      .split(",")
      .map((author) => author.trim())
      .filter(Boolean);

    if (authors.length === 0) {
      toast.error("At least one author is required.");
      return;
    }

    const parsedYear = Number(formData.year);
    if (!Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
      toast.error("Please enter a valid year between 1900 and 2100.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post("/api/research", {
        title: formData.title.trim(),
        venue: formData.venue.trim(),
        year: parsedYear,
        abstract: formData.abstract.trim(),
        doi: formData.doi.trim() || undefined,
        pdfUrl: formData.pdfUrl.trim() || undefined,
        authors,
        keywords: formData.keywords
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean),
        published: formData.published,
      });

      toast.success("Research paper created successfully!");
      router.push("/admin/research");
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to create research paper.";
      toast.error(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/research">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Research Paper</h1>
          <p className="text-muted-foreground">Add a new research publication</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Research Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Paper title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Venue *</label>
                <Input
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Journal / Conference"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  min="2000"
                  max="2100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">DOI</label>
                <Input
                  name="doi"
                  value={formData.doi}
                  onChange={handleChange}
                  placeholder="10.xxxx/xxxx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Abstract *</label>
              <Textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleChange}
                rows={6}
                placeholder="Brief abstract of your research..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">PDF URL</label>
                <Input
                  name="pdfUrl"
                  value={formData.pdfUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Authors (comma-separated)</label>
                <Input
                  name="authors"
                  value={formData.authors}
                  onChange={handleChange}
                  placeholder="Author One, Author Two"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords (comma-separated)</label>
              <Input
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="AI, NLP, Computer Vision"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">Published</span>
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LottieIcon name="loader" size={20} className="mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Research Paper"
                )}
              </Button>

              <Link href="/admin/research">
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

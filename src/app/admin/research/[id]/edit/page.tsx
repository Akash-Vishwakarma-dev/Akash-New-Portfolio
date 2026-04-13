"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieIcon } from "@/components/LottieIcon";
import { LottieLoader } from "@/components/admin/lottie-loader";

type ResearchPayload = {
  id: string;
  title: string;
  slug: string;
  venue: string;
  abstract: string;
  pdfUrl?: string;
  authors: string[];
  published: boolean;
  featured?: boolean;
  publishedAt?: string;
};

interface ResearchFormData {
  title: string;
  slug: string;
  venue: string;
  abstract: string;
  pdfUrl: string;
  authors: string;
  published: boolean;
  featured: boolean;
  publishedAt: string;
}

function getParam(value: string | string[] | undefined): string {
  if (!value) return "";
  return Array.isArray(value) ? value[0] || "" : value;
}

function toDateInput(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function EditResearchPage() {
  const params = useParams();
  const router = useRouter();
  const id = getParam(params.id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ResearchFormData>({
    title: "",
    slug: "",
    venue: "",
    abstract: "",
    pdfUrl: "",
    authors: "",
    published: false,
    featured: false,
    publishedAt: "",
  });

  useEffect(() => {
    if (!id) return;

    apiClient
      .get(`/api/research/${id}`)
      .then((res) => {
        const paper: ResearchPayload = res.data?.data;
        if (!paper) return;

        setFormData({
          title: paper.title || "",
          slug: paper.slug || "",
          venue: paper.venue || "",
          abstract: paper.abstract || "",
          pdfUrl: paper.pdfUrl || "",
          authors: (paper.authors || []).join(", "),
          published: !!paper.published,
          featured: !!paper.featured,
          publishedAt: toDateInput(paper.publishedAt),
        });
      })
      .catch(() => {
        toast.error("Failed to load research paper");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: prev.slug ? prev.slug : slugify(value),
      }));
      return;
    }

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

    setIsSubmitting(true);

    try {
      await apiClient.patch(`/api/research/${id}`, {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        venue: formData.venue.trim(),
        abstract: formData.abstract.trim(),
        pdfUrl: formData.pdfUrl.trim() || null,
        authors,
        published: formData.published,
        featured: formData.featured,
        publishedAt: formData.publishedAt
          ? new Date(`${formData.publishedAt}T00:00:00.000Z`).toISOString()
          : null,
      });

      toast.success("Research paper updated successfully!");
      router.push("/admin/research");
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to update research paper.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="flex items-center gap-4">
        <Link href="/admin/research">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Research Paper</h1>
          <p className="text-muted-foreground">Update your research publication</p>
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
                <Input name="title" value={formData.title} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug *</label>
                <Input name="slug" value={formData.slug} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Venue *</label>
              <Input name="venue" value={formData.venue} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Abstract *</label>
              <Textarea
                name="abstract"
                value={formData.abstract}
                onChange={handleChange}
                rows={6}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Paper URL</label>
                <Input name="pdfUrl" value={formData.pdfUrl} onChange={handleChange} placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Published Date</label>
                <Input name="publishedAt" type="date" value={formData.publishedAt} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Authors (comma-separated) *</label>
              <Input
                name="authors"
                value={formData.authors}
                onChange={handleChange}
                placeholder="Author One, Author Two"
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

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">Featured</span>
              </label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LottieIcon name="loader" size={20} className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
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

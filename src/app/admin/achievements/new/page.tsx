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

interface AchievementFormData {
  title: string;
  category: string;
  achievedAt: string;
  description: string;
  url: string;
  iconUrl: string;
  published: boolean;
  featured: boolean;
}

export default function NewAchievementPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AchievementFormData>({
    title: "",
    category: "",
    achievedAt: "",
    description: "",
    url: "",
    iconUrl: "",
    published: true,
    featured: false,
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

    if (!formData.title.trim() || !formData.category.trim() || !formData.achievedAt || !formData.description.trim()) {
      toast.error("Title, category, achieved date, and description are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post("/api/achievements", {
        title: formData.title.trim(),
        category: formData.category.trim(),
        achievedAt: new Date(`${formData.achievedAt}T00:00:00.000Z`).toISOString(),
        description: formData.description.trim(),
        url: formData.url.trim() || null,
        iconUrl: formData.iconUrl.trim() || null,
        published: formData.published,
        featured: formData.featured,
      });

      toast.success("Achievement created successfully!");
      router.push("/admin/achievements");
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to create achievement.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/achievements">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Achievement</h1>
          <p className="text-muted-foreground">Add a new award or achievement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Achievement Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. First Place - Hackathon 2024"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <Input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Hackathon, Award, Recognition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Achieved On *</label>
              <Input
                name="achievedAt"
                type="date"
                value={formData.achievedAt}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe this achievement..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Reference URL</label>
                <Input
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Icon/Image URL</label>
                <Input
                  name="iconUrl"
                  value={formData.iconUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
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
                    Creating...
                  </>
                ) : (
                  "Create Achievement"
                )}
              </Button>

              <Link href="/admin/achievements">
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

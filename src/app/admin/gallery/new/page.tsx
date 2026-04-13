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

interface GalleryFormData {
  url: string;
  caption: string;
  type: "image" | "video" | "demo";
  projectId: string;
  displayOrder: string;
}

export default function NewGalleryItemPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<GalleryFormData>({
    url: "",
    caption: "",
    type: "image",
    projectId: "",
    displayOrder: "0",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.url.trim()) {
      toast.error("Media URL is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.post("/api/gallery", {
        url: formData.url.trim(),
        caption: formData.caption.trim() || null,
        type: formData.type,
        projectId: formData.projectId.trim() || null,
        displayOrder: Number.parseInt(formData.displayOrder || "0", 10) || 0,
      });

      toast.success("Gallery item created successfully!");
      router.push("/admin/gallery");
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to create gallery item.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/gallery">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Gallery Item</h1>
          <p className="text-muted-foreground">Create a new media item in your gallery</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Gallery Item Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Media URL *</label>
              <Input
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Caption</label>
              <Textarea
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                rows={3}
                placeholder="Optional caption or description"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="demo">Demo</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Display Order</label>
                <Input
                  name="displayOrder"
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project ID (optional)</label>
              <Input
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                placeholder="MongoDB ObjectId of project"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LottieIcon name="loader" size={20} className="mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Gallery Item"
                )}
              </Button>

              <Link href="/admin/gallery">
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

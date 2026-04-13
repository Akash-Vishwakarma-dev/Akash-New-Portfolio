"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieIcon } from "@/components/LottieIcon";
import { LottieLoader } from "@/components/admin/lottie-loader";

interface GalleryFormData {
  url: string;
  caption: string;
  type: "image" | "video" | "demo";
  projectId: string;
  displayOrder: string;
}

type GalleryItemResponse = {
  id?: string;
  url?: string;
  caption?: string | null;
  type?: string;
  projectId?: string | null;
  displayOrder?: number;
};

function getParam(value: string | string[] | undefined): string {
  if (!value) return "";
  return Array.isArray(value) ? value[0] || "" : value;
}

export default function EditGalleryItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = getParam(params.id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<GalleryFormData>({
    url: "",
    caption: "",
    type: "image",
    projectId: "",
    displayOrder: "0",
  });

  useEffect(() => {
    if (!id) return;

    apiClient
      .get(`/api/gallery/${id}`)
      .then((res) => {
        const item: GalleryItemResponse | undefined = res?.data?.data;
        if (!item) return;

        setFormData({
          url: item.url || "",
          caption: item.caption || "",
          type: item.type === "video" || item.type === "demo" ? item.type : "image",
          projectId: item.projectId || "",
          displayOrder: String(item.displayOrder ?? 0),
        });
      })
      .catch(() => {
        toast.error("Failed to load gallery item details.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

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
      await apiClient.patch(`/api/gallery/${id}`, {
        url: formData.url.trim(),
        caption: formData.caption.trim() || null,
        type: formData.type,
        projectId: formData.projectId.trim() || null,
        displayOrder: Number.parseInt(formData.displayOrder || "0", 10) || 0,
      });

      toast.success("Gallery item updated successfully!");
      router.push("/admin/gallery");
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to update gallery item.";
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
        <Link href="/admin/gallery">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Gallery Item</h1>
          <p className="text-muted-foreground">Update media information</p>
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
              <Input name="url" value={formData.url} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Caption</label>
              <Textarea name="caption" value={formData.caption} onChange={handleChange} rows={3} />
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
              <Input name="projectId" value={formData.projectId} onChange={handleChange} />
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieIcon } from "@/components/LottieIcon";
import { LottieLoader } from "@/components/admin/lottie-loader";

interface AnimationFormData {
  name: string;
  jsonUrl: string;
  category: string;
  description: string;
  published: boolean;
}

function getParam(value: string | string[] | undefined): string {
  if (!value) return "";
  return Array.isArray(value) ? value[0] || "" : value;
}

function toTitleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function EditAnimationPage() {
  const params = useParams();
  const router = useRouter();
  const nameParam = getParam(params.name);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewData, setPreviewData] = useState<unknown>(null);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [formData, setFormData] = useState<AnimationFormData>({
    name: nameParam,
    jsonUrl: `/animations/${nameParam}.json`,
    category: "General",
    description: "",
    published: true,
  });

  useEffect(() => {
    if (!nameParam) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [metaResult, previewResult] = await Promise.allSettled([
          apiClient.get(`/api/admin/lottie/${nameParam}`),
          fetch(`/animations/${nameParam}.json`),
        ]);

        if (metaResult.status === "fulfilled") {
          const data = metaResult.value?.data?.data;
          if (data) {
            setFormData({
              name: data.name || nameParam,
              jsonUrl: data.jsonUrl || `/animations/${nameParam}.json`,
              category: data.category || "General",
              description: data.description || "",
              published: data.published ?? true,
            });
          }
        } else {
          setFormData((prev) => ({
            ...prev,
            name: nameParam,
            jsonUrl: `/animations/${nameParam}.json`,
            category: prev.category || toTitleCase(nameParam.split("-")[0] || "General"),
          }));
        }

        if (previewResult.status === "fulfilled" && previewResult.value.ok) {
          const json = await previewResult.value.json();
          setPreviewData(json);
          setPreviewFailed(false);
        } else {
          setPreviewData(null);
          setPreviewFailed(true);
        }
      } catch {
        toast.error("Failed to load animation details.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [nameParam]);

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

    if (!formData.name.trim() || !formData.jsonUrl.trim()) {
      toast.error("Name and JSON URL are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClient.patch(`/api/admin/lottie/${nameParam}`, {
        name: formData.name.trim(),
        jsonUrl: formData.jsonUrl.trim(),
        category: formData.category.trim() || null,
        description: formData.description.trim() || null,
        published: formData.published,
      });

      toast.success("Animation updated successfully!");
      router.push("/admin/animations");
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to update animation.";
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
        <Link href="/admin/animations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Animation</h1>
          <p className="text-muted-foreground">Update animation metadata and visibility</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square overflow-hidden rounded-md border bg-muted/50">
              {!previewFailed && previewData ? (
                <Lottie animationData={previewData as object} loop autoplay />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Preview unavailable for this animation.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Animation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">JSON URL *</label>
                <Input name="jsonUrl" value={formData.jsonUrl} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input name="category" value={formData.category} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
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
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>

                <Link href="/admin/animations">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

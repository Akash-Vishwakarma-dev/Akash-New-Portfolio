"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import apiClient from "@/lib/api-client";

function isVideoUrl(url: string, type?: string): boolean {
  if (type === "video") return true;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

interface GalleryListItem {
  id: string;
  url: string;
  caption?: string;
  type?: string;
  projectId?: string;
  createdAt?: string;
  displayOrder?: number;
}

export default function GalleryPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryListItem[]>([]);

  const fetchGalleryItems = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/api/gallery");
      const items = (response.data?.data || response.data || []) as GalleryListItem[];
      setGalleryItems(items);
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to load gallery items.";
      toast.error(message);
      setGalleryItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    setIsLoading(true);
    try {
      await apiClient.delete(`/api/gallery/${id}`);
      setGalleryItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Gallery item deleted successfully!");
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to delete gallery item.";
      toast.error(message);
    } finally {
      setIsLoading(false);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground">Manage your portfolio images and media</p>
        </div>
        <Link href="/admin/gallery/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Gallery Item
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {galleryItems.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">No gallery items found. Upload your first image!</p>
            </CardContent>
          </Card>
        ) : (
          galleryItems.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium truncate">
                  {item.caption || "Untitled Media"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                  {item.url ? (
                    isVideoUrl(item.url, item.type) ? (
                      <video
                        src={item.url}
                        className="h-full w-full object-cover"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.caption || "Gallery image"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Type:</strong> {(item.type || "image").toUpperCase()}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Display Order:</strong> {item.displayOrder ?? 0}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Created:</strong>{" "}
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/gallery/${item.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

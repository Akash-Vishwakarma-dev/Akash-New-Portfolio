"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

// Temporary mock data
const galleryItems = [
  {
    id: "1",
    title: "Project Screenshot",
    category: "Projects",
    imageUrl: "/placeholder.jpg",
    published: true,
    createdAt: "2024-01-15",
  },
];

export default function GalleryPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Gallery item deleted successfully!");
      setIsLoading(false);
    }, 500);
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success(`Gallery item ${currentStatus ? "unpublished" : "published"}!`);
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
                <CardTitle className="text-base font-medium truncate">{item.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleTogglePublish(item.id, item.published)}
                  >
                    {item.published ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Category:</strong> {item.category}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Status:</strong>{" "}
                    <span className={item.published ? "text-green-600" : "text-yellow-600"}>
                      {item.published ? "Published" : "Draft"}
                    </span>
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

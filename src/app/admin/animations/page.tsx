"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { Plus, Edit, Trash2, Upload, Download, Play } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Temporary mock data
const animations = [
  {
    id: "loader-light",
    name: "Loader (Light)",
    fileName: "loader-light.json",
    category: "Loaders",
    size: "12.5 KB",
    createdAt: "2024-01-15",
  },
  {
    id: "loader-dark",
    name: "Loader (Dark)",
    fileName: "loader-dark.json",
    category: "Loaders",
    size: "12.3 KB",
    createdAt: "2024-01-15",
  },
  {
    id: "success-light",
    name: "Success (Light)",
    fileName: "success-light.json",
    category: "Status",
    size: "8.7 KB",
    createdAt: "2024-01-15",
  },
  {
    id: "error-light",
    name: "Error (Light)",
    fileName: "error-light.json",
    category: "Status",
    size: "9.2 KB",
    createdAt: "2024-01-15",
  },
];

export default function AnimationsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this animation?")) return;
    
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Animation deleted successfully!");
      setIsLoading(false);
    }, 500);
  };

  const handleUpload = () => {
    toast.info("Upload functionality coming soon!");
  };

  const handleDownload = (fileName: string) => {
    toast.success(`Downloading ${fileName}...`);
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
          <h1 className="text-3xl font-bold tracking-tight">Lottie Animations</h1>
          <p className="text-muted-foreground">Manage your Lottie animation files</p>
        </div>
        <Button onClick={handleUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Animation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {animations.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">No animations found. Upload your first Lottie animation!</p>
            </CardContent>
          </Card>
        ) : (
          animations.map((animation) => (
            <Card key={animation.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium truncate">{animation.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDelete(animation.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative aspect-square overflow-hidden rounded-md bg-muted/50 border">
                  <div className="flex h-full items-center justify-center">
                    <Play className="h-12 w-12 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <strong>File:</strong> {animation.fileName}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Category:</strong> {animation.category}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Size:</strong> {animation.size}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(animation.fileName)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Link href={`/admin/animations/${animation.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

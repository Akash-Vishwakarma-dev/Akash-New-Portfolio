"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { Plus, Edit, Trash2, Upload, Download, Play } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Lottie from "lottie-react";

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
    id: "loader-default",
    name: "Loader (Default)",
    fileName: "loader.json",
    category: "Loaders",
    size: "12.4 KB",
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
    id: "success-dark",
    name: "Success (Dark)",
    fileName: "success-dark.json",
    category: "Status",
    size: "8.8 KB",
    createdAt: "2024-01-15",
  },
  {
    id: "success-default",
    name: "Success (Default)",
    fileName: "success.json",
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
  {
    id: "error-dark",
    name: "Error (Dark)",
    fileName: "error-dark.json",
    category: "Status",
    size: "9.3 KB",
    createdAt: "2024-01-15",
  },
  {
    id: "error-default",
    name: "Error (Default)",
    fileName: "error.json",
    category: "Status",
    size: "9.2 KB",
    createdAt: "2024-01-15",
  },
  {
    id: "toggle-light",
    name: "Toggle (Light)",
    fileName: "toggle-light.json",
    category: "Theme",
    size: "6.1 KB",
    createdAt: "2024-01-15",
  },
  {
    id: "toggle-dark",
    name: "Toggle (Dark)",
    fileName: "toggle-dark.json",
    category: "Theme",
    size: "6.0 KB",
    createdAt: "2024-01-15",
  },
  {
    id: "hero-accent",
    name: "Hero Accent",
    fileName: "hero-accent.json",
    category: "Hero",
    size: "20.0 KB",
    createdAt: "2024-01-15",
  },
];

function LottiePreview({ fileName, title }: { fileName: string; title: string }) {
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch(`/animations/${fileName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Animation not found");
        return res.json();
      })
      .then((json) => {
        if (isMounted) {
          setAnimationData(json);
          setFailed(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAnimationData(null);
          setFailed(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fileName]);

  if (failed || !animationData) {
    return (
      <div className="flex h-full items-center justify-center" title={title}>
        <Play className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return <Lottie animationData={animationData as object} loop autoplay />;
}

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
    try {
      const link = document.createElement("a");
      link.href = `/animations/${fileName}`;
      link.download = fileName;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${fileName}...`);
    } catch {
      toast.error("Failed to start download.");
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
                  <LottiePreview fileName={animation.fileName} title={animation.name} />
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

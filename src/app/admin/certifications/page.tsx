"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Temporary mock data - replace with actual API hooks
const certifications = [
  {
    id: "1",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    issuedAt: "2024-01-15",
    credentialUrl: "#",
    published: true,
  },
];

export default function CertificationsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    
    setIsLoading(true);
    // TODO: Implement delete with API
    setTimeout(() => {
      toast.success("Certification deleted successfully!");
      setIsLoading(false);
    }, 500);
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    // TODO: Implement toggle with API
    setTimeout(() => {
      toast.success(`Certification ${currentStatus ? "unpublished" : "published"}!`);
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
          <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
          <p className="text-muted-foreground">Manage your professional certifications</p>
        </div>
        <Link href="/admin/certifications/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Certification
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {certifications.length === 0 ? (
          <Card>
            <CardContent className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">No certifications found. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          certifications.map((cert) => (
            <Card key={cert.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-medium">{cert.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTogglePublish(cert.id, cert.published)}
                  >
                    {cert.published ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Link href={`/admin/certifications/${cert.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Issuer:</strong> {cert.issuer}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Issued:</strong> {new Date(cert.issuedAt).toLocaleDateString()}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Status:</strong>{" "}
                    <span className={cert.published ? "text-green-600" : "text-yellow-600"}>
                      {cert.published ? "Published" : "Draft"}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

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

interface CertificationFormData {
  title: string;
  issuer: string;
  issuedAt: string;
  expiresAt: string;
  credentialId: string;
  credentialUrl: string;
  skills: string;
  description: string;
  published: boolean;
}

export default function NewCertificationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CertificationFormData>({
    title: "",
    issuer: "",
    issuedAt: "",
    expiresAt: "",
    credentialId: "",
    credentialUrl: "",
    skills: "",
    description: "",
    published: false,
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

    if (!formData.title.trim() || !formData.issuer.trim() || !formData.issuedAt) {
      toast.error("Title, issuer, and issue date are required.");
      return;
    }

    const skills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    setIsSubmitting(true);

    try {
      await apiClient.post("/api/certifications", {
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        issuedAt: new Date(`${formData.issuedAt}T00:00:00.000Z`).toISOString(),
        expiresAt: formData.expiresAt
          ? new Date(`${formData.expiresAt}T00:00:00.000Z`).toISOString()
          : null,
        credentialId: formData.credentialId.trim() || null,
        credentialUrl: formData.credentialUrl.trim() || null,
        skills,
        description: formData.description.trim() || null,
        published: formData.published,
      });

      toast.success("Certification created successfully!");
      router.push("/admin/certifications");
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to create certification.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/certifications">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Certification</h1>
          <p className="text-muted-foreground">Add a new professional certification</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Certification Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Issuer *</label>
                <Input
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  placeholder="e.g. Amazon Web Services"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Issued On *</label>
                <Input
                  name="issuedAt"
                  type="date"
                  value={formData.issuedAt}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expires On</label>
                <Input
                  name="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Credential ID</label>
                <Input
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Credential URL</label>
                <Input
                  name="credentialUrl"
                  value={formData.credentialUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <Input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="AWS, Cloud Architecture, Security"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Short summary about this certification..."
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
                    Creating...
                  </>
                ) : (
                  "Create Certification"
                )}
              </Button>

              <Link href="/admin/certifications">
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

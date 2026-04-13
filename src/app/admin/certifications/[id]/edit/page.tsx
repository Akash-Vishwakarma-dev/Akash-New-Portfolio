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

type CertificationResponse = {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  expiresAt?: string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  skills: string[];
  description?: string | null;
  published: boolean;
};

function getParam(value: string | string[] | undefined): string {
  if (!value) return "";
  return Array.isArray(value) ? value[0] || "" : value;
}

function toDateInput(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function EditCertificationPage() {
  const params = useParams();
  const router = useRouter();
  const id = getParam(params.id);

  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (!id) return;

    apiClient
      .get(`/api/certifications/${id}`)
      .then((res) => {
        const cert: CertificationResponse | undefined = res?.data?.data;
        if (!cert) return;

        setFormData({
          title: cert.title || "",
          issuer: cert.issuer || "",
          issuedAt: toDateInput(cert.issuedAt),
          expiresAt: toDateInput(cert.expiresAt),
          credentialId: cert.credentialId || "",
          credentialUrl: cert.credentialUrl || "",
          skills: (cert.skills || []).join(", "),
          description: cert.description || "",
          published: !!cert.published,
        });
      })
      .catch(() => {
        toast.error("Failed to load certification details.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

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
      await apiClient.patch(`/api/certifications/${id}`, {
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

      toast.success("Certification updated successfully!");
      router.push("/admin/certifications");
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to update certification.";
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
        <Link href="/admin/certifications">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Certification</h1>
          <p className="text-muted-foreground">Update your certification details</p>
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
                <Input name="title" value={formData.title} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Issuer *</label>
                <Input name="issuer" value={formData.issuer} onChange={handleChange} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Issued On *</label>
                <Input name="issuedAt" type="date" value={formData.issuedAt} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expires On</label>
                <Input name="expiresAt" type="date" value={formData.expiresAt} onChange={handleChange} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Credential ID</label>
                <Input name="credentialId" value={formData.credentialId} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Credential URL</label>
                <Input name="credentialUrl" value={formData.credentialUrl} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <Input name="skills" value={formData.skills} onChange={handleChange} placeholder="AWS, Cloud, Security" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} />
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

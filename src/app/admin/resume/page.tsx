"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Trash2, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LottieLoader } from "@/components/admin/lottie-loader";
import apiClient from "@/lib/api-client";
import { normalizeResumeUrl } from "@/lib/resume-url";

type ResumeItem = {
  id: string;
  version: string;
  fileUrl: string;
  fileName: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
};

export default function AdminResumePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [form, setForm] = useState({
    version: "",
    fileUrl: "",
    fileName: "",
    description: "",
    isActive: true,
  });

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/api/admin/resume");
      const list = (response.data?.data || response.data || []) as ResumeItem[];
      setResumes(list);
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to load resumes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleAddResume = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiClient.post("/api/admin/resume", {
        version: form.version.trim(),
        fileUrl: normalizeResumeUrl(form.fileUrl),
        fileName: form.fileName.trim(),
        description: form.description.trim() || null,
        isActive: form.isActive,
      });

      toast.success("Resume added successfully");
      setForm({
        version: "",
        fileUrl: "",
        fileName: "",
        description: "",
        isActive: true,
      });
      fetchResumes();
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to add resume");
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      await apiClient.patch(`/api/admin/resume/${id}`, { isActive: true });
      toast.success("Active resume updated");
      fetchResumes();
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to update resume");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resume?")) return;

    try {
      await apiClient.delete(`/api/admin/resume/${id}`);
      toast.success("Resume deleted successfully");
      fetchResumes();
    } catch (error: any) {
      toast.error(error?.response?.data?.error?.message || "Failed to delete resume");
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume</h1>
        <p className="text-muted-foreground">Add and manage resume versions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddResume} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={form.version}
                onChange={(e) => setForm((prev) => ({ ...prev, version: e.target.value }))}
                placeholder="e.g. v2.0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileName">File Name</Label>
              <Input
                id="fileName"
                value={form.fileName}
                onChange={(e) => setForm((prev) => ({ ...prev, fileName: e.target.value }))}
                placeholder="Akash_Resume.pdf"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fileUrl">Resume URL</Label>
              <Input
                id="fileUrl"
                type="url"
                value={form.fileUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, fileUrl: e.target.value }))}
                placeholder="https://.../resume.pdf"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Short note about this resume version"
              />
            </div>

            <div className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
              <Label htmlFor="isActive">Set as active resume</Label>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                Add Resume
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {resumes.length === 0 ? (
          <Card>
            <CardContent className="flex h-28 items-center justify-center text-muted-foreground">
              No resumes added yet.
            </CardContent>
          </Card>
        ) : (
          resumes.map((resume) => (
            <Card key={resume.id}>
              <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-semibold">{resume.version}</span>
                    {resume.isActive && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{resume.fileName}</p>
                  {resume.description && (
                    <p className="text-sm text-muted-foreground">{resume.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Added on {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={resume.fileUrl} target="_blank">
                      Open
                    </Link>
                  </Button>
                  {!resume.isActive && (
                    <Button variant="outline" size="sm" onClick={() => handleSetActive(resume.id)}>
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Set Active
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(resume.id)}>
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

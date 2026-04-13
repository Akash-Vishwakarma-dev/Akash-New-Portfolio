"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import apiClient from "@/lib/api-client";
import type { Achievement } from "@/lib/api";

type AchievementListItem = Pick<Achievement, "id" | "title" | "category" | "achievedAt" | "published">;

interface RawAchievementResponse {
  id?: string;
  _id?: string;
  title?: string;
  category?: string;
  achievedAt?: string;
  published?: boolean;
}

export default function AchievementsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [achievements, setAchievements] = useState<AchievementListItem[]>([]);

  const fetchAchievements = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/api/achievements");
      const rawItems = (response.data?.data || response.data || []) as RawAchievementResponse[];
      const items: AchievementListItem[] = rawItems
        .map((item) => ({
          id: item.id || item._id || "",
          title: item.title || "Untitled",
          category: item.category || "General",
          achievedAt: item.achievedAt || new Date().toISOString(),
          published: !!item.published,
        }))
        .filter((item) => item.id);
      setAchievements(items);
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to load achievements.";
      toast.error(message);
      setAchievements([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;

    setIsLoading(true);
    try {
      await apiClient.delete(`/api/achievements/${id}`);
      const response = await apiClient.get("/api/achievements");
      const latest = (response.data?.data || response.data || []) as RawAchievementResponse[];
      const stillExists = latest.some((item) => (item.id || item._id) === id);

      if (stillExists) {
        toast.error("Delete could not be confirmed. Please try again.");
      } else {
        toast.success("Achievement deleted successfully!");
      }

      setAchievements(
        latest
          .map((item) => ({
            id: item.id || item._id || "",
            title: item.title || "Untitled",
            category: item.category || "General",
            achievedAt: item.achievedAt || new Date().toISOString(),
            published: !!item.published,
          }))
          .filter((item) => item.id)
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to delete achievement.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    try {
      await apiClient.patch(`/api/achievements/${id}`, {
        published: !currentStatus,
      });
      const refreshed = await apiClient.get("/api/achievements");
      const latest = (refreshed.data?.data || refreshed.data || []) as RawAchievementResponse[];
      const normalized = latest
        .map((item) => ({
          id: item.id || item._id || "",
          title: item.title || "Untitled",
          category: item.category || "General",
          achievedAt: item.achievedAt || new Date().toISOString(),
          published: !!item.published,
        }))
        .filter((item) => item.id);

      setAchievements(normalized);
      const target = normalized.find((achievement) => achievement.id === id);
      const savedStatus = !!target?.published;
      toast.success(`Achievement ${savedStatus ? "published" : "unpublished"}!`);
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Failed to update achievement status.";
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
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground">Manage your awards and achievements</p>
        </div>
        <Link href="/admin/achievements/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Achievement
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {achievements.length === 0 ? (
          <Card>
            <CardContent className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground">No achievements found. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          achievements.map((achievement) => (
            <Card key={achievement.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-medium">{achievement.title}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTogglePublish(achievement.id, achievement.published)}
                  >
                    {achievement.published ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Link href={`/admin/achievements/${achievement.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(achievement.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <strong>Category:</strong> {achievement.category}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Achieved:</strong> {new Date(achievement.achievedAt).toLocaleDateString()}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Status:</strong>{" "}
                    <span className={achievement.published ? "text-green-600" : "text-yellow-600"}>
                      {achievement.published ? "Published" : "Draft"}
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

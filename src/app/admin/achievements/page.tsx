"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Temporary mock data
const achievements = [
  {
    id: "1",
    title: "First Place - Hackathon 2024",
    category: "Hackathon",
    achievedAt: "2024-06-15",
    published: true,
  },
];

export default function AchievementsPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Achievement deleted successfully!");
      setIsLoading(false);
    }, 500);
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success(`Achievement ${currentStatus ? "unpublished" : "published"}!`);
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

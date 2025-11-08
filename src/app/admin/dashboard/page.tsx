"use client";

import { useStats } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LottieLoader } from "@/components/admin/lottie-loader";
import { FolderKanban, FileText, GraduationCap, Award, Trophy, Eye } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LottieLoader size={100} />
      </div>
    );
  }

  const statCards = [
    {
      title: "Projects",
      value: stats?.projects?.total || 0,
      subtitle: `${stats?.projects?.published || 0} published`,
      icon: FolderKanban,
      color: "text-blue-600",
    },
    {
      title: "Blog Posts",
      value: stats?.blogPosts?.total || 0,
      subtitle: `${stats?.blogPosts?.published || 0} published`,
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Research Papers",
      value: stats?.research?.total || 0,
      subtitle: `${stats?.research?.published || 0} published`,
      icon: GraduationCap,
      color: "text-purple-600",
    },
    {
      title: "Certifications",
      value: stats?.certifications?.total || 0,
      subtitle: "Professional credentials",
      icon: Award,
      color: "text-orange-600",
    },
    {
      title: "Achievements",
      value: stats?.achievements?.total || 0,
      subtitle: "Awards & milestones",
      icon: Trophy,
      color: "text-yellow-600",
    },
    {
      title: "Total Views",
      value: stats?.totalViews || 0,
      subtitle: "Across all content",
      icon: Eye,
      color: "text-cyan-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your portfolio.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                No recent activity to display. Start by creating or editing content.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <a
                href="/admin/projects/new"
                className="rounded-lg border p-3 text-sm font-medium hover:bg-accent"
              >
                + Create New Project
              </a>
              <a
                href="/admin/blog/new"
                className="rounded-lg border p-3 text-sm font-medium hover:bg-accent"
              >
                + Write Blog Post
              </a>
              <a
                href="/admin/research/new"
                className="rounded-lg border p-3 text-sm font-medium hover:bg-accent"
              >
                + Add Research Paper
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

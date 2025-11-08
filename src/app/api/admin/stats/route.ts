import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();

    const [
      projectsTotal,
      projectsPublished,
      blogPostsTotal,
      blogPostsPublished,
      researchTotal,
      researchPublished,
      certificationsTotal,
      achievementsTotal,
      totalBlogViews,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.research.count(),
      prisma.research.count({ where: { published: true } }),
      prisma.certification.count(),
      prisma.achievement.count(),
      prisma.blogPost.aggregate({ _sum: { viewCount: true } }),
    ]);

    return NextResponse.json({
      projects: { total: projectsTotal, published: projectsPublished },
      blogPosts: { total: blogPostsTotal, published: blogPostsPublished },
      research: { total: researchTotal, published: researchPublished },
      certifications: { total: certificationsTotal },
      achievements: { total: achievementsTotal },
      totalViews: totalBlogViews._sum.viewCount || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
}

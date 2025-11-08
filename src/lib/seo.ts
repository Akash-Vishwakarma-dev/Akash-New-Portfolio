import type { NextSeoProps } from "next-seo";

const config: NextSeoProps = {
  defaultTitle: "Abhay Soni | Full Stack Developer & AI Engineer",
  titleTemplate: "%s | Abhay Soni",
  description:
    "Portfolio of Abhay Soni - Full Stack Developer, AI/ML Engineer, and Open Source Contributor. Explore projects, blog posts, research, and achievements.",
  canonical: "https://abhaysoni.dev",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abhaysoni.dev",
    siteName: "Abhay Soni Portfolio",
    title: "Abhay Soni | Full Stack Developer & AI Engineer",
    description:
      "Portfolio showcasing projects, blog posts, research papers, and professional achievements in software development and AI/ML.",
    images: [
      {
        url: "https://abhaysoni.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Abhay Soni Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    handle: "@abhaysoni",
    site: "@abhaysoni",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      name: "keywords",
      content:
        "full stack developer, AI engineer, machine learning, web development, React, Next.js, TypeScript, Python, portfolio",
    },
    {
      name: "author",
      content: "Abhay Soni",
    },
    {
      httpEquiv: "x-ua-compatible",
      content: "IE=edge",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
  ],
};

export default config;

/**
 * Generate SEO config for project pages
 */
export function getProjectSEO(project: {
  title: string;
  summary: string;
  slug: string;
  coverImage?: string;
}) {
  return {
    title: project.title,
    description: project.summary,
    canonical: `https://abhaysoni.dev/projects/${project.slug}`,
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `https://abhaysoni.dev/projects/${project.slug}`,
      type: "article",
      images: project.coverImage
        ? [
            {
              url: project.coverImage,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : undefined,
    },
  };
}

/**
 * Generate SEO config for blog posts
 */
export function getBlogSEO(post: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}) {
  return {
    title: post.title,
    description: post.excerpt,
    canonical: `https://abhaysoni.dev/blog/${post.slug}`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://abhaysoni.dev/blog/${post.slug}`,
      type: "article",
      article: {
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: ["Abhay Soni"],
      },
      images: post.coverImage
        ? [
            {
              url: post.coverImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
  };
}

import type { NextSeoProps } from "next-seo/pages";

const SITE_URL = "https://akash-portfolio-b1529.web.app";

const config: NextSeoProps = {
  defaultTitle: "Akash Vishwakarma | Full Stack Developer & AI Engineer",
  titleTemplate: "%s | Akash Vishwakarma",
  description:
    "Portfolio of Akash Vishwakarma - Full Stack Developer, AI/ML Engineer, and Open Source Contributor. Explore projects, blog posts, research, and achievements.",
  canonical: `${SITE_URL}/`,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/`,
    siteName: "Akash Vishwakarma Portfolio",
    title: "Akash Vishwakarma | Full Stack Developer & AI Engineer",
    description:
      "Portfolio showcasing projects, blog posts, research papers, and professional achievements in software development and AI/ML.",
    images: [
      {
        url: `${SITE_URL}/favicon.ico`,
        width: 1200,
        height: 630,
        alt: "Akash Vishwakarma Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    handle: "@Er_Akash__",
    site: "@Er_Akash__",
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
      content: "Akash Vishwakarma",
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
    canonical: `${SITE_URL}/projects/${project.slug}`,
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `${SITE_URL}/projects/${project.slug}`,
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
    canonical: `${SITE_URL}/blog/${post.slug}`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      article: {
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: ["Akash Vishwakarma"],
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

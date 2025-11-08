"use client";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiNodedotjs,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiTensorflow,
  SiPytorch,
  SiOpenai,
  SiAmazon,
  SiVercel,
  SiPrisma,
  SiRedis,
  SiGraphql,
  SiExpress,
  SiFastapi,
  SiFlask,
  SiDjango,
  SiVuedotjs,
  SiAngular,
  SiSvelte,
  SiFirebase,
  SiSupabase,
  SiStripe,
  SiFramer,
  SiGithub,
  SiGitlab,
  SiJira,
  SiFigma,
} from "react-icons/si";
import { IconType } from "react-icons";

interface TechIconProps {
  name: string;
  size?: number;
  className?: string;
}

const techIconMap: Record<string, { icon: IconType; color: string }> = {
  // Frontend
  react: { icon: SiReact, color: "#61DAFB" },
  "next.js": { icon: SiNextdotjs, color: "#000000" },
  nextjs: { icon: SiNextdotjs, color: "#000000" },
  typescript: { icon: SiTypescript, color: "#3178C6" },
  javascript: { icon: SiJavascript, color: "#F7DF1E" },
  tailwind: { icon: SiTailwindcss, color: "#06B6D4" },
  "tailwind css": { icon: SiTailwindcss, color: "#06B6D4" },
  vue: { icon: SiVuedotjs, color: "#4FC08D" },
  "vue.js": { icon: SiVuedotjs, color: "#4FC08D" },
  angular: { icon: SiAngular, color: "#DD0031" },
  svelte: { icon: SiSvelte, color: "#FF3E00" },
  framer: { icon: SiFramer, color: "#0055FF" },
  "framer motion": { icon: SiFramer, color: "#0055FF" },

  // Backend
  python: { icon: SiPython, color: "#3776AB" },
  "node.js": { icon: SiNodedotjs, color: "#339933" },
  nodejs: { icon: SiNodedotjs, color: "#339933" },
  express: { icon: SiExpress, color: "#000000" },
  "express.js": { icon: SiExpress, color: "#000000" },
  fastapi: { icon: SiFastapi, color: "#009688" },
  flask: { icon: SiFlask, color: "#000000" },
  django: { icon: SiDjango, color: "#092E20" },

  // Databases
  mongodb: { icon: SiMongodb, color: "#47A248" },
  postgresql: { icon: SiPostgresql, color: "#4169E1" },
  postgres: { icon: SiPostgresql, color: "#4169E1" },
  prisma: { icon: SiPrisma, color: "#2D3748" },
  redis: { icon: SiRedis, color: "#DC382D" },
  firebase: { icon: SiFirebase, color: "#FFCA28" },
  supabase: { icon: SiSupabase, color: "#3ECF8E" },

  // AI/ML
  tensorflow: { icon: SiTensorflow, color: "#FF6F00" },
  pytorch: { icon: SiPytorch, color: "#EE4C2C" },
  openai: { icon: SiOpenai, color: "#412991" },
  "machine learning": { icon: SiTensorflow, color: "#FF6F00" },
  "deep learning": { icon: SiPytorch, color: "#EE4C2C" },

  // DevOps & Tools
  docker: { icon: SiDocker, color: "#2496ED" },
  git: { icon: SiGit, color: "#F05032" },
  github: { icon: SiGithub, color: "#181717" },
  gitlab: { icon: SiGitlab, color: "#FC6D26" },
  aws: { icon: SiAmazon, color: "#FF9900" },
  vercel: { icon: SiVercel, color: "#000000" },
  graphql: { icon: SiGraphql, color: "#E10098" },
  stripe: { icon: SiStripe, color: "#008CDD" },
  jira: { icon: SiJira, color: "#0052CC" },
  figma: { icon: SiFigma, color: "#F24E1E" },
};

export function TechIcon({ name, size = 24, className = "" }: TechIconProps) {
  const normalizedName = name.toLowerCase().trim();
  const techData = techIconMap[normalizedName];

  if (!techData) {
    // Fallback for unknown tech
    return (
      <span
        className={`inline-flex items-center justify-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium ${className}`}
      >
        {name}
      </span>
    );
  }

  const Icon = techData.icon;

  return (
    <Icon
      size={size}
      className={className}
      style={{ color: techData.color }}
      title={name}
    />
  );
}

// Tech badge with icon and name
export function TechBadge({ name, size = 16 }: TechIconProps) {
  const normalizedName = name.toLowerCase().trim();
  const techData = techIconMap[normalizedName];

  if (!techData) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
        {name}
      </span>
    );
  }

  const Icon = techData.icon;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium transition-colors hover:bg-accent">
      <Icon size={size} style={{ color: techData.color }} />
      {name}
    </span>
  );
}

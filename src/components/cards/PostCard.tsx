"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, Eye } from "lucide-react";
import type { BlogPost } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: BlogPost;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
          {post.coverImage && (
            <div className="relative aspect-[2/1] overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            </div>
          )}
          
          <CardHeader>
            <div className="mb-2 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
            <CardTitle className="line-clamp-2 font-heading text-xl">
              {post.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {post.viewCount} views
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

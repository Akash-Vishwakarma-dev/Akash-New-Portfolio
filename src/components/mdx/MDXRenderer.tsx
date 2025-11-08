"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MDXRendererProps {
  content: string;
  className?: string;
}

export function MDXRenderer({ content, className = "" }: MDXRendererProps) {
  // Simple markdown-to-HTML converter (basic implementation)
  // For production, use @next/mdx or react-markdown
  
  const renderContent = () => {
    // Basic markdown parsing
    let html = content;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold mt-10 mb-6">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold mt-12 mb-8">$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-muted p-4 rounded-lg overflow-x-auto my-6"><code class="text-sm">$2</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm">$1</code>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 list-decimal">$1</li>');
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    html = '<p class="mb-4">' + html + '</p>';
    
    return { __html: html };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`prose prose-lg dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={renderContent()}
    />
  );
}

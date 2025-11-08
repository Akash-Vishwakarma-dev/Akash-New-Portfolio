"use client";

import { motion } from "framer-motion";
import { FileText, Download, ExternalLink } from "lucide-react";
import type { Research } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface ResearchCardProps {
  research: Research;
  index?: number;
}

export function ResearchCard({ research, index = 0 }: ResearchCardProps) {
  const downloadBibTeX = () => {
    const bibtex = `@article{${research.title.toLowerCase().replace(/\s+/g, '_')}_${research.year},
  title={${research.title}},
  author={${research.authors.join(' and ')}},
  year={${research.year}},
  journal={${research.venue}},
  ${research.doi ? `doi={${research.doi}},` : ''}
}`;
    const blob = new Blob([bibtex], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${research.title.replace(/\s+/g, '_')}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="mb-2 flex items-start justify-between">
            <Badge variant="secondary">{research.year}</Badge>
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="font-heading text-lg">
            {research.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{research.venue}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {research.abstract}
          </p>

          <div className="flex flex-wrap gap-2">
            {research.keywords.slice(0, 5).map((keyword) => (
              <Badge key={keyword} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            {research.authors.join(", ")}
          </p>

          <div className="flex flex-wrap gap-2">
            {research.pdfUrl && (
              <Button size="sm" variant="outline" asChild>
                <a
                  href={research.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-1 h-3 w-3" />
                  PDF
                </a>
              </Button>
            )}
            {research.doi && (
              <Button size="sm" variant="outline" asChild>
                <a
                  href={`https://doi.org/${research.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-1 h-3 w-3" />
                  DOI
                </a>
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={downloadBibTeX}>
              <Download className="mr-1 h-3 w-3" />
              BibTeX
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

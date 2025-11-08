"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Award, ExternalLink, Download } from "lucide-react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { getResearch } from "@/lib/api";
import type { Research } from "@/lib/api";

export default function ResearchPage() {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResearch()
      .then(setResearch)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const downloadBibTeX = (paper: Research) => {
    const bibtex = `@article{${paper.title.toLowerCase().replace(/\s+/g, "_")}_${paper.year},
  title={${paper.title}},
  author={${paper.authors.join(" and ")}},
  journal={${paper.venue}},
  year={${paper.year}},
  ${paper.doi ? `doi={${paper.doi}},` : ""}
}`;

    const blob = new Blob([bibtex], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${paper.title.replace(/\s+/g, "_")}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <LoaderOverlay isLoading={loading} message="Loading research..." />

      <div className="min-h-screen">
        {/* Header */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-card/50 to-transparent py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 font-heading text-5xl font-bold md:text-6xl">
                Research & Publications
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Explore my academic contributions, research papers, and publications
                in machine learning, AI, and computer science.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Research Papers */}
        <Section>
          <div className="container mx-auto max-w-6xl px-4">
            {research.length === 0 && !loading ? (
              <div className="text-center text-muted-foreground">
                <FileText className="mx-auto mb-4 h-16 w-16 opacity-20" />
                <p>No publications yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {research.map((paper, index) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                      <div className="p-6">
                        {/* Header */}
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <Badge variant="secondary" className="mb-3">
                              {paper.year}
                            </Badge>
                            <h2 className="mb-2 font-heading text-2xl font-bold">
                              {paper.title}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                              {paper.venue}
                            </p>
                          </div>
                          <Award className="h-6 w-6 flex-shrink-0 text-primary" />
                        </div>

                        {/* Authors */}
                        <p className="mb-4 text-sm text-muted-foreground">
                          {paper.authors.join(", ")}
                        </p>

                        {/* Abstract */}
                        <p className="mb-4 text-muted-foreground line-clamp-3">
                          {paper.abstract}
                        </p>

                        {/* Keywords */}
                        {paper.keywords.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {paper.keywords.slice(0, 5).map((keyword, idx) => (
                              <Badge key={idx} variant="outline">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          {paper.pdfUrl && (
                            <MagneticButton>
                              <Button asChild size="sm">
                                <a
                                  href={paper.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  PDF
                                </a>
                              </Button>
                            </MagneticButton>
                          )}
                          {paper.doi && (
                            <MagneticButton>
                              <Button asChild variant="outline" size="sm">
                                <a
                                  href={`https://doi.org/${paper.doi}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  DOI
                                </a>
                              </Button>
                            </MagneticButton>
                          )}
                          <MagneticButton>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadBibTeX(paper)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              BibTeX
                            </Button>
                          </MagneticButton>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* CTA */}
        <Section className="bg-card/50">
          <div className="container mx-auto max-w-4xl px-4">
            <Card className="border-primary/20 p-8">
              <div className="text-center">
                <h3 className="mb-4 font-heading text-2xl font-bold">
                  Interested in Collaboration?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  I'm always open to discussing research opportunities and
                  collaborations in AI and machine learning.
                </p>
                <MagneticButton>
                  <Button asChild>
                    <a href="/contact">Get in Touch</a>
                  </Button>
                </MagneticButton>
              </div>
            </Card>
          </div>
        </Section>
      </div>
    </>
  );
}

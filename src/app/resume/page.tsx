"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { getLatestResume } from "@/lib/api";
import type { Resume } from "@/lib/api";

export default function ResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestResume()
      .then(setResume)
      .catch((err) => {
        console.error("Failed to load resume:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <LoaderOverlay isLoading={loading} message="Loading resume..." />

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
                Resume
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Download my latest resume or view it directly in your browser.
              </p>

              {resume && (
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <MagneticButton>
                    <Button asChild size="lg">
                      <a
                        href={resume.pdfUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download PDF
                      </a>
                    </Button>
                  </MagneticButton>
                  <MagneticButton>
                    <Button asChild variant="outline" size="lg">
                      <a
                        href={resume.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Open in New Tab
                      </a>
                    </Button>
                  </MagneticButton>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* PDF Viewer */}
        {resume && (
          <Section>
            <div className="container mx-auto max-w-6xl px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative aspect-[8.5/11] min-h-[600px] md:min-h-[800px]">
                    <iframe
                      src={`${resume.pdfUrl}#toolbar=0`}
                      className="h-full w-full border-0"
                      title="Resume PDF"
                    />
                  </div>
                </Card>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>Version: {resume.version}</p>
                  <p>Last Updated: {new Date(resume.uploadedAt).toLocaleDateString()}</p>
                </div>
              </motion.div>
            </div>
          </Section>
        )}

        {!resume && !loading && (
          <Section>
            <div className="container mx-auto max-w-6xl px-4">
              <div className="text-center text-muted-foreground">
                <FileText className="mx-auto mb-4 h-16 w-16 opacity-20" />
                <p>Resume not available at the moment. Please check back later.</p>
              </div>
            </div>
          </Section>
        )}

        {/* CTA */}
        <Section className="bg-card/50">
          <div className="container mx-auto max-w-4xl px-4">
            <Card className="border-primary/20 p-8">
              <div className="text-center">
                <h3 className="mb-4 font-heading text-2xl font-bold">
                  Interested in Working Together?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Let's discuss how I can contribute to your team or project.
                </p>
                <MagneticButton>
                  <Button asChild>
                    <a href="/contact">Contact Me</a>
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

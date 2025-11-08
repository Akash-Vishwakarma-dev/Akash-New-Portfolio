"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { useQuery } from "@tanstack/react-query";
import { getCertifications } from "@/lib/api";
import type { Certification } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

function CertificationsContent() {
  const { data: certifications = [], isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: getCertifications,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
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
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 font-heading text-5xl font-bold md:text-6xl">
                Certifications
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Professional certifications and credentials that validate my expertise
                in various technologies and domains.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Certifications Grid */}
        <Section>
          <div className="container mx-auto max-w-6xl px-4">
            {certifications.length === 0 && !isLoading ? (
              <div className="text-center text-muted-foreground">
                <Award className="mx-auto mb-4 h-16 w-16 opacity-20" />
                <p>No certifications yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                      <div className="p-6">
                        {/* Badge Image */}
                        {cert.badgeUrl && (
                          <div className="mb-4 flex justify-center">
                            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-card">
                              <Image
                                src={cert.badgeUrl}
                                alt={cert.title}
                                fill
                                className="object-contain p-2"
                              />
                            </div>
                          </div>
                        )}

                        {/* Title & Issuer */}
                        <h3 className="mb-2 font-heading text-xl font-bold">
                          {cert.title}
                        </h3>
                        <p className="mb-4 text-sm font-medium text-muted-foreground">
                          {cert.issuer}
                        </p>

                        {/* Description */}
                        {cert.description && (
                          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                            {cert.description}
                          </p>
                        )}

                        {/* Date */}
                        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(cert.issuedAt)}
                            {cert.expiresAt && ` - ${formatDate(cert.expiresAt)}`}
                          </span>
                        </div>

                        {/* Skills */}
                        {cert.skills.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {cert.skills.slice(0, 4).map((skill, idx) => (
                              <Badge key={idx} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                            {cert.skills.length > 4 && (
                              <Badge variant="outline">
                                +{cert.skills.length - 4}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Credential Link */}
                        {cert.credentialUrl && (
                          <MagneticButton>
                            <Button asChild variant="outline" size="sm" className="w-full">
                              <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Credential
                              </a>
                            </Button>
                          </MagneticButton>
                        )}

                        {/* Credential ID */}
                        {cert.credentialId && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            ID: {cert.credentialId}
                          </p>
                        )}
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
                  Want to See More?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Check out my projects and experience to see these skills in action.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <MagneticButton>
                    <Button asChild>
                      <a href="/projects">View Projects</a>
                    </Button>
                  </MagneticButton>
                  <MagneticButton>
                    <Button asChild variant="outline">
                      <a href="/resume">Download Resume</a>
                    </Button>
                  </MagneticButton>
                </div>
              </div>
            </Card>
          </div>
        </Section>
      </div>
  );
}

export default function CertificationsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading certifications...</p>
        </div>
      </div>
    }>
      <CertificationsContent />
    </Suspense>
  );
}

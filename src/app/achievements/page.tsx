"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, ExternalLink, Filter } from "lucide-react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { getAchievements } from "@/lib/api";
import type { Achievement } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    getAchievements({ published: true })
      .then(setAchievements)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = Array.from(
    new Set(achievements.map((a) => a.category))
  ).sort();

  const filteredAchievements = selectedCategory
    ? achievements.filter((a) => a.category === selectedCategory)
    : achievements;

  // Group by year
  const achievementsByYear = filteredAchievements.reduce((acc, achievement) => {
    const year = new Date(achievement.achievedAt).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(achievement);
    return acc;
  }, {} as Record<number, Achievement[]>);

  const years = Object.keys(achievementsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <>
      <LoaderOverlay isLoading={loading} message="Loading achievements..." />

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
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 font-heading text-5xl font-bold md:text-6xl">
                Achievements & Awards
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                A timeline of my professional achievements, awards, and recognition
                received throughout my career.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <Section>
          <div className="container mx-auto max-w-4xl px-4">
            <div className="flex items-center justify-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Timeline */}
        <Section>
          <div className="container mx-auto max-w-4xl px-4">
            {filteredAchievements.length === 0 && !loading ? (
              <div className="text-center text-muted-foreground">
                <Trophy className="mx-auto mb-4 h-16 w-16 opacity-20" />
                <p>No achievements yet. Check back soon!</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 h-full w-px bg-border md:left-1/2" />

                {years.map((year) => (
                  <div key={year} className="mb-12">
                    {/* Year Label */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative mb-8 flex items-center gap-4"
                    >
                      <div className="absolute left-8 -ml-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground md:left-1/2">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <h2 className="ml-20 font-heading text-3xl font-bold md:ml-0 md:w-1/2 md:pr-12 md:text-right">
                        {year}
                      </h2>
                    </motion.div>

                    {/* Achievements for this year */}
                    <div className="space-y-6">
                      {achievementsByYear[year].map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative md:flex md:items-start md:gap-8"
                        >
                          {/* Dot */}
                          <div className="absolute left-8 top-6 -ml-1.5 h-3 w-3 rounded-full bg-primary md:left-1/2" />

                          {/* Card */}
                          <div
                            className={`ml-20 md:ml-0 ${
                              index % 2 === 0
                                ? "md:w-1/2 md:pr-12 md:text-right"
                                : "md:w-1/2 md:pl-12 md:ml-auto"
                            }`}
                          >
                            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                              <div className="p-6">
                                <div
                                  className={`flex items-start gap-4 ${
                                    index % 2 === 0
                                      ? "md:flex-row-reverse md:text-right"
                                      : ""
                                  }`}
                                >
                                  <div className="flex-1">
                                    <Badge variant="secondary" className="mb-3">
                                      {achievement.category}
                                    </Badge>
                                    <h3 className="mb-2 font-heading text-xl font-bold">
                                      {achievement.title}
                                    </h3>
                                    <p className="mb-3 text-sm text-muted-foreground">
                                      {formatDate(achievement.achievedAt)}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {achievement.description}
                                    </p>
                                    {achievement.url && (
                                      <div className="mt-4">
                                        <MagneticButton>
                                          <Button asChild variant="outline" size="sm">
                                            <a
                                              href={achievement.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              <ExternalLink className="mr-2 h-4 w-4" />
                                              Learn More
                                            </a>
                                          </Button>
                                        </MagneticButton>
                                      </div>
                                    )}
                                  </div>
                                  <Trophy className="h-6 w-6 flex-shrink-0 text-primary" />
                                </div>
                              </div>
                            </Card>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
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
                  Impressed?
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Let's work together on your next project and create something
                  amazing.
                </p>
                <MagneticButton>
                  <Button asChild>
                    <a href="/contact">Start a Conversation</a>
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

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Code2, Zap, Users, Target } from "lucide-react";
import { Section } from "@/components/Section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { ParallaxContainer } from "@/components/fx/ParallaxContainer";
import { TechBadge } from "@/components/TechIcon";

const skills = [
  "Python",
  "TensorFlow",
  "PyTorch",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "AWS",
  "Tailwind CSS",
];

const values = [
  {
    icon: Code2,
    title: "Clean Code",
    description: "Writing maintainable, scalable, and well-documented code that stands the test of time.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Constantly exploring new technologies and approaches to solve complex problems.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Building strong relationships and working effectively with diverse teams.",
  },
  {
    icon: Target,
    title: "Impact",
    description: "Focusing on creating solutions that make a real difference in people's lives.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="mb-6 font-heading text-5xl font-bold md:text-6xl">
                About Me
              </h1>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Hi, I'm <span className="font-semibold text-foreground">Akash Vishwakarma</span>, 
                  a passionate software engineer specializing in artificial 
                  intelligence and machine learning.
                </p>
                <p>
                  With a strong foundation in computer science and years of hands-on 
                  experience, I've worked on projects ranging from cutting-edge AI research 
                  to production-scale web applications.
                </p>
                <p>
                  I'm driven by curiosity and a desire to create technology that solves 
                  real-world problems. When I'm not coding, you'll find me exploring new 
                  frameworks, contributing to open source, or mentoring aspiring developers.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <MagneticButton>
                  <Button asChild size="lg">
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/resume">View Resume</Link>
                  </Button>
                </MagneticButton>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ParallaxContainer speed={0.2}>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
                  <Image
                    src="/images/Photo.jpg"
                    alt="Akash Vishwakarma profile photo"
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, 80vw"
                    className="object-cover"
                  />
                </div>
              </ParallaxContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <Section className="bg-card/50">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
              Skills & Expertise
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
              A curated selection of technologies and frameworks I work with regularly.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TechBadge name={skill} size={18} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Values */}
      <Section>
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
              What I Value
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              The principles that guide my work and professional relationships.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full p-6 transition-shadow hover:shadow-lg">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-heading text-xl font-bold">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Timeline (Optional - Placeholder) */}
      <Section className="bg-card/50">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
              My Journey
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">
              Key milestones in my professional career.
            </p>

            <div className="space-y-8 text-left">
              {[
                {
                  year: "2026",
                  title: "Full-Stack Developer & AI Researcher",
                  description: "Building production-scale AI applications and contributing to research in NLP and Computer Vision.",
                },
                {
                  year: "2026",
                  title: "Software Engineer",
                  description: "Developed web applications and microservices for enterprise clients.",
                },
                {
                  year: "2026",
                  title: "Computer Science Graduate",
                  description: "Earned degree with specialization in Artificial Intelligence and Machine Learning.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <Badge variant="secondary" className="mt-1">
                        {item.year}
                      </Badge>
                      <div>
                        <h3 className="mb-2 font-heading text-xl font-bold">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="border-primary/20 p-8">
            <div className="text-center">
              <h3 className="mb-4 font-heading text-2xl font-bold">
                Let's Build Something Great
              </h3>
              <p className="mb-6 text-muted-foreground">
                I'm always interested in new opportunities and collaborations.
                Feel free to reach out!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <MagneticButton>
                  <Button asChild size="lg">
                    <Link href="/contact">Contact Me</Link>
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/projects">View Projects</Link>
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

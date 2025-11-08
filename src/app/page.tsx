"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Mail, Code2, Zap, Users, Target, Award, Trophy, Calendar, ExternalLink } from "lucide-react";
import Lottie from "lottie-react";
import { MorphBlob } from "@/components/fx/MorphBlob";
import { ParallaxContainer } from "@/components/fx/ParallaxContainer";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { Section } from "@/components/Section";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { PostCard } from "@/components/cards/PostCard";
import { ResearchCard } from "@/components/cards/ResearchCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { getProjects, getBlogPosts, getResearch, getAchievements, getCertifications } from "@/lib/api";
import { scrollTo } from "@/components/SmoothScrollProvider";
import type { Project, BlogPost, Research, Achievement, Certification } from "@/lib/api";
import { TechIcon, TechBadge } from "@/components/TechIcon";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

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

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [research, setResearch] = useState<Research[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroAnimation, setHeroAnimation] = useState<any>(null);

  useEffect(() => {
    // Load Lottie hero animation
    fetch("/animations/hero-accent.json")
      .then((res) => res.json())
      .then(setHeroAnimation)
      .catch(console.error);

    // Fetch data with better error handling
    Promise.allSettled([
      getProjects().catch(() => []),
      getBlogPosts({ published: true }).catch(() => []),
      getResearch().catch(() => []),
      getAchievements({ published: true }).catch(() => []),
      getCertifications().catch(() => []),
    ])
      .then((results) => {
        const [projectsResult, postsResult, researchResult, achievementsResult, certificationsResult] = results;
        
        setProjects(projectsResult.status === 'fulfilled' ? projectsResult.value : []);
        setPosts(postsResult.status === 'fulfilled' ? postsResult.value : []);
        setResearch(researchResult.status === 'fulfilled' ? researchResult.value : []);
        setAchievements(achievementsResult.status === 'fulfilled' ? achievementsResult.value : []);
        setCertifications(certificationsResult.status === 'fulfilled' ? certificationsResult.value : []);
      })
      .catch((err) => {
        console.error("Failed to load homepage data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <LoaderOverlay isLoading={loading} message="Loading portfolio..." />

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-card/20">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Gradient Orbs */}
        <div className="absolute -left-48 -top-48 -z-10 h-96 w-96 animate-pulse rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -right-48 top-1/2 -z-10 h-96 w-96 animate-pulse rounded-full bg-accent/20 blur-3xl animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 -z-10 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-3xl animation-delay-4000" />

        {/* Morphing Blob */}
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 opacity-40">
          <MorphBlob
            width={800}
            height={800}
            fillClassName="fill-primary/30 dark:fill-primary/20"
          />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute left-[10%] top-[20%] -z-10 h-2 w-2 rounded-full bg-primary/40"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-[15%] top-[30%] -z-10 h-3 w-3 rounded-full bg-accent/40"
          animate={{
            y: [0, 30, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute left-[70%] top-[60%] -z-10 h-2 w-2 rounded-full bg-primary/30"
          animate={{
            y: [0, -25, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Hero Lottie Accent */}
        {heroAnimation && (
          <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-10">
            <Lottie animationData={heroAnimation} loop autoplay />
          </div>
        )}

        <div className="container mx-auto flex min-h-screen items-center px-4 py-20">
          <div className="grid w-full gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              {/* Greeting Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                <span className="text-sm font-medium">Available for opportunities</span>
              </motion.div>

              <motion.h1
                className="mb-6 font-heading text-6xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Hi, I'm{" "}
                <motion.span
                  className="relative inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% auto",
                  }}
                >
                  Abhay Soni
                  <motion.span
                    className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-primary via-accent to-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </motion.span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8 space-y-2"
              >
                <p className="text-2xl font-semibold text-foreground sm:text-3xl">
                  Full Stack Developer & AI Engineer
                </p>
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {["React", "Next.js", "Python", "TypeScript", "TensorFlow"].map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-card/50 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
                    >
                      <TechIcon name={tech} size={14} />
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>

              <motion.p
                className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Building <span className="font-semibold text-foreground">innovative web applications</span> and{" "}
                <span className="font-semibold text-foreground">AI solutions</span> that solve
                real-world problems. Passionate about clean code, open source,
                and cutting-edge technology.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <MagneticButton intensity={0.4}>
                  <Button size="lg" className="group relative overflow-hidden shadow-lg" onClick={() => scrollTo("#projects", { duration: 1.5 })}>
                    <span className="relative z-10 flex items-center">
                      View Projects
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <motion.span
                      className="absolute inset-0 -z-0 bg-gradient-to-r from-primary to-accent"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </MagneticButton>

                <MagneticButton intensity={0.4}>
                  <Button size="lg" variant="outline" className="group shadow-lg backdrop-blur-sm" onClick={() => scrollTo("#contact", { duration: 1.5 })}>
                    <Mail className="mr-2 h-5 w-5" />
                    Contact
                  </Button>
                </MagneticButton>
              </motion.div>

              <motion.div
                className="mt-10 flex items-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="text-sm font-medium text-muted-foreground">Connect:</span>
                <div className="flex gap-3">
                  <MagneticButton intensity={0.5}>
                    <a
                      href="https://github.com/abhaysoni007"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary hover:bg-primary/10 hover:shadow-lg"
                    >
                      <Github className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </a>
                  </MagneticButton>
                  <MagneticButton intensity={0.5}>
                    <a
                      href="https://linkedin.com/in/abhaysoni"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary hover:bg-primary/10 hover:shadow-lg"
                    >
                      <Linkedin className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </a>
                  </MagneticButton>
                  <MagneticButton intensity={0.5}>
                    <a
                      href="mailto:yuvrajsoni411@gmail.com"
                      className="group flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary hover:bg-primary/10 hover:shadow-lg"
                    >
                      <Mail className="h-5 w-5 transition-transform group-hover:scale-110" />
                    </a>
                  </MagneticButton>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <ParallaxContainer speed={0.2}>
                <div className="relative aspect-square">
                  {/* Glowing Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-accent/30 to-primary/30 blur-2xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  {/* Main Card */}
                  <motion.div
                    className="relative h-full w-full rounded-3xl border border-primary/20 bg-gradient-to-br from-card/90 via-card/50 to-card/90 p-8 shadow-2xl backdrop-blur-xl"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Code Symbol with Animation */}
                    <div className="flex h-full flex-col items-center justify-center gap-8">
                      <motion.div
                        className="relative text-9xl font-bold"
                        animate={{
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <span className="bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent">
                          &lt;/&gt;
                        </span>
                        
                        {/* Orbiting Dots */}
                        <motion.div
                          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <div className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-primary shadow-lg shadow-primary/50" />
                          <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-accent shadow-lg shadow-accent/50" />
                        </motion.div>
                      </motion.div>

                      {/* Stats */}
                      <div className="grid w-full grid-cols-3 gap-4 text-center">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="rounded-xl border border-primary/20 bg-background/50 p-3 backdrop-blur-sm"
                        >
                          <div className="text-2xl font-bold text-primary">50+</div>
                          <div className="text-xs text-muted-foreground">Projects</div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                          className="rounded-xl border border-accent/20 bg-background/50 p-3 backdrop-blur-sm"
                        >
                          <div className="text-2xl font-bold text-accent">5+</div>
                          <div className="text-xs text-muted-foreground">Years</div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 }}
                          className="rounded-xl border border-primary/20 bg-background/50 p-3 backdrop-blur-sm"
                        >
                          <div className="text-2xl font-bold text-primary">100%</div>
                          <div className="text-xs text-muted-foreground">Passion</div>
                        </motion.div>
                      </div>

                      {/* Tags */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        className="flex flex-wrap justify-center gap-2"
                      >
                        <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium">
                          Innovation
                        </span>
                        <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium">
                          Quality
                        </span>
                        <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium">
                          Performance
                        </span>
                      </motion.div>
                    </div>

                    {/* Corner Accents */}
                    <div className="absolute -left-2 -top-2 h-20 w-20 rounded-tl-3xl border-l-2 border-t-2 border-primary/40" />
                    <div className="absolute -bottom-2 -right-2 h-20 w-20 rounded-br-3xl border-b-2 border-r-2 border-primary/40" />
                  </motion.div>
                </div>
              </ParallaxContainer>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          onClick={() => scrollTo("#about", { duration: 1.5 })}
          whileHover={{ scale: 1.1 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Explore More</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary/50 bg-primary/5 p-1"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="h-2 w-2 rounded-full bg-primary"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <Section id="about">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 font-heading text-4xl font-bold md:text-5xl">
                About Me
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Hi, I'm <span className="font-semibold text-foreground">Abhay Soni</span>, 
                  a passionate software engineer and researcher specializing in artificial 
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
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <ParallaxContainer speed={0.2}>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4 text-6xl">👨‍💻</div>
                      <p className="text-muted-foreground">Professional Photo</p>
                    </div>
                  </div>
                </div>
              </ParallaxContainer>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Skills & Expertise */}
      <Section className="bg-card/50" id="skills">
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

      {/* Projects */}
      {projects.length > 0 && (
        <Section className="bg-card/50" id="projects">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 font-heading text-4xl font-bold">
                Projects
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                A showcase of my work in full-stack development, AI/ML integration, and modern web technologies.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <Section id="certifications">
          <div className="container mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-4 font-heading text-4xl font-bold">
                Certifications
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Professional certifications and credentials that validate my expertise in various technologies.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certifications.slice(0, 6).map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                    <div className="p-6">
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

                      <h3 className="mb-2 font-heading text-xl font-bold">
                        {cert.title}
                      </h3>
                      <p className="mb-4 text-sm font-medium text-muted-foreground">
                        {cert.issuer}
                      </p>

                      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(cert.issuedAt)}</span>
                      </div>

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
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <Section className="bg-card/50" id="achievements">
          <div className="container mx-auto max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-4 font-heading text-4xl font-bold">
                Achievements & Awards
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Recognition and awards received throughout my career.
              </p>
            </motion.div>

            <div className="space-y-6">
              {achievements.slice(0, 5).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <Trophy className="h-6 w-6 flex-shrink-0 text-primary" />
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
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Blog Posts */}
      {posts.length > 0 && (
        <Section id="blog">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 font-heading text-4xl font-bold">
                Latest from the Blog
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Thoughts on software development, AI/ML, and technology trends.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Research */}
      {research.length > 0 && (
        <Section className="bg-card/50" id="research">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 font-heading text-4xl font-bold">
                Research & Publications
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Academic contributions and research in AI/ML and computer science.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {research.slice(0, 2).map((item, index) => (
                <ResearchCard key={item.id} research={item} index={index} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Contact Section */}
      <Section id="contact">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-primary/20">
            <CardContent className="p-12">
              <div className="text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-4 font-heading text-3xl font-bold"
                >
                  Let's Work Together
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="mx-auto mb-8 max-w-2xl text-muted-foreground"
                >
                  I'm always open to new opportunities, collaborations, and
                  interesting projects. Let's build something amazing together!
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <MagneticButton intensity={0.3}>
                    <Button size="lg" asChild>
                      <a href="mailto:yuvrajsoni411@gmail.com">
                        <Mail className="mr-2 h-5 w-5" />
                        Email Me
                      </a>
                    </Button>
                  </MagneticButton>
                  <MagneticButton intensity={0.3}>
                    <Button size="lg" variant="outline" asChild>
                      <a
                        href="https://github.com/abhaysoni007"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-5 w-5" />
                        GitHub
                      </a>
                    </Button>
                  </MagneticButton>
                  <MagneticButton intensity={0.3}>
                    <Button size="lg" variant="outline" asChild>
                      <a
                        href="https://linkedin.com/in/abhaysoni"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedin className="mr-2 h-5 w-5" />
                        LinkedIn
                      </a>
                    </Button>
                  </MagneticButton>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </>
  );
}

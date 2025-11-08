"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, ArrowUp, ShieldCheck } from "lucide-react";
import { MagneticButton } from "./fx/MagneticButton";
import { scrollTo } from "./SmoothScrollProvider";
import { Button } from "./ui/button";

const socialLinks = [
  { href: "https://github.com/abhaysoni007", icon: Github, label: "GitHub" },
  { href: "https://linkedin.com/in/abhaysoni", icon: Linkedin, label: "LinkedIn" },
  { href: "https://twitter.com/abhaysoni", icon: Twitter, label: "Twitter" },
  { href: "mailto:yuvrajsoni411@gmail.com", icon: Mail, label: "Email" },
];

const footerLinks = [
  { href: "#about", label: "About", isAnchor: true },
  { href: "#skills", label: "Skills", isAnchor: true },
  { href: "#projects", label: "Projects", isAnchor: true },
  { href: "#certifications", label: "Certifications", isAnchor: true },
  { href: "#achievements", label: "Achievements", isAnchor: true },
  { href: "#blog", label: "Blog", isAnchor: true },
  { href: "#research", label: "Research", isAnchor: true },
  { href: "/gallery", label: "Gallery", isAnchor: false },
  { href: "/resume", label: "Resume", isAnchor: false },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollTo(href, { duration: 1.5 });
    }
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Abhay Soni</h3>
            <p className="text-sm text-muted-foreground">
              Full Stack Developer & AI Engineer passionate about building
              innovative solutions and contributing to open source.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  {link.isAnchor ? (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-muted-foreground transition-colors hover:text-primary cursor-pointer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="mb-4 font-semibold">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <MagneticButton key={link.href} intensity={0.3}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent"
                    aria-label={link.label}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                </MagneticButton>
              ))}
              
              {/* Admin Login */}
              <MagneticButton intensity={0.3}>
                <Link
                  href="/admin/login"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent hover:border-primary group"
                  aria-label="Admin Login"
                  title="Admin Login"
                >
                  <ShieldCheck className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          {/* Back to Top */}
          <div className="mb-4">
            <MagneticButton>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollTo(0, { duration: 1.5 })}
                className="gap-2"
              >
                <ArrowUp className="h-4 w-4" />
                Back to Top
              </Button>
            </MagneticButton>
          </div>

          <p className="text-sm text-muted-foreground">
            © {currentYear} Abhay Soni. All rights reserved. Built with Next.js,
            TypeScript, and Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}

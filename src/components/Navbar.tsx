"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MagneticButton } from "./fx/MagneticButton";
import { scrollTo } from "./SmoothScrollProvider";

const navItems = [
  { href: "#about", label: "About", page: null },
  { href: "#skills", label: "Skills", page: null },
  { href: "/projects", label: "Projects", page: "/projects", section: "#projects" },
  { href: "/certifications", label: "Certifications", page: "/certifications", section: "#certifications" },
  { href: "/blog", label: "Blog", page: "/blog", section: "#blog" },
  { href: "/contact", label: "Contact", page: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    // If item has a dedicated page, navigate to it
    if (item.page) {
      router.push(item.page);
    } 
    // If on homepage and has section, scroll to it
    else if (pathname === "/" && item.href.startsWith("#")) {
      scrollTo(item.href, { duration: 1.5 });
    }
    // Otherwise, go to homepage and scroll to section
    else if (item.href.startsWith("#")) {
      router.push("/" + item.href);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <MagneticButton 
          intensity={0.2}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AV
          </span>
        </MagneticButton>

        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className="relative text-sm font-medium transition-colors hover:text-primary text-muted-foreground cursor-pointer"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg border border-border bg-background transition-colors hover:bg-accent"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <ul className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className="block py-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground cursor-pointer"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

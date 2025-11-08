"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLottie } from "@/lib/lottie";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !resolvedTheme) return;

    // Use direct path since toggle-dark.json and toggle-light.json don't need theme suffix
    const animationPath = resolvedTheme === "dark" 
      ? "/animations/toggle-dark.json"
      : "/animations/toggle-light.json";
      
    fetch(animationPath)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(setAnimationData)
      .catch((err) => {
        console.error("Failed to load theme toggle animation:", err);
        setAnimationData(null); // Fallback to icon
      });
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return (
      <button
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:bg-accent transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      <AnimatePresence mode="wait">
        {animationData ? (
          <motion.div
            key={resolvedTheme}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="h-6 w-6"
          >
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </motion.div>
        ) : (
          <motion.div
            key={resolvedTheme}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {resolvedTheme === "dark" ? (
              <Moon className="h-5 w-5 text-primary" />
            ) : (
              <Sun className="h-5 w-5 text-primary" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

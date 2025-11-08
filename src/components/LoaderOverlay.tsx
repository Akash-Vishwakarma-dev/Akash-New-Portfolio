"use client";

import { LottieThemed } from "./LottieThemed";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoaderOverlay({ isLoading, message }: LoaderOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <LottieThemed name="loader" size={120} loop={true} />
          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              {message}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

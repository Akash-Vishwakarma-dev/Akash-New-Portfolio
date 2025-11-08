"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Image from "next/image";
import { Section } from "@/components/Section";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { getGallery } from "@/lib/api";
import type { MediaItem } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function GalleryPage() {
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  useEffect(() => {
    getGallery()
      .then(setGallery)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const currentIndex = selectedImage
    ? gallery.findIndex((item) => item.id === selectedImage.id)
    : -1;

  const handleNext = () => {
    if (currentIndex < gallery.length - 1) {
      setSelectedImage(gallery[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(gallery[currentIndex - 1]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, currentIndex]);

  return (
    <>
      <LoaderOverlay isLoading={loading} message="Loading gallery..." />

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
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 font-heading text-5xl font-bold md:text-6xl">
                Gallery
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                A visual journey through my projects, events, and memorable moments.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Masonry Grid */}
        <Section>
          <div className="container mx-auto max-w-7xl px-4">
            {gallery.length === 0 && !loading ? (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="mx-auto mb-4 h-16 w-16 opacity-20" />
                <p>No images yet. Check back soon!</p>
              </div>
            ) : (
              <div className="columns-1 gap-4 md:columns-2 lg:columns-3 xl:columns-4">
                {gallery.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-lg bg-card transition-transform hover:scale-[1.02]"
                    onClick={() => setSelectedImage(item)}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={item.url}
                        alt={item.caption || "Gallery image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    {item.caption && (
                      <div className="p-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.caption}
                        </p>
                        {item.capturedAt && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.capturedAt)}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setSelectedImage(null)}
            >
              {/* Close Button */}
              <button
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6" />
              </button>

              {/* Navigation */}
              {currentIndex > 0 && (
                <button
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {currentIndex < gallery.length - 1 && (
                <button
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}

              {/* Image */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-h-[90vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.caption || "Gallery image"}
                  width={1200}
                  height={800}
                  className="h-auto max-h-[90vh] w-auto object-contain"
                  priority
                />

                {/* Caption */}
                {selectedImage.caption && (
                  <div className="mt-4 text-center">
                    <p className="text-white">{selectedImage.caption}</p>
                    {selectedImage.capturedAt && (
                      <p className="mt-1 flex items-center justify-center gap-1 text-sm text-white/70">
                        <Calendar className="h-3 w-3" />
                        {formatDate(selectedImage.capturedAt)}
                      </p>
                    )}
                  </div>
                )}

                {/* Counter */}
                <p className="mt-2 text-center text-sm text-white/70">
                  {currentIndex + 1} / {gallery.length}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

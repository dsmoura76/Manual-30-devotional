"use client";

import React, { useRef, useEffect, useState, useActionState, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EbookHeroProps {
  videoSrc?: string;
  bookTitle?: string;
  bookSubtitle?: string;
  className?: string;
}

export function CinematicHero({
  videoSrc = "/hero-storm.mp4",
  bookTitle = "Sovereign in the Storm",
  bookSubtitle = "Even in the darkest gale, the Lighthouse guides you home.",
  className = "",
}: EbookHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [countdown, setCountdown] = useState(30);
  const [showIntro, setShowIntro] = useState(true);
  const [zoomScale, setZoomScale] = useState(0.3);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [_, skipAction, isPending] = useActionState(async () => {
    startTransition(() => {
      setShowIntro(false);
    });
  }, null);

  useEffect(() => {
    if (!showIntro) return;
    if (countdown <= 0) {
      setShowIntro(false);
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, showIntro]);

  useEffect(() => {
    if (showIntro) return;

    const handleScroll = () => {
      if (!containerRef.current || !videoRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      const scrolled = Math.max(0, -rect.top);
      const maxScroll = containerHeight - windowHeight;
      const progress = Math.min(scrolled / maxScroll, 1);

      setScrollProgress(progress);

      const currentScale = 0.3 + progress * 0.7;
      setZoomScale(currentScale);

      const videoDuration = videoRef.current.duration;
      if (videoDuration && !isNaN(videoDuration)) {
        videoRef.current.currentTime = progress * videoDuration;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [showIntro]);

  return (
    <div className={`relative w-full bg-black ${className}`}>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <div className="text-center">
              <span className="text-xs uppercase tracking-widest text-zinc-500 block mb-2">
                Preparing the Journey
              </span>
              <motion.h1 
                className="text-8xl md:text-9xl font-black font-mono tracking-tighter text-zinc-200"
                key={countdown}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {countdown}
              </motion.h1>
            </div>

            <form action={skipAction} className="absolute bottom-12">
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-3 border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold uppercase tracking-wider rounded-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                Enter the Revelation
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={containerRef} className="relative h-[300vh] w-full">
        <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-black">
          
          <div
            className="relative w-screen h-screen flex items-center justify-center will-change-transform transition-transform duration-75 ease-out"
            style={{
              transform: `scale(${zoomScale})`,
              transformOrigin: "center center",
            }}
          >
            <video
              ref={videoRef}
              preload="auto"
              muted
              playsInline
              className="w-full h-full object-cover shadow-2xl"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80 pointer-events-none" />
          </div>

          {!showIntro && (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 transition-opacity duration-500 select-none pointer-events-none"
              style={{
                opacity: scrollProgress > 0.1 ? (scrollProgress - 0.1) * 1.2 : 0
              }}
            >
              <div className="max-w-3xl pointer-events-auto">
                <span className="text-xs md:text-sm font-bold tracking-widest text-amber-500 uppercase mb-3 block">
                  Interactive E-Book Experience
                </span>
                
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold text-white tracking-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] mb-6">
                  {bookTitle}
                </h2>
                
                <p className="text-zinc-300 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed drop-shadow-md mb-8">
                  {bookSubtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => alert("Opening Chapter 1...")}
                    className="w-full sm:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm uppercase tracking-wider rounded shadow-lg transition-all transform active:scale-95 cursor-pointer"
                  >
                    Read Chapter 1
                  </button>
                  <button 
                    onClick={() => alert("Adding book to library...")}
                    className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 border border-zinc-700 hover:bg-zinc-800 text-zinc-200 font-bold text-sm uppercase tracking-wider rounded shadow-lg transition-all transform active:scale-95 cursor-pointer"
                  >
                    Get Full Access
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-30 bg-zinc-950 text-white min-h-screen border-t border-zinc-900 px-6 py-24 shadow-[0_-30px_60px_rgba(0,0,0,0.9)]">
        <div className="max-w-4xl mx-auto text-center sm:text-left">
          <h3 className="text-3xl font-bold tracking-tight mb-4">Table of Contents</h3>
          <p className="text-zinc-400 text-base leading-relaxed mb-6">
            Your application layers, main database views, and standard scroll patterns continue smoothly right here below the cinematic cover layout.
          </p>
        </div>
      </div>
    </div>
  );
}

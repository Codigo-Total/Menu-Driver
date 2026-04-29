"use client";

import { useLangStore } from "@/store/lang/lang.slice";
import { Coffee, Droplets, Popcorn, Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SettingsControls } from "@/components/ui/SettingsControls/SettingsControls";

const CAROUSEL_IMAGES = [
  "/images/screensaver/hero-1-v2.png",
  "/images/screensaver/hero-2-v2.png",
  "/images/screensaver/hero-3-v2.png",
  "/images/screensaver/hero-4-v2.png",
];

const SLIDE_INTERVAL = 6000;

const CATEGORY_ICONS = [
  { icon: Coffee, label: "café" },
  { icon: Droplets, label: "bebidas" },
  { icon: Popcorn, label: "snacks" },
  { icon: Gamepad2, label: "juegos" },
];

export default function WelcomePage() {
  const { t, hydrated } = useLangStore();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (!hydrated) return null;

  const handleScreenTap = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    setTimeout(() => {
      router.push("/menu");
    }, 600);
  };

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {!isNavigating && (
        <motion.main
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black cursor-pointer select-none"
          onClick={handleScreenTap}
        >
          {/* ── Background Image Carousel ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={CAROUSEL_IMAGES[currentSlide]}
                alt=""
                fill
                className="object-cover animate-ken-burns"
                priority
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* ── Dark Gradient Overlay ── */}
          <div className="absolute inset-0 z-1 bg-linear-to-t from-black/85 via-black/60 to-black/40" />

          {/* ── Top Bar: Brand + Right Group ── */}
          <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-8 py-6 md:px-12 md:py-8">
            {/* Brand — subtle, secondary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <span className="text-sm md:text-base font-display font-medium tracking-[0.15em] uppercase text-white/50">
                Menu
                <span className="text-white/30 ml-1.5">Driver</span>
              </span>
            </motion.div>

            {/* Right Group: Language Selector */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex items-center"
            >
              <SettingsControls
                variant="glass"
                showThemeToggle={false}
                onInteraction={handleStopPropagation}
              />
            </motion.div>
          </div>

          {/* ── Center Content ── */}
          <div className="relative z-10 flex flex-col items-center justify-center px-8 text-center max-w-2xl mx-auto">
            {/* Category Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-6 mb-8"
            >
              {CATEGORY_ICONS.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                  className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-brand-yellow-400" strokeWidth={1.5} />
                </motion.div>
              ))}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-4"
            >
              {t("welcome.headline")}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-lg md:text-xl text-white/70 font-light leading-relaxed mb-12 max-w-md"
            >
              {t("welcome.subtitle")}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.0 }}
            >
              <div className="animate-pulse-glow rounded-full">
                <div className="flex items-center gap-3 rounded-full bg-brand-yellow-500 px-10 py-4 md:px-12 md:py-5 transition-transform duration-300 hover:scale-105 active:scale-95">
                  <span className="text-sm md:text-base font-semibold text-black uppercase tracking-wider">
                    {t("welcome.cta")}
                  </span>
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Carousel Indicators ── */}
          <div className="absolute bottom-24 md:bottom-28 z-10 flex items-center gap-2">
            {CAROUSEL_IMAGES.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-700 ${
                  i === currentSlide ? "w-8 bg-brand-yellow-400" : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}

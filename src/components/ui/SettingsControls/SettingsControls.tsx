"use client";

import { useLangStore } from "@/store/lang/lang.slice";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";

interface SettingsControlsProps {
  /** Whether to show the theme toggle button. Default: true */
  showThemeToggle?: boolean;
  /** Visual variant: "glass" for dark overlay pages, "solid" for standard pages */
  variant?: "glass" | "solid";
  /** Optional click handler wrapper for stopping propagation */
  onInteraction?: (e: React.MouseEvent) => void;
  /** Additional className for the wrapper */
  className?: string;
}

export function SettingsControls({
  showThemeToggle = true,
  variant = "solid",
  onInteraction,
  className,
}: SettingsControlsProps) {
  const { lang, setLanguage } = useLangStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isGlass = variant === "glass";

  const handleLangChange = (e: React.MouseEvent, newLang: "es" | "en") => {
    onInteraction?.(e);
    setLanguage(newLang);
  };

  const handleThemeToggle = (e: React.MouseEvent) => {
    onInteraction?.(e);
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Language Selector Pill */}
      <div
        className={cn(
          "flex items-center gap-1 rounded-full p-1 backdrop-blur-md border transition-colors duration-300",
          isGlass
            ? "bg-white/10 border-white/10"
            : "bg-slate-100/80 dark:bg-white/5 border-slate-200/50 dark:border-white/10",
        )}
      >
        <div className="pl-2 pr-1">
          <Globe
            className={cn(
              "w-3.5 h-3.5 transition-colors duration-300",
              isGlass
                ? "text-white/40"
                : "text-slate-400 dark:text-white/40",
            )}
          />
        </div>
        <button
          onClick={(e) => handleLangChange(e, "es")}
          className={cn(
            "px-4 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-300",
            lang === "es"
              ? isGlass
                ? "bg-white text-black shadow-lg"
                : "bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"
              : isGlass
                ? "text-white/50 hover:text-white/80"
                : "text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/80",
          )}
        >
          ES
        </button>
        <div
          className={cn(
            "w-px h-3.5",
            isGlass ? "bg-white/10" : "bg-slate-200 dark:bg-white/10",
          )}
        />
        <button
          onClick={(e) => handleLangChange(e, "en")}
          className={cn(
            "px-4 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-300",
            lang === "en"
              ? isGlass
                ? "bg-white text-black shadow-lg"
                : "bg-white dark:bg-white/15 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"
              : isGlass
                ? "text-white/50 hover:text-white/80"
                : "text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/80",
          )}
        >
          EN
        </button>
      </div>

      {/* Theme Toggle */}
      {showThemeToggle && (
        <button
          onClick={handleThemeToggle}
          className={cn(
            "group flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-105 active:scale-95",
            isGlass
              ? "bg-white/10 border-white/10 text-white/40 hover:text-white/80"
              : "bg-slate-100/80 dark:bg-white/5 border-slate-200/50 dark:border-white/10 text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/80",
          )}
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div
                key="moon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4 stroke-[1.75]" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4 stroke-[1.75]" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}
    </div>
  );
}

"use client";

import { useLangStore } from "@/store/lang/lang.slice";
import { useTheme } from "next-themes";
import { Moon, Sun, Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function SetupSettings() {
  const { lang, setLanguage } = useLangStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
      {/* Language Switcher */}
      <div className="flex items-center gap-1 rounded-2xl bg-slate-100 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-1 shadow-sm">
        <button
          onClick={() => setLanguage("es")}
          className={`px-4 py-2 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-300 ${
            lang === "es"
              ? "bg-brand-yellow-500 text-black shadow-lg"
              : "text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/80"
          }`}
        >
          ES
        </button>
        <button
          onClick={() => setLanguage("en")}
          className={`px-4 py-2 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-300 ${
            lang === "en"
              ? "bg-brand-yellow-500 text-black shadow-lg"
              : "text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/80"
          }`}
        >
          EN
        </button>
      </div>

      {/* Theme Switcher */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
      >
        <AnimatePresence mode="wait">
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

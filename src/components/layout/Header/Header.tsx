"use client";

import { useLangStore } from "@/store/lang/lang.slice";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SettingsGroupProps {
  lang: string;
  setLanguage: (lang: "es" | "en") => void;
  theme?: string;
  setTheme: (theme: string) => void;
}

const SettingsGroup = ({ lang, setLanguage, theme, setTheme }: SettingsGroupProps) => (
  <div className="flex items-center gap-2 sm:gap-3">
    {/* Minimalist Language Selection */}
    <div className="flex bg-slate-100/80 dark:bg-white/5 p-[3px] sm:p-1 rounded-[10px] sm:rounded-xl">
      <button
        onClick={() => setLanguage("es")}
        className={cn(
          "px-3 py-1 sm:px-4 sm:py-1.5 rounded-md sm:rounded-lg text-[13px] font-medium transition-all duration-200 outline-none",
          lang === "es"
            ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] ring-1 ring-slate-900/5 dark:ring-white/10"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200",
        )}
      >
        Español
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "px-3 py-1 sm:px-4 sm:py-1.5 rounded-md sm:rounded-lg text-[13px] font-medium transition-all duration-200 outline-none",
          lang === "en"
            ? "bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] ring-1 ring-slate-900/5 dark:ring-white/10"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200",
        )}
      >
        English
      </button>
    </div>

    {/* Theme Selection */}
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "group flex items-center justify-center w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-[10px] sm:rounded-xl outline-none",
        "bg-slate-100/80 dark:bg-white/5 border border-slate-200/50 dark:border-white/5",
        "text-slate-500 dark:text-slate-400",
        "transition-all duration-200 ease-out",
        "hover:bg-slate-200/80 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-slate-200",
        "active:scale-[0.97]",
        "focus-visible:ring-1 focus-visible:ring-slate-400 dark:focus-visible:ring-white/20",
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px] stroke-[1.75] transition-all duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="h-[18px] w-[18px] stroke-[1.75] transition-all duration-300 group-hover:-rotate-12" />
      )}
    </button>
  </div>
);

export const Header = () => {
  const { lang, setLanguage, hydrated } = useLangStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Hidden Admin Access Logic
  const [clickHistory, setClickHistory] = useState<number[]>([]);

  const handleLogoClick = () => {
    const now = Date.now();
    const newHistory = [...clickHistory, now].slice(-5);
    setClickHistory(newHistory);

    // Always navigate to menu on normal clicks
    router.push("/menu");

    if (newHistory.length === 5) {
      const firstClick = newHistory[0];
      const timeElapsed = now - firstClick;

      if (timeElapsed < 5000) {
        router.push("/admin/login");
      }
    }
  };

  if (!hydrated) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900">
      <div className="w-full h-20 flex items-center justify-between px-6 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div
            onClick={handleLogoClick}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring" }}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-[10px] sm:rounded-xl bg-brand-yellow-500 flex items-center justify-center shadow-md shadow-brand-yellow-500/20">
              <span className="font-display font-black text-brand-yellow-950 text-xl sm:text-2xl leading-none">
                M
              </span>
            </div>
            <h1 className="text-xl sm:text-[26px] font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter shrink-0 pt-0.5 sm:pt-1">
              <span className="hidden sm:inline">Menu</span>{" "}
              <span className="text-brand-yellow-500">Driver</span>
            </h1>
          </motion.div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <SettingsGroup lang={lang} setLanguage={setLanguage} theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  );
};

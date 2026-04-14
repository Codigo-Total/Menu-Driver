"use client";

import { useLangStore } from "@/store/lang/lang.slice";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface SettingsGroupProps {
  lang: string;
  setLanguage: (lang: "es" | "en") => void;
  theme?: string;
  setTheme: (theme: string) => void;
}

const SettingsGroup = ({ lang, setLanguage, theme, setTheme }: SettingsGroupProps) => (
  <div className="flex items-center gap-3 sm:gap-4">
    {/* Language Selection */}
    <div className="flex bg-slate-50 dark:bg-slate-900/50 p-0.5 rounded-lg border border-slate-100 dark:border-white/5">
      <button
        onClick={() => setLanguage("es")}
        className={cn(
          "px-3 py-1.5 rounded-md text-[10px] font-black transition-all min-w-[36px]",
          lang === "es"
            ? "bg-white dark:bg-slate-800 text-brand-yellow-600 shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
        )}
      >
        ES
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={cn(
          "px-3 py-1.5 rounded-md text-[10px] font-black transition-all min-w-[36px]",
          lang === "en"
            ? "bg-white dark:bg-slate-800 text-brand-yellow-600 shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
        )}
      >
        EN
      </button>
    </div>

    {/* Theme Selection */}
    <div className="flex bg-slate-50 dark:bg-slate-900/50 p-0.5 rounded-lg border border-slate-100 dark:border-white/5">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "p-2 rounded-md transition-all flex items-center justify-center min-w-[36px]",
          theme === "light"
            ? "bg-white dark:bg-slate-800 text-brand-yellow-600 shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
        )}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "p-2 rounded-md transition-all flex items-center justify-center min-w-[36px]",
          theme === "dark"
            ? "bg-white dark:bg-slate-800 text-brand-yellow-600 shadow-sm"
            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
        )}
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export const Header = () => {
  const { lang, setLanguage, hydrated, t } = useLangStore();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // Hidden Admin Access Logic
  const [clickHistory, setClickHistory] = useState<number[]>([]);

  const handleLogoClick = () => {
    const now = Date.now();
    const newHistory = [...clickHistory, now].slice(-5);
    setClickHistory(newHistory);

    if (newHistory.length === 5) {
      const firstClick = newHistory[0];
      const timeElapsed = now - firstClick;

      if (timeElapsed < 5000) {
        router.push("/admin/login");
      }
    }
  };

  if (!hydrated) return null;

  const getPageName = () => {
    if (pathname === "/menu") return t("menu.categories_short");
    if (pathname === "/games") return t("menu.fun_zone_short");
    if (pathname === "/checkout") return t("checkout.title");
    if (pathname === "/cart") return t("menu.order");
    return null;
  };

  const pageName = getPageName();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            onClick={handleLogoClick}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring" }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none"
          >
            <div className="h-10 w-10 rounded-xl bg-brand-yellow-500 flex items-center justify-center shadow-lg shadow-brand-yellow-200 dark:shadow-brand-yellow-900/20">
              <span className="font-display font-black text-brand-yellow-950 text-xl">M</span>
            </div>
            <h1 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter shrink-0">
              <span className="hidden sm:inline">Menu</span>{" "}
              <span className="text-brand-yellow-500">Driver</span>
            </h1>
          </motion.div>

          {pageName && (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-slate-200 dark:text-slate-800 font-thin text-2xl hidden sm:block">
                |
              </span>
              <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-700 sm:hidden shrink-0" />
              <h2 className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 truncate max-w-[100px] xs:max-w-none">
                {pageName}
              </h2>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <SettingsGroup lang={lang} setLanguage={setLanguage} theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </header>
  );
};

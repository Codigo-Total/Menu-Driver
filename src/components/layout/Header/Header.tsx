"use client";

import { useLangStore } from "@/store/lang/lang.slice";
import { Moon, Sun, Globe } from "lucide-react";
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
  <div className="flex items-center gap-2 sm:gap-3">
    {/* Language Selection */}
    <button
      onClick={() => setLanguage(lang === "es" ? "en" : "es")}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-100/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95 transition-all text-slate-700 dark:text-slate-200 shadow-sm",
      )}
    >
      <Globe className="h-4 w-4 text-brand-yellow-500" strokeWidth={2.5} />
      <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest mt-0.5">
        {lang}
      </span>
    </button>

    {/* Theme Selection */}
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "flex items-center justify-center p-2 sm:p-2.5 rounded-xl bg-slate-100/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 active:scale-95 transition-all text-slate-700 dark:text-slate-200 shadow-sm w-[36px] sm:w-[42px] h-[36px] sm:h-[42px]",
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-500 rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-500 rotate-0 scale-100" />
      )}
    </button>
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
      <div className="container mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div
            onClick={handleLogoClick}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring" }}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="h-8 w-8 rounded-lg bg-brand-yellow-500 flex items-center justify-center shadow-md shadow-brand-yellow-500/20">
              <span className="font-display font-black text-brand-yellow-950 text-lg leading-none">
                M
              </span>
            </div>
            <h1 className="text-lg font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter shrink-0 pt-0.5">
              <span className="hidden sm:inline">Menu</span>{" "}
              <span className="text-brand-yellow-500">Driver</span>
            </h1>
          </motion.div>

          {pageName && (
            <div className="flex items-center px-2.5 py-1 rounded-full bg-slate-100/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
              <h2 className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5 truncate max-w-[100px] xs:max-w-none">
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

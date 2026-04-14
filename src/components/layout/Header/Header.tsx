"use client";

import { useLangStore } from "@/store/lang/lang.slice";
import { Button } from "@/components/ui/Button";
import {
  Settings,
  Languages,
  Moon,
  Sun,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";

interface SettingsGroupProps {
  isDesktop?: boolean;
  lang: string;
  setLanguage: (lang: "es" | "en") => void;
  theme?: string;
  setTheme: (theme: string) => void;
  setShowSettings: (show: boolean) => void;
}

const SettingsGroup = ({
  isDesktop = false,
  lang,
  setLanguage,
  theme,
  setTheme,
  setShowSettings,
}: SettingsGroupProps) => (
  <div
    className={cn(
      "flex gap-3 sm:gap-4",
      isDesktop ? "items-center" : "flex-col",
    )}
  >
    {/* Language Selection */}
    <div className={cn("flex items-center gap-2")}>
      {!isDesktop && (
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Languages className="h-3 w-3" /> Idioma
        </span>
      )}
      <div className="flex bg-slate-50 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setLanguage("es")}
          className={cn(
            "px-3 py-1.5 rounded-md text-[10px] font-black transition-all min-w-[36px]",
            lang === "es"
              ? "bg-white dark:bg-slate-800 text-brand-yellow-600 shadow-sm"
              : "text-slate-400 hover:text-slate-600",
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
              : "text-slate-400 hover:text-slate-600",
          )}
        >
          EN
        </button>
      </div>
    </div>

    {/* Theme Selection */}
    <div className="flex items-center gap-2">
      {!isDesktop && (
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Moon className="h-3 w-3" /> Tema
        </span>
      )}
      <div className="flex bg-slate-50 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setTheme("light")}
          className={cn(
            "p-2 rounded-md transition-all flex items-center justify-center min-w-[36px]",
            theme === "light"
              ? "bg-white dark:bg-slate-800 text-brand-yellow-600 shadow-sm"
              : "text-slate-400 hover:text-slate-600",
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
              : "text-slate-400 hover:text-slate-600",
          )}
        >
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </div>

    {/* Admin Access (Hidden in desktop header, visible in drawer) */}
    {!isDesktop && (
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-1">
        <button
          onClick={() => {
            setShowSettings(false);
            window.location.href = "/admin/login";
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-slate-950 dark:bg-brand-yellow-500 text-white dark:text-brand-yellow-950 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 group"
        >
          <ShieldCheck className="h-4 w-4 transition-transform group-hover:rotate-12" />{" "}
          PANEL ADMIN
        </button>
      </div>
    )}
  </div>
);

export const Header = () => {
  const { lang, setLanguage, hydrated, t } = useLangStore();
  const { theme, setTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const pathname = usePathname();

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
          <div className="h-10 w-10 rounded-xl bg-brand-yellow-500 flex items-center justify-center shadow-lg shadow-brand-yellow-200 dark:shadow-brand-yellow-900/20">
            <span className="font-display font-black text-brand-yellow-950 text-xl">
              M
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <h1 className="text-lg sm:text-xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter shrink-0">
              <span className="hidden sm:inline">Menu</span>{" "}
              <span className="text-brand-yellow-500">Driver</span>
            </h1>
            {pageName && (
              <>
                <span className="text-slate-200 dark:text-slate-800 font-thin text-2xl hidden sm:block">
                  |
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-700 sm:hidden shrink-0" />
                <h2 className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 truncate max-w-[100px] xs:max-w-none">
                  {pageName}
                </h2>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Desktop Selectors (Always Visible) */}
          <div className="hidden sm:flex items-center">
            <SettingsGroup
              isDesktop
              lang={lang}
              setLanguage={setLanguage}
              theme={theme}
              setTheme={setTheme}
              setShowSettings={setShowSettings}
            />
          </div>

          {/* Settings Toggle (Always visible, houses Admin Panel) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              "h-10 w-10 sm:h-9 sm:w-9 rounded-xl transition-all",
              showSettings
                ? "bg-brand-yellow-500 text-brand-yellow-950"
                : "bg-slate-100 dark:bg-slate-900 text-slate-400",
            )}
          >
            <Settings
              className={cn(
                "h-5 w-5 sm:h-4.5 sm:w-4.5",
                showSettings && "animate-spin",
              )}
            />
          </Button>
        </div>
      </div>

      {/* Global Settings Drawer ( houses full SettingsGroup including Admin ) */}
      {showSettings && (
        <div className="absolute top-22 right-6 z-50 w-64 p-6 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 duration-300">
          <SettingsGroup
            lang={lang}
            setLanguage={setLanguage}
            theme={theme}
            setTheme={setTheme}
            setShowSettings={setShowSettings}
          />
        </div>
      )}
    </header>
  );
};

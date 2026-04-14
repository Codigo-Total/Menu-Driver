"use client";

import { Category } from "@/types/menu.types";
import { useLangStore } from "@/store/lang/lang.slice";
import { cn } from "@/lib/cn";
import * as Icons from "lucide-react";

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

/**
 * Premium Category Navigation Pills — Tablet Optimized.
 * Typography scaled for arm's-length reading.
 * Touch targets ≥ 48px height. Horizontal scroll with snap.
 */
export const CategoryTabs = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryTabsProps) => {
  const { lang, t, hydrated } = useLangStore();

  if (!hydrated) return null;

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2.5 px-2">
        {/* "All" Category Pill */}
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            "flex items-center gap-2.5 h-12 px-6 rounded-full transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0",
            activeCategoryId === null
              ? "bg-brand-yellow-500 text-brand-yellow-950 shadow-[0_8px_20px_rgba(234,179,8,0.3)] font-extrabold border-2 border-brand-yellow-400"
              : "bg-slate-100 dark:bg-white/4 border border-slate-200 dark:border-white/6 text-slate-500 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/8 hover:text-slate-700 dark:hover:text-white/60 font-semibold",
          )}
        >
          <Icons.LayoutGrid className="h-[18px] w-[18px]" />
          <span className="text-xs uppercase tracking-[0.12em]">{t("menu.all")}</span>
        </button>

        {/* Subtle separator */}
        <div className="h-5 w-px bg-slate-200 dark:bg-white/6 shrink-0" />

        {/* Dynamic Category Pills */}
        {categories.map((category) => {
          const IconComponent =
            (Icons as unknown as Record<string, Icons.LucideIcon>)[category.icon] || Icons.Circle;
          const isActive = activeCategoryId === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "flex items-center gap-2.5 h-12 px-6 rounded-full transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0",
                isActive
                  ? "bg-brand-yellow-500 text-brand-yellow-950 shadow-[0_8px_20px_rgba(234,179,8,0.3)] font-extrabold border-2 border-brand-yellow-400"
                  : "bg-slate-100 dark:bg-white/4 border border-slate-200 dark:border-white/6 text-slate-500 dark:text-white/40 hover:bg-slate-200 dark:hover:bg-white/8 hover:text-slate-700 dark:hover:text-white/60 font-semibold",
              )}
            >
              <IconComponent className="h-[18px] w-[18px]" />
              <span className="text-xs uppercase tracking-[0.12em]">
                {category.name[lang] || category.name["en"]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

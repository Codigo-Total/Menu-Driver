'use client';

import { Category } from '@/types/menu.types';
import { useLangStore } from '@/store/lang/lang.slice';
import { cn } from '@/lib/cn';
import * as Icons from 'lucide-react';

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
}

/**
 * Mobile-First Circular Category Navigation.
 * Optimized for Uber rides: Large touch targets, horizontal scroll, and icon-first design.
 * Matching the premium "What you like?" style from the reference mockup.
 */
export const CategoryTabs = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryTabsProps) => {
  const { lang, t, hydrated } = useLangStore();

  if (!hydrated) return null;

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-4 sm:py-6">
      <div className="flex items-start gap-4 px-4 sm:px-6">
        {/* "All" Category - Squarer Mode */}
        <div className="flex flex-col items-center gap-2 group min-w-[70px] sm:min-w-[90px]">
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              'h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 border-2',
              activeCategoryId === null
                ? 'bg-brand-yellow-500 border-brand-yellow-400 shadow-xl shadow-brand-yellow-500/20 text-brand-yellow-950'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-brand-yellow-200'
            )}
          >
            <Icons.LayoutGrid className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>
          <span className={cn(
            "text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-center transition-colors",
            activeCategoryId === null ? "text-brand-yellow-600" : "text-slate-400"
          )}>
            {t('menu.all')}
          </span>
        </div>

        {/* Dynamic Categories */}
        {categories.map((category) => {
          const IconComponent = (Icons as unknown as Record<string, Icons.LucideIcon>)[category.icon] || Icons.Circle;
          const isActive = activeCategoryId === category.id;
          
          return (
            <div key={category.id} className="flex flex-col items-center gap-2 group min-w-[70px] sm:min-w-[90px]">
              <button
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  'h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-90 border-2',
                  isActive
                    ? 'bg-brand-yellow-500 border-brand-yellow-400 shadow-xl shadow-brand-yellow-500/20 text-brand-yellow-950'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:border-brand-yellow-200'
                )}
              >
                <IconComponent className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
              <span className={cn(
                "text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] text-center transition-colors max-w-[70px] sm:max-w-[80px] break-words line-clamp-1 leading-tight font-display",
                isActive ? "text-brand-yellow-600" : "text-slate-400"
              )}>
                {category.name[lang] || category.name['en']}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

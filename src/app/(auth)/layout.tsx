'use client';

import { cn } from "@/lib/cn";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useLangStore } from "@/store/lang/lang.slice";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useLangStore();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center">
          <Link href={ROUTES.PUBLIC.HOME} className="flex items-center gap-2 group">
            <div className="h-12 w-12 rounded-xl bg-brand-yellow-500 flex items-center justify-center font-bold text-brand-yellow-950 text-xl shadow-lg shadow-brand-yellow-200 dark:shadow-brand-yellow-900/20 group-hover:scale-110 transition-transform">
              M
            </div>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('auth.welcome_back')}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            {t('auth.professional_access')}
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          {children}
        </div>
        
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 max-w-[280px] mx-auto leading-relaxed">
          {t('auth.terms')}
        </p>
      </div>
    </div>
  );
}

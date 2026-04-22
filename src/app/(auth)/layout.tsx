"use client";

import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useLangStore } from "@/store/lang/lang.slice";
import { ChevronLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLangStore();

  return (
    <div className="relative flex h-dvh w-full overflow-hidden flex-col items-center justify-center bg-[#fbfbfd] dark:bg-[#000000] px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <Link
        href={ROUTES.PUBLIC.MENU}
        className="absolute top-6 left-6 md:top-8 md:left-8 p-3 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 active:scale-95 focus:outline-none touch-manipulation z-50"
      >
        <ChevronLeft className="h-7 w-7 stroke-[1.25]" />
        <span className="sr-only">{t("common.back") || "Volver"}</span>
      </Link>

      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-[#fbfbfd] dark:bg-[#000000] p-8 sm:p-10 rounded-[2.5rem]">
          {children}
        </div>
      </div>
    </div>
  );
}

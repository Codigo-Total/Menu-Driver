"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useLangStore } from "@/store/lang/lang.slice";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLangStore();

  return (
    <div className="flex h-dvh w-full overflow-hidden flex-col items-center justify-center bg-[#fbfbfd] dark:bg-[#000000] px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-[#fbfbfd] dark:bg-[#000000] p-8 sm:p-10 rounded-[2.5rem]">
          {children}
        </div>
      </div>
    </div>
  );
}

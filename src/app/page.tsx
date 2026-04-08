"use client";

import { useLangStore } from "@/store/lang/lang.slice";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1622483767028-3f66f34a5bbf?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400",
];

/**
 * Premium Standalone Welcome Screen.
 * Features a blurred product mosaic background ("Glass Products").
 * High-focus CTA for starting the Uber ride order experience.
 */
export default function WelcomePage() {
  const { lang, setLanguage, t, hydrated } = useLangStore();

  if (!hydrated)
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-yellow-500 border-t-transparent" />
      </div>
    );

  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-700">
      {/* Immersive Glass Background - Product Mosaic */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 scale-110 blur-[60px] opacity-40 dark:opacity-20 animate-slow-zoom">
          {[
            ...BACKGROUND_IMAGES,
            ...BACKGROUND_IMAGES,
            ...BACKGROUND_IMAGES,
          ].map((img, i) => (
            <div
              key={i}
              className="aspect-square rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl"
              style={{
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        {/* Extra glass layers for premium depth */}
        <div className="absolute inset-0 bg-white/30 dark:bg-slate-950/40 backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-slate-950/50 dark:to-slate-950" />
      </div>

      {/* Main Content Area */}
      <div className="z-10 flex flex-col items-center text-center px-6 max-w-2xl transform">
        {/* Floating Luxury Icon */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-brand-yellow-500 blur-3xl opacity-30 animate-pulse group-hover:opacity-50 transition-opacity" />
          <div className="relative h-32 w-32 rounded-[3.5rem] bg-brand-yellow-500 flex items-center justify-center shadow-2xl shadow-brand-yellow-500/30 animate-zoom-in border-4 border-white/50 dark:border-slate-800/50">
            <ShoppingBag className="h-14 w-14 text-brand-yellow-950" />
          </div>
        </div>

        {/* Branding with Staggered Animations */}
        <div className="space-y-4 mb-20">
          <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tighter animate-fade-in [animation-fill-mode:backwards]">
            Menu <span className="text-brand-yellow-500">Driver</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold text-slate-500/80 dark:text-slate-400 capitalize -mt-2 animate-fade-in [animation-delay:200ms] [animation-fill-mode:backwards]">
            {t("welcome.subtitle")}
          </p>
        </div>

        {/* The Action Centerpiece - Pedir Ahora */}
        <div className="flex flex-col items-center gap-12 w-full animate-slide-up [animation-delay:400ms] [animation-fill-mode:backwards]">
          <Link href="/menu" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="group relative h-20 px-14 rounded-[2.5rem] text-sm sm:text-2xl font-black uppercase tracking-[0.25em] shadow-[0_20px_60px_-15px_rgba(234,179,8,0.4)] hover:shadow-brand-yellow-500/50 hover:-translate-y-2 transition-all duration-300 w-full active:scale-95"
              rightIcon={
                <ArrowRight className="h-6 w-6 ml-5 group-hover:translate-x-3 transition-transform duration-500" />
              }
            >
              <span className="relative z-10">{t("welcome.start_button")}</span>
            </Button>
          </Link>

          {/* Minimalist Language Toggles */}
          <div className="flex items-center gap-4 p-1.5 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/5">
            <button
              onClick={() => setLanguage("es")}
              className={`px-8 py-3 rounded-[1rem] text-[10px] font-black transition-all duration-500 tracking-widest ${lang === "es" ? "bg-white dark:bg-slate-800 text-brand-yellow-600 shadow-lg" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"}`}
            >
              ESPAÑOL
            </button>
            <div className="w-[1px] h-4 bg-slate-300 dark:bg-slate-800" />
            <button
              onClick={() => setLanguage("en")}
              className={`px-8 py-3 rounded-[1rem] text-[10px] font-black transition-all duration-500 tracking-widest ${lang === "en" ? "bg-white dark:bg-slate-800 text-brand-yellow-600 shadow-lg" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"}`}
            >
              ENGLISH
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

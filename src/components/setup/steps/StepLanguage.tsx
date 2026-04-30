"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useLangStore } from "@/store/lang/lang.slice";

interface StepProps {
  onNext: () => void;
}

const ICON_BOX = "clamp(4rem, 14vh, 7rem)";
const ICON_INNER = "clamp(2rem, 7vh, 3.5rem)";

export default function StepLanguage({ onNext }: StepProps) {
  const { setLanguage } = useLangStore();

  const choose = (lang: "es" | "en") => {
    setLanguage(lang);
    onNext();
  };

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-3xl bg-brand-yellow-500/10 flex items-center justify-center border border-brand-yellow-500/20"
        style={{ width: ICON_BOX, height: ICON_BOX, marginBottom: "clamp(1rem, 3vh, 2.5rem)" }}
      >
        <Globe style={{ width: ICON_INNER, height: ICON_INNER }} className="text-brand-yellow-400" strokeWidth={1.5} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-display font-bold text-slate-900 dark:text-white"
        style={{ fontSize: "clamp(1.5rem, 4.5vh, 3rem)", marginBottom: "clamp(0.5rem, 1.5vh, 1.25rem)" }}
      >
        Selecciona tu idioma / Select your language
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-slate-600 dark:text-white/60"
        style={{ fontSize: "clamp(0.875rem, 2vh, 1.125rem)", marginBottom: "clamp(1.25rem, 4vh, 3rem)" }}
      >
        Podrás cambiarlo después / You can change it later
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="flex flex-col w-full max-w-sm"
        style={{ gap: "clamp(0.625rem, 1.8vh, 1rem)" }}
      >
        <button
          onClick={() => choose("es")}
          className="flex items-center justify-between w-full font-bold rounded-2xl bg-brand-yellow-500 hover:bg-brand-yellow-400 text-black shadow-2xl shadow-brand-yellow-500/20 transition-all hover:scale-[1.02] active:scale-95"
          style={{
            paddingLeft: "clamp(1.5rem, 4vw, 2rem)",
            paddingRight: "clamp(1.5rem, 4vw, 2rem)",
            paddingTop: "clamp(0.875rem, 2.2vh, 1.25rem)",
            paddingBottom: "clamp(0.875rem, 2.2vh, 1.25rem)",
            fontSize: "clamp(0.9375rem, 2.2vh, 1.125rem)",
            minHeight: "clamp(52px, 8vh, 68px)",
          }}
        >
          <span className="text-2xl">🇪🇸</span>
          <span className="flex-1 text-center uppercase tracking-wider">Español</span>
          <span className="opacity-0 text-2xl">🇪🇸</span>
        </button>

        <button
          onClick={() => choose("en")}
          className="flex items-center justify-between w-full font-bold rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-lg shadow-black/5 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95"
          style={{
            paddingLeft: "clamp(1.5rem, 4vw, 2rem)",
            paddingRight: "clamp(1.5rem, 4vw, 2rem)",
            paddingTop: "clamp(0.875rem, 2.2vh, 1.25rem)",
            paddingBottom: "clamp(0.875rem, 2.2vh, 1.25rem)",
            fontSize: "clamp(0.9375rem, 2.2vh, 1.125rem)",
            minHeight: "clamp(52px, 8vh, 68px)",
          }}
        >
          <span className="text-2xl">🇺🇸</span>
          <span className="flex-1 text-center uppercase tracking-wider">English</span>
          <span className="opacity-0 text-2xl">🇺🇸</span>
        </button>
      </motion.div>
    </div>
  );
}

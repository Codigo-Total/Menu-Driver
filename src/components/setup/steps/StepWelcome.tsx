"use client";

import { motion } from "framer-motion";
import { Tablet, ArrowRight } from "lucide-react";
import { useLangStore } from "@/store/lang/lang.slice";

interface StepProps {
  onNext: () => void;
}

export default function StepWelcome({ onNext }: StepProps) {
  const { t } = useLangStore();

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-32 h-32 rounded-3xl bg-brand-yellow-500/10 flex items-center justify-center mb-10 border border-brand-yellow-500/20"
      >
        <Tablet className="w-16 h-16 text-brand-yellow-400" strokeWidth={1.5} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6"
      >
        {t("setup.welcome.title")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-lg text-slate-600 dark:text-white/60 mb-12"
      >
        {t("setup.welcome.subtitle")}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        onClick={onNext}
        className="flex items-center gap-3 bg-brand-yellow-500 hover:bg-brand-yellow-400 text-black px-12 py-5 rounded-full font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-brand-yellow-500/20 animate-pulse-glow"
      >
        {t("setup.welcome.start")}
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

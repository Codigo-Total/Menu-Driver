"use client";

import { motion } from "framer-motion";
import { Tablet, ArrowRight } from "lucide-react";
import { useLangStore } from "@/store/lang/lang.slice";

interface StepProps {
  onNext: () => void;
}

const ICON_BOX = "clamp(4rem, 14vh, 7rem)";
const ICON_INNER = "clamp(2rem, 7vh, 3.5rem)";

export default function StepWelcome({ onNext }: StepProps) {
  const { t } = useLangStore();

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="rounded-3xl bg-brand-yellow-500/10 flex items-center justify-center border border-brand-yellow-500/20"
        style={{ width: ICON_BOX, height: ICON_BOX, marginBottom: "clamp(1rem, 3vh, 2.5rem)" }}
      >
        <Tablet style={{ width: ICON_INNER, height: ICON_INNER }} className="text-brand-yellow-400" strokeWidth={1.5} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-display font-bold text-slate-900 dark:text-white"
        style={{ fontSize: "clamp(1.5rem, 4.5vh, 3rem)", marginBottom: "clamp(0.5rem, 1.5vh, 1.25rem)" }}
      >
        {t("setup.welcome.title")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-slate-600 dark:text-white/60"
        style={{ fontSize: "clamp(0.875rem, 2vh, 1.125rem)", marginBottom: "clamp(1.25rem, 4vh, 3rem)" }}
      >
        {t("setup.welcome.subtitle")}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        onClick={onNext}
        className="flex items-center gap-3 bg-brand-yellow-500 hover:bg-brand-yellow-400 text-black rounded-full font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-brand-yellow-500/20 animate-pulse-glow"
        style={{
          paddingLeft: "clamp(2rem, 6vw, 3.5rem)",
          paddingRight: "clamp(2rem, 6vw, 3.5rem)",
          paddingTop: "clamp(0.875rem, 2.2vh, 1.5rem)",
          paddingBottom: "clamp(0.875rem, 2.2vh, 1.5rem)",
          fontSize: "clamp(0.875rem, 2vh, 1.125rem)",
          minHeight: "clamp(48px, 7vh, 64px)",
        }}
      >
        {t("setup.welcome.start")}
        <ArrowRight style={{ width: "clamp(1rem, 2vh, 1.25rem)", height: "clamp(1rem, 2vh, 1.25rem)" }} />
      </motion.button>
    </div>
  );
}

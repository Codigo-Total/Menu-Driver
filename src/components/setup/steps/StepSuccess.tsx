"use client";

import { motion } from "framer-motion";
import { Check, Rocket, ArrowRight } from "lucide-react";
import { useLangStore } from "@/store/lang/lang.slice";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface StepProps {
  onFinish: () => void;
}

export default function StepSuccess({ onFinish }: StepProps) {
  const { t } = useLangStore();
  const { width, height } = useWindowSize();

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto py-12">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={200}
        colors={["#fbbf24", "#ffffff", "#009EE3"]}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.2 
        }}
        className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center mb-10 shadow-2xl shadow-green-500/20"
      >
        <Check className="w-16 h-16 text-white" strokeWidth={4} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6"
      >
        {t("setup.success.title")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-lg text-slate-600 dark:text-white/60 mb-12"
      >
        {t("setup.success.subtitle")}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        onClick={onFinish}
        className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black px-14 py-6 text-lg rounded-full font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-2xl min-h-[64px]"
      >
        <Rocket className="w-5 h-5 text-brand-yellow-500" />
        {t("setup.success.finish")}
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

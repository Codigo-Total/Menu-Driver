"use client";

import { motion } from "framer-motion";
import { Check, Rocket, ArrowRight } from "lucide-react";
import { useLangStore } from "@/store/lang/lang.slice";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface StepProps {
  onFinish: () => void;
}

const ICON_BOX = "clamp(4rem, 14vh, 7rem)";
const ICON_INNER = "clamp(2rem, 7vh, 3.5rem)";

export default function StepSuccess({ onFinish }: StepProps) {
  const { t } = useLangStore();
  const { width, height } = useWindowSize();

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto">
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
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        className="rounded-full bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/20"
        style={{ width: ICON_BOX, height: ICON_BOX, marginBottom: "clamp(1rem, 3vh, 2.5rem)" }}
      >
        <Check style={{ width: ICON_INNER, height: ICON_INNER }} className="text-white" strokeWidth={4} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="font-display font-bold text-slate-900 dark:text-white"
        style={{ fontSize: "clamp(1.5rem, 4.5vh, 3rem)", marginBottom: "clamp(0.5rem, 1.5vh, 1.25rem)" }}
      >
        {t("setup.success.title")}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="text-slate-600 dark:text-white/60"
        style={{ fontSize: "clamp(0.875rem, 2vh, 1.125rem)", marginBottom: "clamp(1.25rem, 4vh, 3rem)" }}
      >
        {t("setup.success.subtitle")}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        onClick={onFinish}
        className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-2xl"
        style={{
          paddingLeft: "clamp(2rem, 6vw, 3.5rem)",
          paddingRight: "clamp(2rem, 6vw, 3.5rem)",
          paddingTop: "clamp(0.875rem, 2.2vh, 1.5rem)",
          paddingBottom: "clamp(0.875rem, 2.2vh, 1.5rem)",
          fontSize: "clamp(0.875rem, 2vh, 1.125rem)",
          minHeight: "clamp(48px, 7vh, 64px)",
        }}
      >
        <Rocket style={{ width: "clamp(1rem, 2vh, 1.25rem)", height: "clamp(1rem, 2vh, 1.25rem)" }} className="text-brand-yellow-500" />
        {t("setup.success.finish")}
        <ArrowRight style={{ width: "clamp(1rem, 2vh, 1.25rem)", height: "clamp(1rem, 2vh, 1.25rem)" }} />
      </motion.button>
    </div>
  );
}

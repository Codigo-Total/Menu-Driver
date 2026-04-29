"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLangStore } from "@/store/lang/lang.slice";

interface StepperProps {
  currentStep: number;
}

const STEPS = [
  "setup.steps.welcome",
  "setup.steps.auth",
  "setup.steps.payments",
  "setup.steps.pin",
  "setup.steps.finish",
];

export function Stepper({ currentStep }: StepperProps) {
  const { t } = useLangStore();

  return (
    <div className="flex items-center justify-center w-full gap-4 px-4 py-8">
      {STEPS.map((stepKey, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={stepKey} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? "var(--brand-yellow-400, #fbbf24)" : "rgba(100, 116, 139, 0.1)", // More visible slate color
                  scale: isActive ? 1.1 : 1,
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isActive ? "border-brand-yellow-400" : "border-transparent"
                } transition-colors duration-300`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-black" strokeWidth={3} />
                ) : (
                  <span className={`text-sm font-bold ${isActive ? "text-black" : "text-slate-400 dark:text-white/40"}`}>
                    {index + 1}
                  </span>
                )}
              </motion.div>
              <span
                className={`text-[10px] uppercase tracking-widest font-bold hidden md:block ${
                  isActive ? "text-brand-yellow-400" : "text-slate-300 dark:text-white/20"
                }`}
              >
                {t(stepKey)}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="w-8 md:w-16 h-[2px] bg-slate-100 dark:bg-white/10 rounded-full mb-6">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: isCompleted ? "100%" : "0%" }}
                  className="h-full bg-brand-yellow-400"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

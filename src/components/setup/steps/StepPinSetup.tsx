"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLangStore } from "@/store/lang/lang.slice";
import { PinPad } from "@/components/ui/PinPad";

interface StepProps {
  onNext: (pin: string) => void;
}

export default function StepPinSetup({ onNext }: StepProps) {
  const { t } = useLangStore();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (pin.length === 4 && !isConfirming) {
      const t = setTimeout(() => setIsConfirming(true), 400);
      return () => clearTimeout(t);
    }

    if (confirmPin.length === 4 && isConfirming) {
      if (pin === confirmPin) {
        const t = setTimeout(() => onNext(pin), 1200);
        return () => clearTimeout(t);
      }
      setError(true);
      const t = setTimeout(() => {
        setConfirmPin("");
        setError(false);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [pin, confirmPin, isConfirming, onNext]);

  const currentPin = isConfirming ? confirmPin : pin;
  const setCurrentPin = isConfirming ? setConfirmPin : setPin;

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto">
      <h2
        className="font-display font-bold text-slate-900 dark:text-white"
        style={{ fontSize: "clamp(1.25rem, 3.6vh, 1.875rem)", marginBottom: "clamp(0.125rem, 0.5vh, 0.5rem)" }}
      >
        {t("setup.pin.title")}
      </h2>
      <p
        className="text-slate-500 dark:text-white/50"
        style={{ fontSize: "clamp(0.75rem, 1.8vh, 0.95rem)", marginBottom: "clamp(0.5rem, 1.5vh, 1rem)" }}
      >
        {t("setup.pin.subtitle")}
      </p>

      <span
        className="uppercase tracking-widest font-bold text-brand-yellow-400"
        style={{ fontSize: "clamp(0.625rem, 1.4vh, 0.75rem)", marginBottom: "clamp(0.5rem, 1.5vh, 1rem)" }}
      >
        {isConfirming ? t("setup.pin.confirm") : t("setup.pin.enter")}
      </span>

      <PinPad pin={currentPin} onChange={setCurrentPin} error={error} />

      <div
        className="flex items-center justify-center"
        style={{ height: "clamp(1rem, 2vh, 1.5rem)", marginTop: "clamp(0.5rem, 1.5vh, 1rem)" }}
      >
        <AnimatePresence>
          {error && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-xs font-bold uppercase tracking-tighter"
            >
              {t("setup.pin.mismatch")}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

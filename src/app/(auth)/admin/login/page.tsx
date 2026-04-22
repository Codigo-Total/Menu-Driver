"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Delete, LockKeyhole } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useLangStore } from "@/store/lang/lang.slice";
import { cn } from "@/lib/cn";

const playTick = () => {
  try {
    // @ts-expect-error - webkitAudioContext is a non-standard property
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Very fast, subtle iOS-like "tick"
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.02);
  } catch (e) {
    // Ignore audio context initialization errors
  }
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginWithPin, isLoading, isAdmin } = useAuthStore();
  const { t, hydrated } = useLangStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, router]);

  const handleSubmit = useCallback(
    async (currentPin: string) => {
      // Very brief delay for the final dot pop
      setTimeout(async () => {
        const success = await loginWithPin(currentPin);
        if (!success) {
          setError(true);
          setPin("");
          // Kinetic shake feedback (subtle)
          controls.start({
            x: [-8, 8, -6, 6, -3, 3, 0],
            transition: { duration: 0.4 },
          });
        }
      }, 100);
    },
    [loginWithPin, controls],
  );

  const handleKeyPress = (num: string) => {
    playTick();
    if (pin.length < 4 && !isLoading) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        handleSubmit(newPin);
      }
    }
  };

  const handleDelete = () => {
    playTick();
    if (pin.length > 0 && !isLoading) {
      setPin((prev) => prev.slice(0, -1));
      setError(false);
    }
  };

  if (!hydrated) return null;

  const numpad = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="relative flex flex-col items-center select-none">
      <div className="mb-8 flex items-center justify-center">
        {/* Monochromatic, thin icon, no background box */}
        <LockKeyhole className="h-12 w-12 text-slate-800 dark:text-slate-200 stroke-1" />
      </div>

      <h1 className="text-[24px] font-medium text-slate-900 dark:text-white mb-2 tracking-tight">
        {t("admin.login_title")}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-12 text-center max-w-[240px] font-normal leading-relaxed">
        {t("admin.login_subtitle")}
      </p>

      {/* PIN Indicators */}
      <motion.div animate={controls} className="flex gap-4 mb-3">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "h-3 w-3 rounded-full transition-colors duration-[75ms] ease-out",
              error
                ? "bg-red-500"
                : pin.length > i
                  ? "bg-slate-800 dark:bg-white"
                  : "bg-slate-200 dark:bg-[#333333]",
            )}
          />
        ))}
      </motion.div>

      {/* Error Message Space (to prevent layout shift) */}
      <div className="h-6 mb-8 flex items-center justify-center">
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-500 text-xs font-normal"
            >
              PIN incorrecto
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* iOS Style Flat Keypad */}
      <div className="grid grid-cols-3 gap-y-4 gap-x-8 w-full max-w-[260px] mx-auto">
        {numpad.map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 1.15 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={() => handleKeyPress(num)}
            disabled={isLoading}
            className="h-16 w-16 mx-auto flex items-center justify-center rounded-full text-[26px] font-normal text-slate-800 dark:text-slate-100 bg-slate-500/5 dark:bg-white/5 transition-colors duration-200 disabled:opacity-50 touch-manipulation focus:outline-none active:bg-slate-500/15 dark:active:bg-white/20 active:duration-75"
          >
            {num}
          </motion.button>
        ))}

        {/* Empty space */}
        <div className="pointer-events-none" />

        <motion.button
          whileTap={{ scale: 1.15 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={() => handleKeyPress("0")}
          disabled={isLoading}
          className="h-16 w-16 mx-auto flex items-center justify-center rounded-full text-[26px] font-normal text-slate-800 dark:text-slate-100 bg-slate-500/5 dark:bg-white/5 transition-colors duration-200 disabled:opacity-50 touch-manipulation focus:outline-none active:bg-slate-500/15 dark:active:bg-white/20 active:duration-75"
        >
          0
        </motion.button>

        <motion.button
          whileTap={{ scale: 1.15 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={handleDelete}
          disabled={isLoading || pin.length === 0}
          aria-label="Borrar último dígito"
          className="h-16 w-16 mx-auto flex items-center justify-center rounded-full text-slate-400 dark:text-slate-500 bg-slate-500/5 dark:bg-white/5 transition-all duration-200 disabled:opacity-0 focus:outline-none touch-manipulation active:bg-slate-500/15 dark:active:bg-white/20 active:text-slate-800 dark:active:text-white active:duration-75"
        >
          <Delete className="h-6 w-6 stroke-[1.5]" />
        </motion.button>
      </div>
    </div>
  );
}

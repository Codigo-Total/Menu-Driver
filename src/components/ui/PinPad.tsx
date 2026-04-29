"use client";

import { Delete } from "lucide-react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
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

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.02);
  } catch {
    // Ignore audio context errors
  }
};

interface PinPadProps {
  pin: string;
  onChange: (pin: string) => void;
  length?: number;
  error?: boolean;
  disabled?: boolean;
  sound?: boolean;
}

export function PinPad({
  pin,
  onChange,
  length = 4,
  error = false,
  disabled = false,
  sound = true,
}: PinPadProps) {
  const controls = useAnimation();
  const lastError = useRef(false);

  useEffect(() => {
    if (error && !lastError.current) {
      controls.start({
        x: [-8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.4 },
      });
    }
    lastError.current = error;
  }, [error, controls]);

  const handleKeyPress = (num: string) => {
    if (sound) playTick();
    if (pin.length < length && !disabled) {
      onChange(pin + num);
    }
  };

  const handleDelete = () => {
    if (sound) playTick();
    if (pin.length > 0 && !disabled) {
      onChange(pin.slice(0, -1));
    }
  };

  const numpad = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="flex flex-col items-center select-none">
      <motion.div animate={controls} className="flex gap-4 mb-3">
        {Array.from({ length }).map((_, i) => (
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

      <div className="grid grid-cols-3 gap-y-4 gap-x-8 w-full max-w-[260px] mx-auto mt-8">
        {numpad.map((num) => (
          <motion.button
            key={num}
            whileTap={{ scale: 1.15 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={() => handleKeyPress(num)}
            disabled={disabled}
            className="h-16 w-16 mx-auto flex items-center justify-center rounded-full text-[26px] font-normal text-slate-800 dark:text-slate-100 bg-slate-500/5 dark:bg-white/5 transition-colors duration-200 disabled:opacity-50 touch-manipulation focus:outline-none active:bg-slate-500/15 dark:active:bg-white/20 active:duration-75"
          >
            {num}
          </motion.button>
        ))}

        <div className="pointer-events-none" />

        <motion.button
          whileTap={{ scale: 1.15 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={() => handleKeyPress("0")}
          disabled={disabled}
          className="h-16 w-16 mx-auto flex items-center justify-center rounded-full text-[26px] font-normal text-slate-800 dark:text-slate-100 bg-slate-500/5 dark:bg-white/5 transition-colors duration-200 disabled:opacity-50 touch-manipulation focus:outline-none active:bg-slate-500/15 dark:active:bg-white/20 active:duration-75"
        >
          0
        </motion.button>

        <motion.button
          whileTap={{ scale: 1.15 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={handleDelete}
          disabled={disabled || pin.length === 0}
          aria-label="Borrar último dígito"
          className="h-16 w-16 mx-auto flex items-center justify-center rounded-full text-slate-400 dark:text-slate-500 bg-slate-500/5 dark:bg-white/5 transition-all duration-200 disabled:opacity-0 focus:outline-none touch-manipulation active:bg-slate-500/15 dark:active:bg-white/20 active:text-slate-800 dark:active:text-white active:duration-75"
        >
          <Delete className="h-6 w-6 stroke-[1.5]" />
        </motion.button>
      </div>
    </div>
  );
}

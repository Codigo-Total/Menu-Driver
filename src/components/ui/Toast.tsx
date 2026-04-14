"use client";

import { useToastStore } from "@/store/ui/toast.slice";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

export const ToastProvider = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] sm:right-auto sm:left-1/2 sm:-translate-x-1/2 flex flex-col gap-2 px-4 pointer-events-none w-full sm:w-[400px]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={`${toast.id}-${toast.nonce}`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto flex items-center gap-3 p-4 rounded-2xl backdrop-blur-xl border",
              // Light Mode Page -> Dark Toast
              "bg-slate-900/95 text-white border-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.15)]",
              // Dark Mode Page -> Light Toast
              "dark:bg-white/95 dark:text-slate-900 dark:border-slate-200 dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
            )}
          >
            {/* Icon based on type */}
            <div className="shrink-0">
              {toast.type === "success" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 dark:text-emerald-500" />
              )}
              {toast.type === "error" && (
                <XCircle className="h-5 w-5 text-red-400 dark:text-red-500" />
              )}
              {(!toast.type || toast.type === "info") && (
                <Info className="h-5 w-5 text-blue-400 dark:text-blue-500" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-slate-300 dark:text-slate-500 mt-0.5 truncate">
                  {toast.description}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-full transition-colors text-slate-400 hover:text-white hover:bg-white/10 dark:text-slate-400 dark:hover:text-slate-900 dark:hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLangStore } from "@/store/lang/lang.slice";
import { Loader2, ShieldCheck, Smartphone } from "lucide-react";

interface StepProps {
  onNext: (token: string) => void;
}

// TODO: Reemplazar por el flujo real (POST /auth/device + WebSocket AUTH_OK)
// cuando el backend esté disponible. Por ahora es un mock para el demo.
const DEMO_MODE = true;

export default function StepDeviceAuth({ onNext }: StepProps) {
  const { t } = useLangStore();
  const [operation, setOperation] = useState<{ operationId: string; qrUrl: string } | null>(null);
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    if (!DEMO_MODE) return;

    const operationId = `demo-${Math.random().toString(36).slice(2, 10)}`;
    const qrUrl = `https://menu-driver.demo/link/${operationId}`;

    const timer = setTimeout(() => {
      setOperation({ operationId, qrUrl });
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const simulateScan = () => {
    setIsLinked(true);
    setTimeout(() => {
      onNext(`demo-token-${Date.now()}`);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto py-8">
      <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
        {t("setup.auth.title")}
      </h2>
      <p className="text-slate-500 dark:text-white/50 mb-10">
        {t("setup.auth.subtitle")}
      </p>

      <div className="relative">
        <AnimatePresence mode="wait">
          {!operation && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-64 h-64 flex flex-col items-center justify-center bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10"
            >
              <Loader2 className="w-10 h-10 text-brand-yellow-400 animate-spin mb-4" />
              <span className="text-xs text-slate-400 dark:text-white/30 uppercase tracking-widest font-bold">
                Iniciando...
              </span>
            </motion.div>
          )}

          {operation && !isLinked && (
            <motion.div
              key="qr"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-white rounded-[2.5rem] shadow-2xl shadow-brand-yellow-500/10"
            >
              <QRCodeSVG
                value={operation.qrUrl}
                size={220}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/favicon.ico",
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </motion.div>
          )}

          {isLinked && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-64 h-64 flex flex-col items-center justify-center bg-green-500/10 rounded-3xl border border-green-500/20"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <span className="text-sm font-bold text-green-400">
                {t("setup.auth.success")}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 flex items-center gap-3 px-6 py-3 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div className="w-2 h-2 rounded-full bg-brand-yellow-400 animate-pulse" />
        <span className="text-xs text-slate-400 dark:text-white/40 uppercase tracking-widest font-bold">
          {t("setup.auth.waiting")}
        </span>
      </div>

      {operation && !isLinked && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={simulateScan}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-yellow-400 hover:bg-brand-yellow-500 text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors active:scale-95"
        >
          <Smartphone className="w-4 h-4" />
          Simular escaneo (demo)
        </motion.button>
      )}
    </div>
  );
}

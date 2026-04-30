"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLangStore } from "@/store/lang/lang.slice";
import { Loader2, ShieldCheck, Smartphone } from "lucide-react";

interface StepProps {
  onNext: (token: string) => void;
}

type AuthProvider = "google" | "apple" | null;

// TODO: Reemplazar por el flujo real (POST /auth/device + WebSocket AUTH_OK)
// cuando el backend esté disponible. Por ahora es un mock para el demo.
const DEMO_MODE = true;

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
    </svg>
  );
}

export default function StepDeviceAuth({ onNext }: StepProps) {
  const { t } = useLangStore();
  const [provider, setProvider] = useState<AuthProvider>(null);
  const [operation, setOperation] = useState<{ operationId: string; qrUrl: string } | null>(null);
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    if (!DEMO_MODE || !provider) return;

    setOperation(null);

    const operationId = `demo-${provider}-${Math.random().toString(36).slice(2, 10)}`;
    const qrUrl = `https://menu-driver.demo/link/${provider}/${operationId}`;

    const timer = setTimeout(() => {
      setOperation({ operationId, qrUrl });
    }, 600);

    return () => clearTimeout(timer);
  }, [provider]);

  const simulateScan = () => {
    setIsLinked(true);
    setTimeout(() => {
      onNext(`demo-token-${provider}-${Date.now()}`);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto">
      <h2
        className="font-display font-bold text-slate-900 dark:text-white"
        style={{ fontSize: "clamp(1.25rem, 3.6vh, 1.875rem)", marginBottom: "clamp(0.25rem, 0.8vh, 0.5rem)" }}
      >
        {t("setup.auth.title")}
      </h2>
      <p
        className="text-slate-500 dark:text-white/50"
        style={{ fontSize: "clamp(0.75rem, 1.8vh, 0.95rem)", marginBottom: "clamp(0.75rem, 2.5vh, 1.5rem)" }}
      >
        {t("setup.auth.subtitle")}
      </p>

      <AnimatePresence mode="wait">
        {!provider && (
          <motion.div
            key="providers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col w-full max-w-sm"
            style={{ gap: "clamp(0.5rem, 1.5vh, 1rem)" }}
          >
            <button
              onClick={() => setProvider("google")}
              className="flex items-center justify-center gap-4 w-full font-bold rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-lg shadow-black/5 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              style={{
                paddingLeft: "clamp(1.5rem, 4vw, 2rem)",
                paddingRight: "clamp(1.5rem, 4vw, 2rem)",
                paddingTop: "clamp(0.875rem, 2.2vh, 1.25rem)",
                paddingBottom: "clamp(0.875rem, 2.2vh, 1.25rem)",
                fontSize: "clamp(0.9375rem, 2.2vh, 1.125rem)",
                minHeight: "clamp(52px, 8vh, 68px)",
              }}
            >
              <GoogleIcon className="w-7 h-7" />
              {t("setup.auth.google")}
            </button>

            <button
              onClick={() => setProvider("apple")}
              className="flex items-center justify-center gap-4 w-full font-bold rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              style={{
                paddingLeft: "clamp(1.5rem, 4vw, 2rem)",
                paddingRight: "clamp(1.5rem, 4vw, 2rem)",
                paddingTop: "clamp(0.875rem, 2.2vh, 1.25rem)",
                paddingBottom: "clamp(0.875rem, 2.2vh, 1.25rem)",
                fontSize: "clamp(0.9375rem, 2.2vh, 1.125rem)",
                minHeight: "clamp(52px, 8vh, 68px)",
              }}
            >
              <AppleIcon className="w-7 h-7" />
              {t("setup.auth.apple")}
            </button>
          </motion.div>
        )}

        {provider && !isLinked && (
          <motion.div
            key="qr-section"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center"
          >
            <div className="mb-4 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              {provider === "google" ? (
                <GoogleIcon className="w-5 h-5" />
              ) : (
                <AppleIcon className="w-5 h-5 text-slate-900 dark:text-white" />
              )}
              <span className="text-sm font-medium text-slate-600 dark:text-white/60">
                {provider === "google" ? "Google" : "Apple"}
              </span>
              <button
                onClick={() => { setProvider(null); setOperation(null); }}
                className="ml-1 text-xs text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60 underline"
              >
                {t("setup.auth.change")}
              </button>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                {!operation && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10"
                    style={{ width: "clamp(8rem, 24vh, 11rem)", height: "clamp(8rem, 24vh, 11rem)" }}
                  >
                    <Loader2 style={{ width: "clamp(1.75rem, 5vh, 2.5rem)", height: "clamp(1.75rem, 5vh, 2.5rem)" }} className="text-brand-yellow-400 animate-spin mb-3" />
                    <span className="text-xs text-slate-400 dark:text-white/30 uppercase tracking-widest font-bold">
                      Iniciando...
                    </span>
                  </motion.div>
                )}

                {operation && (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl shadow-brand-yellow-500/10"
                    style={{ padding: "clamp(0.75rem, 2vh, 1.25rem)" }}
                  >
                    <QRCodeSVG
                      value={operation.qrUrl}
                      size={Math.min(180, Math.floor((typeof window !== "undefined" ? window.innerHeight : 600) * 0.28))}
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
              </AnimatePresence>
            </div>

            <div
              className="flex items-center gap-3 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              style={{
                marginTop: "clamp(0.75rem, 2.5vh, 1.5rem)",
                paddingLeft: "clamp(1rem, 3vw, 1.25rem)",
                paddingRight: "clamp(1rem, 3vw, 1.25rem)",
                paddingTop: "clamp(0.4rem, 1.2vh, 0.625rem)",
                paddingBottom: "clamp(0.4rem, 1.2vh, 0.625rem)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-brand-yellow-400 animate-pulse" />
              <span className="text-xs text-slate-400 dark:text-white/40 uppercase tracking-widest font-bold">
                {t("setup.auth.waiting")}
              </span>
            </div>

            {operation && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={simulateScan}
                className="flex items-center gap-3 rounded-full bg-brand-yellow-400 hover:bg-brand-yellow-500 text-slate-900 font-bold uppercase tracking-widest transition-colors active:scale-95"
                style={{
                  marginTop: "clamp(0.5rem, 1.5vh, 1rem)",
                  paddingLeft: "clamp(1.5rem, 4vw, 2rem)",
                  paddingRight: "clamp(1.5rem, 4vw, 2rem)",
                  paddingTop: "clamp(0.625rem, 1.8vh, 1rem)",
                  paddingBottom: "clamp(0.625rem, 1.8vh, 1rem)",
                  fontSize: "clamp(0.75rem, 1.6vh, 0.875rem)",
                  minHeight: "clamp(40px, 6vh, 52px)",
                }}
              >
                <Smartphone style={{ width: "clamp(1rem, 2vh, 1.25rem)", height: "clamp(1rem, 2vh, 1.25rem)" }} />
                Simular escaneo (demo)
              </motion.button>
            )}
          </motion.div>
        )}

        {isLinked && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center bg-green-500/10 rounded-3xl border border-green-500/20"
            style={{ width: "clamp(10rem, 30vh, 16rem)", height: "clamp(10rem, 30vh, 16rem)" }}
          >
            <div
              className="bg-green-500 rounded-full flex items-center justify-center"
              style={{ width: "clamp(3.5rem, 9vh, 5rem)", height: "clamp(3.5rem, 9vh, 5rem)", marginBottom: "clamp(0.5rem, 1.5vh, 1rem)" }}
            >
              <ShieldCheck style={{ width: "clamp(1.75rem, 4.5vh, 2.5rem)", height: "clamp(1.75rem, 4.5vh, 2.5rem)" }} className="text-white" />
            </div>
            <span className="text-sm font-bold text-green-400">
              {t("setup.auth.success")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

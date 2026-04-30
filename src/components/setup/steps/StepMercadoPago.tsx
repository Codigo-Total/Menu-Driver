"use client";

import { CreditCard, CheckCircle2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useLangStore } from "@/store/lang/lang.slice";

interface StepProps {
  onNext: () => void;
}

const TITLE_FONT = "clamp(1.25rem, 3.6vh, 1.875rem)";
const BODY_FONT = "clamp(0.75rem, 1.8vh, 0.95rem)";
const ICON_BOX = "clamp(2.75rem, 7.5vh, 4rem)";
const ICON_INNER = "clamp(1.25rem, 4vh, 2rem)";

export default function StepMercadoPago({ onNext }: StepProps) {
  const { t } = useLangStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setTimeout(onNext, 1500);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto">
      <h2
        className="font-display font-bold text-slate-900 dark:text-white"
        style={{ fontSize: TITLE_FONT, marginBottom: "clamp(0.25rem, 0.8vh, 0.5rem)" }}
      >
        {t("setup.payments.title")}
      </h2>
      <p
        className="text-slate-500 dark:text-white/50"
        style={{ fontSize: BODY_FONT, marginBottom: "clamp(0.75rem, 2.5vh, 1.5rem)" }}
      >
        {t("setup.payments.subtitle")}
      </p>

      <div
        className="w-full max-w-sm rounded-[2rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 relative overflow-hidden group"
        style={{ padding: "clamp(1rem, 3vh, 1.5rem)" }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors" />

        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`rounded-2xl flex items-center justify-center transition-colors duration-500 ${
              isConnected ? "bg-green-500/20" : "bg-blue-500/10"
            }`}
            style={{ width: ICON_BOX, height: ICON_BOX, marginBottom: "clamp(0.5rem, 1.5vh, 1rem)" }}
          >
            {isConnected ? (
              <CheckCircle2 style={{ width: ICON_INNER, height: ICON_INNER }} className="text-green-500" />
            ) : (
              <CreditCard style={{ width: ICON_INNER, height: ICON_INNER }} className="text-blue-400" />
            )}
          </div>

          <h3
            className="font-bold text-slate-900 dark:text-white"
            style={{ fontSize: "clamp(1rem, 2.4vh, 1.25rem)", marginBottom: "clamp(0.25rem, 0.8vh, 0.5rem)" }}
          >
            Mercado Pago
          </h3>
          <p
            className="text-slate-500 dark:text-white/40 px-4"
            style={{ fontSize: "clamp(0.75rem, 1.6vh, 0.875rem)", marginBottom: "clamp(0.75rem, 2.5vh, 1.5rem)" }}
          >
            Recibe pagos con QR, tarjetas y billeteras virtuales de forma instantánea.
          </p>

          <button
            onClick={handleConnect}
            disabled={isConnected || isConnecting}
            className={`w-full flex items-center justify-center gap-3 rounded-2xl font-bold transition-all ${
              isConnected
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : "bg-[#009EE3] hover:bg-[#0089C7] text-white shadow-xl shadow-blue-500/10 active:scale-95"
            }`}
            style={{
              paddingTop: "clamp(0.75rem, 2vh, 1.25rem)",
              paddingBottom: "clamp(0.75rem, 2vh, 1.25rem)",
              fontSize: "clamp(0.875rem, 2vh, 1.125rem)",
              minHeight: "clamp(48px, 7vh, 60px)",
            }}
          >
            {isConnecting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isConnected ? (
              <>
                <CheckCircle2 style={{ width: "clamp(1rem, 2vh, 1.25rem)", height: "clamp(1rem, 2vh, 1.25rem)" }} />
                {t("setup.payments.connected")}
              </>
            ) : (
              <>
                <ExternalLink style={{ width: "clamp(1rem, 2vh, 1.25rem)", height: "clamp(1rem, 2vh, 1.25rem)" }} />
                {t("setup.payments.connect")}
              </>
            )}
          </button>
        </div>
      </div>

      <button
        onClick={onNext}
        className="rounded-full text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60 font-medium transition-colors"
        style={{
          marginTop: "clamp(0.75rem, 2.5vh, 1.5rem)",
          paddingLeft: "clamp(1.5rem, 4vw, 2rem)",
          paddingRight: "clamp(1.5rem, 4vw, 2rem)",
          paddingTop: "clamp(0.5rem, 1.5vh, 0.75rem)",
          paddingBottom: "clamp(0.5rem, 1.5vh, 0.75rem)",
          fontSize: "clamp(0.8125rem, 1.8vh, 1rem)",
          minHeight: "clamp(40px, 6vh, 48px)",
        }}
      >
        Omitir por ahora
      </button>
    </div>
  );
}

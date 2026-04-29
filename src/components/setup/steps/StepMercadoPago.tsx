"use client";

import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useLangStore } from "@/store/lang/lang.slice";

interface StepProps {
  onNext: () => void;
}

export default function StepMercadoPago({ onNext }: StepProps) {
  const { t } = useLangStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Mock connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setTimeout(onNext, 1500);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center text-center max-w-xl mx-auto py-8">
      <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
        {t("setup.payments.title")}
      </h2>
      <p className="text-slate-500 dark:text-white/50 mb-12">
        {t("setup.payments.subtitle")}
      </p>

      <div className="w-full max-w-sm p-8 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 relative overflow-hidden group">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${
            isConnected ? "bg-green-500/20" : "bg-blue-500/10"
          }`}>
            {isConnected ? (
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            ) : (
              <CreditCard className="w-10 h-10 text-blue-400" />
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Mercado Pago</h3>
          <p className="text-sm text-slate-500 dark:text-white/40 mb-8 px-4">
            Recibe pagos con QR, tarjetas y billeteras virtuales de forma instantánea.
          </p>

          <button
            onClick={handleConnect}
            disabled={isConnected || isConnecting}
            className={`w-full flex items-center justify-center gap-3 py-5 text-lg rounded-2xl font-bold transition-all min-h-[60px] ${
              isConnected
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : "bg-[#009EE3] hover:bg-[#0089C7] text-white shadow-xl shadow-blue-500/10 active:scale-95"
            }`}
          >
            {isConnecting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isConnected ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {t("setup.payments.connected")}
              </>
            ) : (
              <>
                <ExternalLink className="w-5 h-5" />
                {t("setup.payments.connect")}
              </>
            )}
          </button>
        </div>
      </div>

      <button 
        onClick={onNext}
        className="mt-12 text-base px-8 py-4 rounded-full text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60 font-medium transition-colors min-h-[52px]"
      >
        Omitir por ahora
      </button>
    </div>
  );
}

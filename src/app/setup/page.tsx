"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/setup/Stepper";
import { useLangStore } from "@/store/lang/lang.slice";

// Steps
import StepWelcome from "@/components/setup/steps/StepWelcome";
import StepDeviceAuth from "@/components/setup/steps/StepDeviceAuth";
import StepMercadoPago from "@/components/setup/steps/StepMercadoPago";
import StepPinSetup from "@/components/setup/steps/StepPinSetup";
import StepSuccess from "@/components/setup/steps/StepSuccess";
import { SetupSettings } from "@/components/setup/SetupSettings";

export default function SetupPage() {
  const [step, setStep] = useState(0);
  const [setupData, setSetupData] = useState({
    token: "",
    pin: "",
  });
  const router = useRouter();
  const { hydrated } = useLangStore();

  if (!hydrated) return null;

  const nextStep = () => setStep((s) => s + 1);

  const handleAuthComplete = (token: string) => {
    setSetupData((prev) => ({ ...prev, token }));
    nextStep();
  };

  const handlePinComplete = (pin: string) => {
    setSetupData((prev) => ({ ...prev, pin }));
    nextStep();
  };

  const handleFinish = () => {
    // In a real app, we would save the setup state to local storage or backend
    localStorage.setItem("kiosk_setup_complete", "true");
    localStorage.setItem("kiosk_token", setupData.token);
    window.location.href = "/admin/login"; // Hard redirect to refresh state if needed
  };

  return (
    <main className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
      <SetupSettings />
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-yellow-500/20 dark:bg-brand-yellow-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="z-10 w-full max-w-4xl px-6 flex flex-col">
        {/* Stepper only visible from Step 1 onwards, or keep it always? 
            Let's keep it from Step 1 to show progress. */}
        {step > 0 && step < 4 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Stepper currentStep={step} />
          </motion.div>
        )}

        <div className="relative min-h-[500px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              {step === 0 && <StepWelcome onNext={nextStep} />}
              {step === 1 && <StepDeviceAuth onNext={handleAuthComplete} />}
              {step === 2 && <StepMercadoPago onNext={nextStep} />}
              {step === 3 && <StepPinSetup onNext={handlePinComplete} />}
              {step === 4 && <StepSuccess onFinish={handleFinish} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Brand */}
      <div className="absolute bottom-8 left-0 w-full text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-300 dark:text-white/20 font-bold">
          Menu Driver
        </span>
      </div>
    </main>
  );
}

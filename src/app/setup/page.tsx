"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stepper } from "@/components/setup/Stepper";
import { useLangStore } from "@/store/lang/lang.slice";

import StepLanguage from "@/components/setup/steps/StepLanguage";
import StepWelcome from "@/components/setup/steps/StepWelcome";
import StepDeviceAuth from "@/components/setup/steps/StepDeviceAuth";
import StepMercadoPago from "@/components/setup/steps/StepMercadoPago";
import StepPinSetup from "@/components/setup/steps/StepPinSetup";
import StepSuccess from "@/components/setup/steps/StepSuccess";

export default function SetupPage() {
  const [step, setStep] = useState(0);
  const [setupData, setSetupData] = useState({ token: "", pin: "" });
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
    localStorage.setItem("kiosk_setup_complete", "true");
    localStorage.setItem("kiosk_token", setupData.token);
    window.location.href = "/admin/login";
  };

  const showStepper = step >= 2 && step <= 4;

  return (
    <main
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500"
      style={{ height: "100dvh" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-yellow-500/20 dark:bg-brand-yellow-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {showStepper && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 shrink-0"
        >
          <Stepper currentStep={step - 1} />
        </motion.div>
      )}

      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center overflow-hidden px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full max-w-4xl"
          >
            {step === 0 && <StepLanguage onNext={nextStep} />}
            {step === 1 && <StepWelcome onNext={nextStep} />}
            {step === 2 && <StepDeviceAuth onNext={handleAuthComplete} />}
            {step === 3 && <StepMercadoPago onNext={nextStep} />}
            {step === 4 && <StepPinSetup onNext={handlePinComplete} />}
            {step === 5 && <StepSuccess onFinish={handleFinish} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 shrink-0 text-center pb-3 pt-1">
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-300 dark:text-white/20 font-bold">
          Menu Driver
        </span>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { LockKeyhole } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLangStore } from "@/store/lang/lang.slice";
import { PinPad } from "@/components/ui/PinPad";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginWithPin, isLoading, isAdmin } = useAuthStore();
  const { t, hydrated } = useLangStore();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      router.push("/dashboard");
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (pin.length !== 4) {
      if (error) setError(false);
      return;
    }
    const currentPin = pin;
    const timer = setTimeout(async () => {
      const success = await loginWithPin(currentPin);
      if (!success) {
        setError(true);
        setPin("");
      }
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  if (!hydrated) return null;

  return (
    <div className="relative flex flex-col items-center select-none">
      <div className="mb-8 flex items-center justify-center">
        <LockKeyhole className="h-12 w-12 text-slate-800 dark:text-slate-200 stroke-1" />
      </div>

      <h1 className="text-[24px] font-medium text-slate-900 dark:text-white mb-2 tracking-tight">
        {t("admin.login_title")}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-12 text-center max-w-[240px] font-normal leading-relaxed">
        {t("admin.login_subtitle")}
      </p>

      <PinPad pin={pin} onChange={setPin} error={error} disabled={isLoading} />

      <div className="h-6 mt-3 flex items-center justify-center">
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
    </div>
  );
}

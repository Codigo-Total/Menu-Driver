'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { ShieldCheck, Delete, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLangStore } from '@/store/lang/lang.slice';
import { cn } from '@/lib/cn';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginWithPin, isLoading, isAdmin } = useAuthStore();
  const { t } = useLangStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // If already admin, redirect to dashboard
  useEffect(() => {
    if (isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, router]);

  const handleSubmit = useCallback(async (currentPin: string) => {
    const success = await loginWithPin(currentPin);
    if (!success) {
      setError(true);
      setPin('');
    }
  }, [loginWithPin]);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        handleSubmit(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const numpad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <div className="relative flex flex-col items-center">
      <div className="h-16 w-16 bg-brand-yellow-50 dark:bg-brand-yellow-500/10 rounded-2xl flex items-center justify-center mb-6">
        <ShieldCheck className="h-8 w-8 text-brand-yellow-600 dark:text-brand-yellow-500" />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
        {t('admin.login_title')}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 text-center max-w-[240px]">
        {t('admin.login_subtitle')}
      </p>

      {/* PIN Indicators */}
      <div className="flex gap-4 mb-10">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: pin.length > i ? 1.2 : 1,
              backgroundColor: error 
                ? '#ef4444' 
                : pin.length > i ? '#f59e0b' : '#e2e8f0'
            }}
            className={cn(
              "h-3.5 w-3.5 rounded-full transition-colors duration-200",
              pin.length <= i && !error && "dark:bg-slate-700"
            )}
          />
        ))}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-xs font-bold mb-4 uppercase tracking-widest"
          >
            {t('admin.invalid_pin')}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
        {numpad.map((num) => (
          <button
            key={num}
            onClick={() => handleKeyPress(num)}
            disabled={isLoading}
            className="h-16 w-full flex items-center justify-center text-xl font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all hover:bg-brand-yellow-50 dark:hover:bg-brand-yellow-500/20 hover:border-brand-yellow-200 dark:hover:border-brand-yellow-500/40 hover:text-brand-yellow-700 dark:hover:text-brand-yellow-500 active:scale-95 disabled:opacity-50"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleDelete}
          disabled={isLoading || pin.length === 0}
          className="h-16 w-full flex items-center justify-center bg-transparent rounded-2xl text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors active:scale-95"
        >
          <Delete className="h-6 w-6" />
        </button>
      </div>

      <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 w-full flex flex-col items-center">
         <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Lock className="h-3 w-3" />
            {t('admin.secure_connection')}
         </div>
         <p className="text-slate-400 dark:text-slate-600 text-[10px] text-center italic">
            {t('admin.auth_only')}
         </p>
      </div>
    </div>
  );
}

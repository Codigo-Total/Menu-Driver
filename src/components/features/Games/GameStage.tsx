'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Trophy, Timer, Hash } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLangStore } from '@/store/lang/lang.slice';
import { cn } from '@/lib/cn';

interface GameStageProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  title: string;
  isWon: boolean;
  stats?: {
    time: number;
    moves: number;
  };
  children: React.ReactNode;
}

/**
 * Premium Game Stage Container.
 * Provides a viewport-fullscreen, immersive environment for games.
 * Handles scroll locking and win-state overlays.
 */
export const GameStage = ({
  isOpen,
  onClose,
  onRestart,
  title,
  isWon,
  stats,
  children
}: GameStageProps) => {
  const { lang } = useLangStore();
  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[60] flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-brand-yellow-500 animate-pulse" />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {lang === 'es' ? 'Jugando' : 'Playing'}: <span className="text-slate-900 dark:text-white">{title}</span>
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-500 hover:text-white transition-all active:scale-90"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Game Body */}
          <div className="flex-1 relative flex items-center justify-center p-4 min-h-0 overflow-hidden">
            <div className="w-full max-w-4xl max-h-full flex flex-col items-center justify-center">
              {children}
            </div>
          </div>

          {/* Win Overlay */}
          <AnimatePresence>
            {isWon && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[70] bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 sm:p-16 shadow-2xl border-4 border-brand-yellow-500/30 w-full max-w-lg text-center relative overflow-hidden"
                >
                  {/* Decorative Sparkles background could go here */}
                  <div className="relative z-10">
                    <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-brand-yellow-500/10 mb-8 border-4 border-brand-yellow-500/20">
                      <Trophy className="h-12 w-12 text-brand-yellow-500 animate-bounce" />
                    </div>
                    
                    <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
                      {lang === 'es' ? '¡Increíble!' : 'Amazing!'}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs mb-10">
                      {lang === 'es' ? 'Eres un maestro del juego' : 'You are a game master'}
                    </p>

                    {stats && (
                      <div className="grid grid-cols-2 gap-4 mb-12">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                          <Timer className="h-5 w-5 text-brand-yellow-500 mx-auto mb-2" />
                          <span className="block text-2xl font-black text-slate-900 dark:text-white">{stats.time}s</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {lang === 'es' ? 'Tiempo' : 'Time'}
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                          <Hash className="h-5 w-5 text-brand-yellow-500 mx-auto mb-2" />
                          <span className="block text-2xl font-black text-slate-900 dark:text-white">{stats.moves}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {lang === 'es' ? 'Movimientos' : 'Moves'}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-4">
                      <Button 
                        size="lg" 
                        fullWidth 
                        onClick={onRestart}
                        className="bg-brand-yellow-500 hover:bg-brand-yellow-600 text-brand-yellow-950 font-black h-16 rounded-2xl text-lg uppercase tracking-widest"
                        leftIcon={<RotateCcw className="h-5 w-5" />}
                      >
                        {lang === 'es' ? 'Jugar de nuevo' : 'Play again'}
                      </Button>
                      <Button 
                        variant="outline"
                        size="lg" 
                        fullWidth 
                        onClick={onClose}
                        className="border-2 border-slate-200 dark:border-slate-800 h-16 rounded-2xl text-slate-500 uppercase font-black text-sm tracking-widest"
                      >
                        {lang === 'es' ? 'Salir al menú' : 'Back to menu'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

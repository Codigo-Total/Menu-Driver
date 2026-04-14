'use client';

import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useLangStore } from '@/store/lang/lang.slice';
import { cn } from '@/lib/cn';
import { BrainCircuit, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const FOOD_EMOJIS = ['🍔', '🍕', '🌮', '🍣', '🍦', '🍩', '🍟', '🥤'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onWin: (stats: { time: number; moves: number }) => void;
}

export interface MemoryGameHandle {
  restart: () => void;
}

/**
 * Premium Memory Match Game for GameStage.
 */
const MemoryGame = forwardRef<MemoryGameHandle, MemoryGameProps>(({ onWin }, ref) => {
  const { t, lang, hydrated } = useLangStore();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const initGame = useCallback(() => {
    const duplicatedEmojis = [...FOOD_EMOJIS, ...FOOD_EMOJIS];
    const shuffled = duplicatedEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  }, []);

  useImperativeHandle(ref, () => ({
    restart: initGame
  }));

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isWon) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isWon]);

  const handleCardClick = (id: number) => {
    if (isWon || flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlipped;
      
      if (cards[firstId].emoji === cards[secondId].emoji) {
        setCards(prev => prev.map(card => 
          (card.id === firstId || card.id === secondId) 
            ? { ...card, isMatched: true } 
            : card
        ));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            (card.id === firstId || card.id === secondId) 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched) && !isWon) {
      setIsWon(true);
      onWin({ time: elapsedTime, moves });
    }
  }, [cards, isWon, onWin, elapsedTime, moves]);

  if (!hydrated) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-2xl px-4 overflow-hidden">
      {/* Visual HUD */}
      <div className="w-full flex justify-between mb-4 sm:mb-8 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {lang === 'es' ? 'Progreso' : 'Progress'}
          </span>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: FOOD_EMOJIS.length }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 w-4 sm:w-6 rounded-full transition-all duration-500",
                  i < cards.filter(c => c.isMatched).length / 2 
                    ? "bg-brand-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" 
                    : "bg-slate-200 dark:bg-slate-800"
                )} 
              />
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {lang === 'es' ? 'Tiempo' : 'Time'}
          </span>
          <div className="flex items-center gap-3">
            <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tabular-nums">{elapsedTime}s</p>
            <button 
              onClick={initGame}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-yellow-600 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-square max-h-[55vh] sm:max-h-[60vh] flex items-center justify-center">
        <div className="grid grid-cols-4 grid-rows-4 gap-2 sm:gap-4 w-full h-full">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={cn(
                "relative cursor-pointer rounded-xl sm:rounded-[2rem] transition-all duration-500 preserve-3d perspective-1000 transform-gpu",
                (card.isFlipped || card.isMatched) ? "rotate-y-180" : "hover:scale-105 active:scale-95"
              )}
            >
              <div className={cn(
                 "absolute inset-0 backface-hidden rounded-xl sm:rounded-[2rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-lg flex items-center justify-center transition-all",
                 (!card.isFlipped && !card.isMatched) && "hover:border-brand-yellow-500 group"
              )}>
                <BrainCircuit className="h-6 w-6 sm:h-10 sm:w-10 text-slate-200 dark:text-slate-800 group-hover:text-brand-yellow-500/30 transition-colors" />
              </div>
              
              <div className={cn(
                "absolute inset-0 backface-hidden rounded-xl sm:rounded-[2rem] rotate-y-180 flex items-center justify-center text-2xl sm:text-4xl border-4 shadow-2xl",
                card.isMatched 
                  ? "bg-green-500 border-green-400 text-white" 
                  : "bg-white dark:bg-slate-900 border-brand-yellow-500 shadow-brand-yellow-500/20"
              )}>
                {card.emoji}
                {card.isMatched && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-[2rem] pointer-events-none" 
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-10 flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 px-6 py-2 rounded-full border border-slate-200 dark:border-slate-800 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
            {lang === 'es' ? 'Movimientos' : 'Moves'}: {moves}
          </span>
        </div>
        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
          {lang === 'es' ? 'Parejas' : 'Pairs'}: {FOOD_EMOJIS.length}
        </span>
      </div>
    </div>
  );
});

MemoryGame.displayName = 'MemoryGame';

export default MemoryGame;

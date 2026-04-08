'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLangStore } from '@/store/lang/lang.slice';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { Timer, Trophy, RotateCcw, BrainCircuit } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// Interactive pairs for the kiosk experience
const FOOD_EMOJIS = ['🍔', '🍕', '🌮', '🍣', '🍦', '🍩', '🍟', '🥤'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

/**
 * Premium Memory Match Game.
 * Features: Confetti on win, move counter, timer, and high-contrast design.
 */
export const MemoryGame = () => {
  const { t, hydrated } = useLangStore();
  const { width, height } = useWindowSize();
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
      const now = Date.now();
      setStartTime(now);
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
        
        // Use a timeout or functional check to see if all are matched
        // since state updates are async
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            (card.id === firstId || card.id === secondId) 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Effect to check win condition after cards update
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsWon(true);
    }
  }, [cards]);

  if (!hydrated) return null;

  return (
    <div className="flex flex-col items-center bg-white dark:bg-slate-900 p-4 sm:p-12 rounded-3xl lg:rounded-[3rem] shadow-2xl border-2 sm:border-4 border-slate-50 dark:border-slate-800">
      {isWon && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={300} colors={['#eab308', '#facc15']} />}
      
      {/* HUD Bar */}
      <div className="w-full flex items-center justify-between mb-8 sm:mb-12 bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-3xl sm:rounded-4xl ring-1 ring-slate-100 dark:ring-slate-800 shadow-inner">
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex flex-col items-center px-4 sm:px-6 border-r border-slate-200 dark:border-slate-800">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1">{t('games.moves')}</span>
            <span className="text-xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">{moves}</span>
          </div>
          <div className="flex flex-col items-center px-4 sm:px-6">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1">{t('games.time')}</span>
            <div className="flex items-center gap-1 sm:gap-2 text-xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              <Timer className="h-4 w-4 sm:h-6 sm:w-6 text-brand-yellow-500" />
              {elapsedTime}s
            </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          onClick={initGame} 
          className="h-10 w-10 sm:h-16 sm:w-16 p-0 rounded-lg sm:rounded-full bg-white dark:bg-slate-800 hover:rotate-180 transition-transform duration-500 shadow-md"
        >
          <RotateCcw className="h-4 w-4 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-6 max-w-2xl w-full">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={cn(
              "relative aspect-square cursor-pointer rounded-xl sm:rounded-3xl transition-all duration-500 preserve-3d perspective-1000 transform-gpu",
              (card.isFlipped || card.isMatched) ? "rotate-y-180" : "hover:scale-105 active:scale-95"
            )}
          >
            {/* Front of card (Hidden emoji) */}
            <div className={cn(
               "absolute inset-0 backface-hidden rounded-xl sm:rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent shadow-md flex items-center justify-center transition-all",
               (!card.isFlipped && !card.isMatched) && "hover:bg-brand-yellow-400 dark:hover:bg-brand-yellow-900/50 hover:border-brand-yellow-500"
            )}>
              <BrainCircuit className="h-6 w-6 sm:h-8 sm:w-8 text-slate-300 dark:text-slate-700" />
            </div>
            
            {/* Back of card (Emoji revealed) */}
            <div className={cn(
              "absolute inset-0 backface-hidden rounded-xl sm:rounded-3xl rotate-y-180 flex items-center justify-center text-2xl sm:text-5xl border-2 sm:border-4 shadow-xl",
              card.isMatched ? "bg-green-500 border-green-400" : "bg-white dark:bg-slate-800 border-brand-yellow-500"
            )}>
              {card.emoji}
            </div>
          </div>
        ))}
      </div>

      {/* Winning State UI */}
      {isWon && (
        <div className="mt-8 sm:mt-12 text-center animate-in zoom-in duration-500">
          <div className="inline-flex items-center gap-4 bg-slate-900 text-white px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-[2rem] shadow-2xl">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-brand-yellow-500" />
            <div className="text-left">
              <h4 className="font-black uppercase tracking-tighter text-lg sm:text-xl">{t('games.congrats')}</h4>
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-rose-100 opacity-80 leading-none">Puzzle Master</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

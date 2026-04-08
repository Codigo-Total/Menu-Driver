'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLangStore } from '@/store/lang/lang.slice';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { RefreshCcw, Trophy, LayoutGrid, Timer } from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

/**
 * 3x3 Sliding Puzzle Game.
 * Optimized for 350px+ screens with a premium 'Squarer' aesthetic.
 */
export const PuzzleGame = () => {
  const { t, lang, hydrated } = useLangStore();
  const { width, height } = useWindowSize();
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const getNeighbors = useCallback((index: number) => {
    const neighbors = [];
    if (index % 3 > 0) neighbors.push(index - 1); // Left
    if (index % 3 < 2) neighbors.push(index + 1); // Right
    if (index >= 3) neighbors.push(index - 3);    // Top
    if (index < 6) neighbors.push(index + 3);     // Bottom
    return neighbors;
  }, []);

  const [tiles, setTiles] = useState<number[]>(() => {
    const initialTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    const shuffled = [...initialTiles];
    // Simple shuffle logic that ensures solvability
    for (let i = 0; i < 200; i++) {
       const emptyIndex = shuffled.indexOf(0);
       const neighbors = [
          emptyIndex % 3 > 0 ? emptyIndex - 1 : -1,
          emptyIndex % 3 < 2 ? emptyIndex + 1 : -1,
          emptyIndex >= 3 ? emptyIndex - 3 : -1,
          emptyIndex < 6 ? emptyIndex + 3 : -1
       ].filter(n => n !== -1);
       const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
       [shuffled[emptyIndex], shuffled[randomNeighbor]] = [shuffled[randomNeighbor], shuffled[emptyIndex]];
    }
    return shuffled;
  });

  const initGame = useCallback(() => {
    const initialTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    const shuffled = [...initialTiles];
    
    // Simple shuffle logic that ensures solvability
    for (let i = 0; i < 200; i++) {
       const emptyIndex = shuffled.indexOf(0);
       const neighbors = getNeighbors(emptyIndex);
       const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
       [shuffled[emptyIndex], shuffled[randomNeighbor]] = [shuffled[randomNeighbor], shuffled[emptyIndex]];
    }

    setTiles(shuffled);
    setMoves(0);
    setIsWon(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  }, [getNeighbors]);

  useEffect(() => {
    // initGame() no longer needed on mount due to lazy initializer
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isWon) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isWon]);

  const handleTileClick = (index: number) => {
    if (isWon) return;

    const emptyIndex = tiles.indexOf(0);
    const isNeighbor = getNeighbors(emptyIndex).includes(index);

    if (isNeighbor) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(moves + 1);

      if (newTiles.every((val, i) => val === (i === 8 ? 0 : i + 1))) {
        setIsWon(true);
      }
    }
  };

  if (!hydrated) return null;

  return (
    <div className="flex flex-col items-center bg-white dark:bg-slate-900 p-4 sm:p-12 rounded-3xl lg:rounded-[3rem] shadow-2xl border-2 sm:border-4 border-slate-50 dark:border-slate-800">
      {isWon && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={300} colors={['#fb7185', '#eab308']} />}
      
      {/* HUD Bar */}
      <div className="w-full flex items-center justify-between mb-8 sm:mb-12 bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-xl sm:rounded-4xl ring-1 ring-slate-100 dark:ring-slate-800 shadow-inner">
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex flex-col items-center px-4 sm:px-6 border-r border-slate-200 dark:border-slate-800">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1">{t('games.moves')}</span>
            <span className="text-xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">{moves}</span>
          </div>
          <div className="flex flex-col items-center px-4 sm:px-6">
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400 mb-1">{t('games.time')}</span>
            <div className="flex items-center gap-1 sm:gap-2 text-xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              <Timer className="h-4 w-4 sm:h-6 sm:w-6 text-rose-500" />
              {elapsedTime}s
            </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          onClick={initGame} 
          className="h-10 w-10 sm:h-16 sm:w-16 p-0 rounded-lg sm:rounded-full bg-white dark:bg-slate-800 hover:rotate-180 transition-transform duration-500 shadow-md"
        >
          <RefreshCcw className="h-4 w-4 sm:h-6 sm:w-6" />
        </Button>
      </div>

      <div className="relative w-full flex justify-center">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-slate-100 dark:bg-slate-950 p-3 sm:p-4 rounded-xl sm:rounded-4xl shadow-inner">
          {tiles.map((tile, index) => (
            <div
              key={index}
              onClick={() => handleTileClick(index)}
              className={cn(
                "h-16 w-16 xs:h-20 xs:w-20 sm:h-28 sm:w-28 flex items-center justify-center text-2xl sm:text-3xl font-display font-black rounded-lg sm:rounded-2xl transition-all duration-300 transform-gpu cursor-pointer shadow-lg",
                tile === 0 
                  ? "bg-transparent shadow-none border-2 border-dashed border-slate-300 dark:border-slate-800" 
                  : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-transparent hover:border-rose-400 hover:scale-[1.03] active:scale-95"
              )}
            >
              {tile !== 0 && tile}
            </div>
          ))}
        </div>
      </div>

       {/* Winning State UI */}
       {isWon ? (
        <div className="mt-8 sm:mt-12 text-center animate-in zoom-in duration-500">
           <div className="inline-flex items-center gap-3 sm:gap-4 bg-rose-500 text-white px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-4xl shadow-2xl">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              <div className="text-left">
                <h4 className="font-black uppercase tracking-tighter text-lg sm:text-xl">{t('games.congrats')}</h4>
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-rose-100 opacity-80 uppercase leading-none">Puzzle Master</p>
              </div>
            </div>
        </div>
      ) : (
        <div className="mt-8 sm:mt-12 flex items-center gap-3 bg-slate-100 dark:bg-slate-950 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-full opacity-60">
          <LayoutGrid className="h-4 w-4 text-slate-400" />
          <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-400">
            {t('games.grid')} 3x3 • {lang === 'es' ? 'Desliza para ordenar' : 'Slide to sort'}
          </span>
        </div>
      )}
    </div>
  );
};

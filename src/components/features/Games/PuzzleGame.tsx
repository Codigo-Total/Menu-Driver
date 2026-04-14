'use client';

import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useLangStore } from '@/store/lang/lang.slice';
import { cn } from '@/lib/cn';
import { RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface PuzzleGameProps {
  onWin: (stats: { time: number; moves: number }) => void;
}

export interface PuzzleGameHandle {
  restart: () => void;
}

/**
 * Premium 3x3 Sliding Puzzle Game for GameStage.
 */
const PuzzleGame = forwardRef<PuzzleGameHandle, PuzzleGameProps>(({ onWin }, ref) => {
  const { t, lang, hydrated } = useLangStore();
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

  const shuffleTiles = (initialTiles: number[]) => {
    const shuffled = [...initialTiles];
    for (let i = 0; i < 200; i++) {
       const emptyIndex = shuffled.indexOf(0);
       const neighbors = getNeighbors(emptyIndex);
       const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
       [shuffled[emptyIndex], shuffled[randomNeighbor]] = [shuffled[randomNeighbor], shuffled[emptyIndex]];
    }
    return shuffled;
  };

  const [tiles, setTiles] = useState<number[]>(() => shuffleTiles([1, 2, 3, 4, 5, 6, 7, 8, 0]));

  const initGame = useCallback(() => {
    setTiles(shuffleTiles([1, 2, 3, 4, 5, 6, 7, 8, 0]));
    setMoves(0);
    setIsWon(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  }, [getNeighbors]);

  useImperativeHandle(ref, () => ({
    restart: initGame
  }));

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
      if (!startTime) setStartTime(Date.now());
      
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(moves + 1);

      if (newTiles.every((val, i) => val === (i === 8 ? 0 : i + 1))) {
        setIsWon(true);
        onWin({ time: elapsedTime, moves: moves + 1 });
      }
    }
  };

  if (!hydrated) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-md px-4 overflow-hidden">
      {/* Visual HUD */}
      <div className="w-full flex justify-between mb-4 sm:mb-8 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {lang === 'es' ? 'Objetivo' : 'Goal'}
          </span>
          <p className="text-[10px] font-black text-rose-500 uppercase">
            {lang === 'es' ? 'Ordenar 1-8' : 'Order 1-8'}
          </p>
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
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-square max-h-[55vh] sm:max-h-[60vh] bg-slate-200 dark:bg-slate-900 p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-inner border border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 h-full w-full">
          {tiles.map((tile, index) => (
            <motion.div
              key={index}
              layout
              onClick={() => handleTileClick(index)}
              className={cn(
                "flex items-center justify-center text-2xl sm:text-3xl font-display font-black rounded-xl sm:rounded-2xl transition-all duration-300 transform-gpu cursor-pointer",
                tile === 0 
                  ? "bg-transparent border-2 border-dashed border-slate-300 dark:border-slate-800" 
                  : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-700 hover:scale-[1.05] active:scale-95 z-10"
              )}
            >
              {tile !== 0 && tile}
            </motion.div>
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
          {lang === 'es' ? 'Dificultad' : 'Difficulty'}: Pro
        </span>
      </div>
    </div>
  );
});

PuzzleGame.displayName = 'PuzzleGame';

export default PuzzleGame;

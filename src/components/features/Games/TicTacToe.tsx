'use client';

import { useState, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useLangStore } from '@/store/lang/lang.slice';
import { cn } from '@/lib/cn';
import { X, Circle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TicTacToeProps {
  onWin: (stats: { time: number; moves: number }) => void;
}

export interface TicTacToeHandle {
  restart: () => void;
}

type SquareValue = 'X' | 'O' | null;

const TicTacToe = forwardRef<TicTacToeHandle, TicTacToeProps>(({ onWin }, ref) => {
  const { lang, hydrated } = useLangStore();
  const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<SquareValue | 'draw'>(null);
  const [moves, setMoves] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  const calculateWinner = (squares: SquareValue[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diags
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(s => s !== null) ? 'draw' : null;
  };

  const handleClick = (i: number) => {
    if (winner || board[i]) return;

    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setMoves(m => m + 1);

    const winStatus = calculateWinner(newBoard);
    if (winStatus) {
      setWinner(winStatus);
      const end = Math.floor((Date.now() - startTime) / 1000);
      onWin({ time: end, moves: moves + 1 });
    }
  };

  const restart = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setMoves(0);
  }, []);

  useImperativeHandle(ref, () => ({ restart }));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!winner) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, winner]);

  if (!hydrated) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-md px-4 overflow-hidden">
      {/* HUD: Turn Indicator */}
      <div className="w-full flex justify-between mb-6 sm:mb-10 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {lang === 'es' ? 'Turno' : 'Turn'}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-500",
              isXNext 
                ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-500 scale-110 shadow-lg shadow-indigo-500/10" 
                : "bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400 opacity-50"
            )}>
              <X className="h-3 w-3" />
              <span className="text-[10px] font-black uppercase">P1</span>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-500",
              !isXNext 
                ? "bg-rose-500/10 border-rose-500/50 text-rose-500 scale-110 shadow-lg shadow-rose-500/10" 
                : "bg-slate-100 dark:bg-slate-800 border-transparent text-slate-400 opacity-50"
            )}>
              <Circle className="h-3 w-3" />
              <span className="text-[10px] font-black uppercase">P2</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {lang === 'es' ? 'Tiempo' : 'Time'}
          </span>
          <div className="flex items-center gap-3">
             <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{elapsedTime}s</p>
             <button 
              onClick={restart}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-yellow-600 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="relative w-full aspect-square max-h-[55vh] bg-slate-200 dark:bg-slate-900 p-2 sm:p-4 rounded-[2rem] shadow-inner border border-slate-100 dark:border-slate-800">
        <div className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-4 h-full w-full">
          {board.map((square, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(i)}
              className={cn(
                "flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm transition-colors duration-300",
                !square && !winner && "hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer",
                square === 'X' && "text-indigo-500",
                square === 'O' && "text-rose-500"
              )}
            >
              <AnimatePresence mode="wait">
                {square === 'X' && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                  >
                    <X className="h-10 w-10 sm:h-16 sm:w-16 stroke-[3]" />
                  </motion.div>
                )}
                {square === 'O' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Circle className="h-10 w-10 sm:h-16 sm:w-16 stroke-[3]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Local Win Status (Separate from GameStage overlay for better UX) */}
      <div className="mt-8 flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 px-8 py-3 rounded-full border border-slate-200 dark:border-slate-800 backdrop-blur-sm shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
            {lang === 'es' ? 'ESTADO DE PARTIDA' : 'MATCH STATUS'}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {!winner ? (
                lang === 'es' ? `Esperando a P${isXNext ? '1' : '2'}...` : `Waiting for P${isXNext ? '1' : '2'}...`
              ) : winner === 'draw' ? (
                lang === 'es' ? '¡EMPATE!' : 'DRAW!'
              ) : (
                lang === 'es' ? `¡GANA P${winner === 'X' ? '1' : '2'}!` : `P${winner === 'X' ? '1' : '2'} WINS!`
              )}
            </span>
            {winner && (
              <button 
                onClick={restart}
                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
              >
                <RotateCcw className="h-3 w-3" />
                {lang === 'es' ? 'Reintentar' : 'Play Again'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

TicTacToe.displayName = 'TicTacToe';

export default TicTacToe;

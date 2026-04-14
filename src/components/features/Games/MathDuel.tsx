"use client";

import {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import { useLangStore } from "@/store/lang/lang.slice";
import { cn } from "@/lib/cn";
import { Brain, Trophy, RotateCcw, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MathDuelProps {
  onWin: (stats: { time: number; moves: number }) => void;
}

export interface MathDuelHandle {
  restart: () => void;
}

interface Question {
  text: string;
  answer: number;
  options: number[];
}

const MathDuel = forwardRef<MathDuelHandle, MathDuelProps>(({ onWin }, ref) => {
  const { lang, hydrated } = useLangStore();
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [startTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<{
    player: 1 | 2;
    type: "correct" | "wrong";
  } | null>(null);

  const generateQuestion = useCallback(() => {
    const ops = ["+", "-", "*"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1, n2, ans;

    if (op === "+") {
      n1 = Math.floor(Math.random() * 20) + 1;
      n2 = Math.floor(Math.random() * 20) + 1;
      ans = n1 + n2;
    } else if (op === "-") {
      n1 = Math.floor(Math.random() * 20) + 10;
      n2 = Math.floor(Math.random() * 9) + 1;
      ans = n1 - n2;
    } else {
      n1 = Math.floor(Math.random() * 9) + 2;
      n2 = Math.floor(Math.random() * 5) + 2;
      ans = n1 * n2;
    }

    const options = [ans];
    while (options.length < 3) {
      const offset =
        (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const opt = ans + offset;
      if (opt >= 0 && !options.includes(opt)) options.push(opt);
    }

    setCurrentQuestion({
      text: `${n1} ${op === "*" ? "×" : op} ${n2}`,
      answer: ans,
      options: options.sort(() => Math.random() - 0.5),
    });
  }, []);

  const handleAnswer = (player: 1 | 2, selected: number) => {
    if (winner || !currentQuestion || feedback) return;

    if (selected === currentQuestion.answer) {
      setFeedback({ player, type: "correct" });
      const newScore = player === 1 ? p1Score + 1 : p2Score + 1;
      if (player === 1) setP1Score(newScore);
      else setP2Score(newScore);

      if (newScore >= 10) {
        setWinner(player);
        onWin({
          time: Math.floor((Date.now() - startTime) / 1000),
          moves: newScore,
        });
      } else {
        setTimeout(() => {
          setFeedback(null);
          generateQuestion();
        }, 600);
      }
    } else {
      setFeedback({ player, type: "wrong" });
      if (player === 1) setP1Score((s) => Math.max(0, s - 1));
      else setP2Score((s) => Math.max(0, s - 1));

      setTimeout(() => setFeedback(null), 600);
    }
  };

  const restart = useCallback(() => {
    setP1Score(0);
    setP2Score(0);
    setWinner(null);
    setFeedback(null);
    generateQuestion();
  }, [generateQuestion]);

  useImperativeHandle(ref, () => ({ restart }));

  useEffect(() => {
    if (!currentQuestion) generateQuestion();
  }, [currentQuestion, generateQuestion]);

  if (!hydrated) return null;

  const PlayerArea = ({ player }: { player: 1 | 2 }) => {
    const score = player === 1 ? p1Score : p2Score;
    const isWinner = winner === player;

    return (
      <div
        className={cn(
          "relative flex-1 flex flex-col items-center justify-center p-6 transition-colors duration-300",
          player === 1 ? "border-t border-white/10" : "",
        )}
      >
        {/* Score & HUD */}
        <div className="absolute top-6 left-6 flex flex-col items-start">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            {lang === "es" ? "PUNTAJE" : "SCORE"}
          </span>
          <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">
            {score}
          </span>
        </div>

        {/* Question Display (only if not winner) */}
        {!winner && currentQuestion && (
          <div className="flex flex-col items-center gap-8 w-full max-w-xs">
            <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-3xl shadow-xl border-2 border-slate-200 dark:border-slate-800">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                {currentQuestion.text} = ?
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(player, opt)}
                  className="aspect-square rounded-2xl bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xl font-black text-slate-700 dark:text-slate-300 hover:scale-105 active:scale-95 transition-transform"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback?.player === player && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "absolute inset-0 flex items-center justify-center z-20 backdrop-blur-sm",
                feedback.type === "correct"
                  ? "bg-green-500/20"
                  : "bg-red-500/20",
              )}
            >
              <div
                className={cn(
                  "h-20 w-20 rounded-full flex items-center justify-center shadow-2xl",
                  feedback.type === "correct" ? "bg-green-500" : "bg-red-500",
                )}
              >
                {feedback.type === "correct" ? (
                  <Check className="h-10 w-10 text-white stroke-[4]" />
                ) : (
                  <X className="h-10 w-10 text-white stroke-[4]" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Winner Overlay */}
        <AnimatePresence>
          {isWinner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center z-30 bg-indigo-600/90 dark:bg-indigo-900/90 backdrop-blur-md"
            >
              <div className="text-center p-8">
                <Trophy className="h-20 w-20 text-brand-yellow-400 mx-auto mb-4 animate-bounce" />
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6 underline decoration-brand-yellow-400 underline-offset-8">
                  {lang === "es" ? "¡GENIO TOTAL!" : "GENIUS WIN!"}
                </h2>
                <button
                  onClick={restart}
                  className="bg-white text-indigo-600 font-black px-8 py-3 rounded-full flex items-center gap-2 mx-auto hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  <RotateCcw className="h-5 w-5" />
                  {lang === "es" ? "JUGAR DE NUEVO" : "PLAY AGAIN"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden select-none touch-none relative bg-slate-50 dark:bg-slate-950">
      <PlayerArea player={2} />

      {/* HUD Bar (Middle) */}
      <div className="h-px bg-slate-300 dark:bg-slate-800 relative z-10 overflow-visible">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl border border-slate-700">
          <Brain className="h-3 w-3 text-brand-yellow-500" />
          {lang === "es" ? "BATALLA MATEMÁTICA" : "MATH BATTLE"}
        </div>
      </div>

      <PlayerArea player={1} />
    </div>
  );
});

MathDuel.displayName = "MathDuel";

export default MathDuel;

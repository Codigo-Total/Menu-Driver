"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import MemoryGame from "@/components/features/Games/MemoryGame";
import PuzzleGame from "@/components/features/Games/PuzzleGame";
import TicTacToe from "@/components/features/Games/TicTacToe";
import MathDuel from "@/components/features/Games/MathDuel";
import { GameStage } from "@/components/features/Games/GameStage";
import { useLangStore } from "@/store/lang/lang.slice";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Puzzle, Users, User, Calculator, Play } from "lucide-react";
import { cn } from "@/lib/cn";

export type GameType = "memory" | "puzzle" | "tictactoe" | "math" | null;

interface GameStats {
  time: number;
  moves: number;
}

type GameCardProps = {
  type: GameType;
  title: string;
  icon: React.ElementType;
  description: string;
  color: string;
  bgImage: string;
  players: 1 | 2;
  onClick: (type: GameType) => void;
  lang: string;
  delay?: number;
};

const GameCard = ({
  type,
  title,
  icon: Icon,
  description,
  color,
  bgImage,
  players,
  onClick,
  lang,
  delay = 0,
}: GameCardProps) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: 1,
      y: [0, -4, 0],
    }}
    transition={{
      opacity: { duration: 0.5, delay },
      y: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay * 2,
      },
    }}
    onClick={() => onClick(type)}
    className="group relative h-full w-full flex flex-col items-center justify-center rounded-2xl  shadow-md transition-all duration-300 active:scale-[0.97] outline-none overflow-hidden"
  >
    {/* Background Image Layer (Increased visibility, No borders) */}
    <div className="absolute inset-0 overflow-hidden select-none pointer-events-none dark:opacity-25 group-hover:opacity-80 transition-opacity duration-700">
      <motion.img
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        src={bgImage}
        alt=""
        className="h-full w-full object-cover blur-[1px]"
      />
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-t dark:via-white/50 dark:from-slate-950/50 to-transparent",
        )}
      />
    </div>

    {/* Shimmer Effect (Theme Colored) */}
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "200%" }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        repeatDelay: 5 + delay,
      }}
      className={cn(
        "absolute inset-0 z-10 bg-gradient-to-r from-transparent to-transparent skew-x-[-20deg] pointer-events-none opacity-50",
        color === "bg-indigo-500" && "via-indigo-400/40",
        color === "bg-rose-500" && "via-rose-400/40",
        color === "bg-amber-500" && "via-amber-400/40",
        color === "bg-emerald-500" && "via-emerald-400/40",
      )}
    />

    {/* Edge Glow Animation (Color based shadow instead of border) */}
    <motion.div
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 3, repeat: Infinity }}
      className={cn(
        "absolute inset-0 rounded-2xl pointer-events-none",
        color.replace("bg-", "shadow-[inset_0_0_20px_]"),
      )}
    />

    {/* Content Container (Borderless) */}
    <div className="relative z-10 flex flex-col items-center text-center p-4 h-full w-full justify-between gap-3">
      {/* Player Badge Badge (Floating, no border) */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-2 rounded-full bg-slate-900/10 dark:bg-white/10 backdrop-blur-md">
        {players === 1 ? (
          <User className="h-2.5 w-2.5 text-slate-300" />
        ) : (
          <Users className="h-2.5 w-2.5 text-slate-300" />
        )}
        <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-white/80">
          {players === 1
            ? lang === "es"
              ? "Solo"
              : "1P"
            : lang === "es"
              ? "Duelo"
              : "2P"}
        </span>
      </div>

      {/* Icon Circle (Vibrant shadow, no border) */}
      <div
        className={cn(
          "h-12 w-12 sm:h-20 sm:w-20 rounded-full flex items-center justify-center transition-all duration-500 group-hover:rotate-12 shadow-2xl group-hover:scale-110 mt-auto",
          color,
        )}
      >
        <Icon className="h-6 w-6 sm:h-10 sm:w-10 text-white" />
      </div>

      {/* Main Info */}
      <div className="my-auto px-2">
        <h3 className="text-sm sm:text-2xl font-display font-black text-white uppercase tracking-tighter leading-tight mb-1 sm:mb-2 italic drop-shadow-sm">
          {title}
        </h3>
      </div>

      {/* Action Button (Shadow-based depth, no border) */}
      <div className="mt-auto w-full min-h-[50px]">
        <div
          className={cn(
            "w-full py-3 sm:py-4 px-4 sm:px-6 flex items-center justify-center gap-2 text-[10px] sm:text-lg font-black uppercase tracking-[0.15em] transition-all duration-300 absolute bottom-0 right-0 left-0",
            "text-yellow-500 backdrop-blur-2xl",
            "group-hover:bg-brand-yellow-500 group-hover:text-black group-hover:shadow-[0_10px_25px_rgba(234,179,8,0.4)]",
          )}
        >
          {lang === "es" ? "Jugar" : "Start"}
          <Play className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
        </div>
      </div>
    </div>
  </motion.button>
);

export default function GamesPage() {
  const { lang, t, hydrated } = useLangStore();
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [isWon, setIsWon] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({ time: 0, moves: 0 });
  const gameRef = useRef<{ restart: () => void } | null>(null);

  const handleGameWin = useCallback((stats: GameStats) => {
    setGameStats(stats);
    setIsWon(true);
  }, []);

  const handleRestart = useCallback(() => {
    setIsWon(false);
    gameRef.current?.restart?.();
  }, []);

  const handleClose = useCallback(() => {
    setActiveGame(null);
    setIsWon(false);
  }, []);

  if (!hydrated) return null;

  const images = {
    memory: "/assets/games/memory.png",
    puzzle: "/assets/games/puzzle.png",
    tictactoe: "/assets/games/tictactoe.png",
    math: "/assets/games/math.png",
  };

  return (
    <div className="h-full w-full flex flex-col transition-colors duration-500 overflow-hidden bg-white dark:bg-slate-950">
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 sm:px-8 py-6 sm:py-10 grid grid-cols-2 grid-rows-2 gap-5 min-h-[calc(100vh-177px)]">
        <GameCard
          type="memory"
          title={t("games.memory")}
          icon={Brain}
          description={
            lang === "es"
              ? "Encuentra todas las parejas en el menor tiempo posible."
              : "Find all pairs in the shortest time possible."
          }
          color="bg-indigo-500"
          bgImage={images.memory}
          players={1}
          onClick={setActiveGame}
          lang={lang}
          delay={0.1}
        />
        <GameCard
          type="puzzle"
          title={t("games.puzzle")}
          icon={Puzzle}
          description={
            lang === "es"
              ? "Desliza las piezas para completar la imagen maestra."
              : "Slide the tiles to complete the master image."
          }
          color="bg-rose-500"
          bgImage={images.puzzle}
          players={1}
          onClick={setActiveGame}
          lang={lang}
          delay={0.2}
        />
        <GameCard
          type="tictactoe"
          title={t("games.tictactoe")}
          icon={Users}
          description={t("games.tictactoe_desc")}
          color="bg-amber-500"
          bgImage={images.tictactoe}
          players={2}
          onClick={setActiveGame}
          lang={lang}
          delay={0.3}
        />
        <GameCard
          type="math"
          title={t("games.math_duel")}
          icon={Calculator}
          description={t("games.math_duel_desc")}
          color="bg-emerald-500"
          bgImage={images.math}
          players={2}
          onClick={setActiveGame}
          lang={lang}
          delay={0.4}
        />
      </main>

      {/* Fullscreen Game Stage */}
      <AnimatePresence>
        {activeGame && (
          <GameStage
            isOpen={!!activeGame}
            onClose={handleClose}
            onRestart={handleRestart}
            title={
              activeGame === "memory"
                ? t("games.memory")
                : activeGame === "puzzle"
                  ? t("games.puzzle")
                  : activeGame === "tictactoe"
                    ? t("games.tictactoe")
                    : t("games.math_duel")
            }
            isWon={isWon}
            stats={gameStats}
          >
            {activeGame === "memory" && (
              <MemoryGame
                onWin={handleGameWin}
                ref={(el) => {
                  if (el) gameRef.current = { restart: el.restart };
                }}
              />
            )}
            {activeGame === "puzzle" && (
              <PuzzleGame
                onWin={handleGameWin}
                ref={(el) => {
                  if (el) gameRef.current = { restart: el.restart };
                }}
              />
            )}
            {activeGame === "tictactoe" && (
              <TicTacToe
                onWin={handleGameWin}
                ref={(el) => {
                  if (el) gameRef.current = { restart: el.restart };
                }}
              />
            )}
            {activeGame === "math" && (
              <MathDuel
                onWin={handleGameWin}
                ref={(el) => {
                  if (el) gameRef.current = { restart: el.restart };
                }}
              />
            )}
          </GameStage>
        )}
      </AnimatePresence>
    </div>
  );
}

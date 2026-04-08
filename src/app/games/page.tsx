'use client';

import { useState } from 'react';
import { MemoryGame } from '@/components/features/Games/MemoryGame';
import { PuzzleGame } from '@/components/features/Games/PuzzleGame';
import { useLangStore } from '@/store/lang/lang.slice';
import { Button } from '@/components/ui/Button';
import { 
  Brain, 
  Puzzle, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/cn';

export type GameType = 'memory' | 'puzzle' | null;

type GameCardProps = {
  type: GameType;
  title: string;
  icon: React.ElementType;
  description: string;
  color: string;
  activeGame: GameType;
  onClick: (type: GameType) => void;
  lang: string;
};

const GameCard = ({ 
  type, 
  title, 
  icon: Icon, 
  description, 
  color,
  activeGame,
  onClick,
  lang
}: GameCardProps) => (
  <div 
    onClick={() => onClick(type)}
    className={cn(
      "group cursor-pointer relative flex flex-col p-6 sm:p-10 rounded-3xl lg:rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] border-2 sm:border-4",
      activeGame === type 
        ? `bg-white dark:bg-slate-900 border-brand-yellow-500 shadow-2xl` 
        : "bg-slate-50 dark:bg-slate-950 border-transparent hover:border-brand-yellow-400 dark:hover:border-brand-yellow-900/30"
    )}
  >
    <div className={cn(
      "h-16 w-16 sm:h-24 sm:w-24 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-6 sm:mb-8 transition-transform group-hover:rotate-12 shadow-xl",
      color
    )}>
      <Icon className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
    </div>
    
    <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white mb-2 sm:mb-4 uppercase tracking-tight">
      {title}
    </h3>
    <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] sm:text-sm leading-relaxed mb-6 sm:mb-8 uppercase tracking-wide line-clamp-3">
      {description}
    </p>
    
    <div className="mt-auto flex items-center justify-between pt-4 sm:pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-brand-yellow-600 transition-colors">
        {lang === 'es' ? 'Toca para Jugar' : 'Click to Play'}
      </span>
      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg group-hover:bg-brand-yellow-500 group-hover:text-brand-yellow-950 transition-all">
        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
    </div>
  </div>
);

export default function GamesPage() {
  const { lang, t, hydrated } = useLangStore();
  const [activeGame, setActiveGame] = useState<GameType>(null);

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="pt-10">
        {activeGame && (
          <div className="container mx-auto px-4 mb-8">
            <Button 
              onClick={() => setActiveGame(null)}
              variant="outline"
              className="rounded-xl px-6 uppercase font-black text-xs tracking-widest h-14 border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg"
              leftIcon={<RefreshCw className="h-4 w-4 mr-2" />}
            >
              {t('games.switch_game')}
            </Button>
          </div>
        )}
      </div>

      <main className="container mx-auto px-4 sm:px-6 pb-32">
        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 max-w-6xl mx-auto items-stretch animate-in fade-in slide-in-from-bottom-8 duration-700">
            <GameCard 
              type="memory"
              title={t('games.memory')}
              icon={Brain}
              description={lang === 'es' ? 'Pon a prueba tus límites cognitivos encontrando las parejas deliciosas en tiempo récord.' : 'Test your cognitive limits by matching delicious pairs in record time.'}
              color="bg-indigo-500"
              activeGame={activeGame}
              onClick={setActiveGame}
              lang={lang}
            />
            <GameCard 
              type="puzzle"
              title={t('games.puzzle')}
              icon={Puzzle}
              description={lang === 'es' ? 'Domina la conciencia espacial con nuestro puzzle deslizante. Revela la imagen completa.' : 'Master spatial awareness with our classic sliding challenge. Reveal the full image.'}
              color="bg-rose-500"
              activeGame={activeGame}
              onClick={setActiveGame}
              lang={lang}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-in zoom-in-95 fade-in duration-500">
            {activeGame === 'memory' ? <MemoryGame /> : <PuzzleGame />}
          </div>
        )}
      </main>
    </div>
  );
}

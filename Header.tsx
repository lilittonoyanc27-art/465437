import React from 'react';
import {
  Trophy,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Award,
} from 'lucide-react';
import { UserStats } from './types';
import { setSoundMuted, getSoundMuted } from './soundEffects';

export type GameMode =
  | 'penaltis'
  | 'campeonato'
  | 'error'
  | 'entrenador'
  | 'aventura'
  | 'entrevista'
  | 'minijuegos';

interface HeaderProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  lang: 'es' | 'hy';
  onToggleLang: () => void;
  showHints: boolean;
  onToggleHints: () => void;
  onOpenGrammar: () => void;
  onOpenStats: () => void;
  onOpenTrophy: () => void;
  onOpenMistakes: () => void;
  stats: UserStats;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  lang,
  onToggleLang,
  showHints,
  onToggleHints,
  onOpenGrammar,
  onOpenStats,
  onOpenTrophy,
  onOpenMistakes,
  stats,
}) => {
  const [isMuted, setIsMuted] = React.useState<boolean>(getSoundMuted());

  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundMuted(next);
  };

  const navItems: { id: GameMode; labelEs: string; labelHy: string; icon: string }[] = [
    { id: 'penaltis', labelEs: 'PENALTIS DE RAZMIK', labelHy: 'ՌԱԶՄԻԿԻ 11-ՄԵՏՐԱՆՈՑՆԵՐԸ', icon: '⚽' },
    { id: 'campeonato', labelEs: 'CAMPEONATO', labelHy: 'ԱՌԱՋՆՈՒԹՅՈՒՆ', icon: '🏆' },
    { id: 'error', labelEs: 'ENCUENTRA EL ERROR', labelHy: 'ԳՏԻ՛Ր ՍԽԱԼԸ', icon: '🔍' },
    { id: 'entrenador', labelEs: 'EL ENTRENADOR', labelHy: 'ՄԱՐԶԻՉԸ', icon: '📋' },
    { id: 'aventura', labelEs: 'TU AVENTURA', labelHy: 'ԱՐԿԱԾ', icon: '📖' },
    { id: 'entrevista', labelEs: 'ENTREVISTA', labelHy: 'ՀԱՐՑԱԶՐՈՒՅՑ', icon: '🎙️' },
    { id: 'minijuegos', labelEs: 'MINI-JUEGOS', labelHy: 'ՄԻՆԻ-ԽԱՂԵՐ', icon: '🎮' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md border-b-2 border-emerald-700 shadow-xl">
      {/* Top Banner & Player Status Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 flex-wrap">
        {/* Brand / Logo with Razmik name & #7 jersey */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            {/* Jersey Badge */}
            <div className="w-10 h-10 bg-blue-600 rounded-xl border-2 border-orange-500 shadow-lg flex flex-col items-center justify-center text-white">
              <span className="text-[7px] font-black tracking-tighter text-amber-300 leading-none">RAZMIK</span>
              <span className="text-sm font-black leading-none">7</span>
            </div>
            <div className="absolute -bottom-1 -right-1 text-xs">⚽</div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-xl font-black text-amber-300 tracking-tight flex items-center gap-1.5 uppercase">
                <span>RAZMIK FOOTBALL ACADEMY</span>
                <span className="text-orange-400">🏆</span>
              </h1>
            </div>
            <div className="text-[10px] sm:text-xs font-semibold text-emerald-300">
              {lang === 'es'
                ? 'Academia oficial de fútbol y gramática española'
                : 'Ֆուտբոլի և իսպաներենի պաշտոնական ակադեմիա'}
            </div>
          </div>
        </div>

        {/* Player Quick Stats & Utility Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Goals Counter pill */}
          <button
            onClick={onOpenStats}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-900 hover:bg-emerald-800 rounded-xl border border-emerald-600 text-xs font-black text-white shadow-sm transition-transform active:scale-95 cursor-pointer"
            title={lang === 'es' ? 'Ver pasaporte deportivo' : 'Դիտել անձնագիրը'}
          >
            <span>⚽ {stats.goals}</span>
            <span className="text-amber-300">| ⚡ {stats.xp} XP</span>
          </button>

          {/* Grammar Guide Button */}
          <button
            onClick={onOpenGrammar}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
            title={lang === 'es' ? 'Guía gramatical de tiempos' : 'Ժամանակաձևերի ուղեցույց'}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'es' ? 'Gramática' : 'Կանոններ'}</span>
          </button>

          {/* Mistakes Review Button */}
          {stats.mistakeIds.length > 0 && (
            <button
              onClick={onOpenMistakes}
              className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md animate-pulse cursor-pointer"
              title={lang === 'es' ? 'Repasar errores' : 'Կրկնել սխալները'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{stats.mistakeIds.length}</span>
            </button>
          )}

          {/* Trophy Room Button */}
          <button
            onClick={onOpenTrophy}
            className="p-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl shadow cursor-pointer transition-transform hover:scale-105"
            title={lang === 'es' ? 'Ver Gran Copa' : 'Դիտել Մեծ Գավաթը'}
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Armenian Hints Toggle */}
          <button
            onClick={onToggleHints}
            className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
              showHints
                ? 'bg-orange-500 text-white border-orange-300 shadow'
                : 'bg-emerald-950 text-emerald-400 border-emerald-800 hover:bg-emerald-900'
            }`}
            title={lang === 'es' ? 'Activar/desactivar pistas en armenio' : 'Միացնել/անջատել հայերեն հուշումները'}
          >
            💡 {lang === 'es' ? 'Pistas' : 'Հուշումներ'}
          </button>

          {/* Language Toggle (ES / ՀԱՅ) */}
          <button
            onClick={onToggleLang}
            className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md border border-yellow-200 transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <span>🌐</span>
            <span>{lang === 'es' ? 'ES 🇪🇸' : 'ՀԱՅ 🇦🇲'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors cursor-pointer border border-emerald-700"
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="bg-emerald-900/80 border-t border-emerald-800 px-3 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1.5 min-w-max">
          {navItems.map(item => {
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMode(item.id)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105 border-b-2 border-amber-300'
                    : 'text-emerald-200 hover:bg-emerald-800/80 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{lang === 'es' ? item.labelEs : item.labelHy}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

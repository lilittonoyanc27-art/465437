import React, { useState, useEffect } from 'react';
import { Header, GameMode } from './Header';
import { PenaltyGame } from './PenaltyGame';
import { ChampionshipGame } from './ChampionshipGame';
import { FindErrorGame } from './FindErrorGame';
import { CoachDialogueGame } from './CoachDialogueGame';
import { AdventureGame } from './AdventureGame';
import { InterviewGame } from './InterviewGame';
import { MiniGames } from './MiniGames';
import { GrammarGuideModal } from './GrammarGuideModal';
import { StatsModal } from './StatsModal';
import { TrophyModal } from './TrophyModal';
import { MistakesReviewModal } from './MistakesReviewModal';
import { UserStats } from './types';
import { Sparkles, Trophy, Star, BookOpen, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'razmik_football_academy_v1';

const INITIAL_STATS: UserStats = {
  goals: 0,
  penaltiesAttempted: 0,
  penaltiesScored: 0,
  championshipProgress: 1,
  championshipCompleted: false,
  trophies: [],
  stars: 5,
  xp: 120,
  streak: 0,
  bestStreak: 0,
  mistakeIds: [],
  gamesPlayed: 1,
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('penaltis');
  const [lang, setLang] = useState<'es' | 'hy'>('es');
  const [showHints, setShowHints] = useState<boolean>(true);

  // Modals state
  const [isGrammarOpen, setIsGrammarOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isTrophyOpen, setIsTrophyOpen] = useState<boolean>(false);
  const [isMistakesOpen, setIsMistakesOpen] = useState<boolean>(false);

  // Motivational toast
  const [toastMessage, setToastMessage] = useState<{ es: string; hy: string } | null>(null);

  // LocalStorage state
  const [stats, setStats] = useState<UserStats>(() => {
    if (typeof window === 'undefined') return INITIAL_STATS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse localStorage stats:', e);
    }
    return INITIAL_STATS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [stats]);

  const showMotivationalToast = (es: string, hy: string) => {
    setToastMessage({ es, hy });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleGoalScored = () => {
    setStats(prev => {
      const newGoals = prev.goals + 1;
      const newStreak = prev.streak + 1;
      const newBest = Math.max(newStreak, prev.bestStreak);

      // Check motivational milestones
      if (newStreak % 5 === 0) {
        showMotivationalToast(
          '¡¡Eres un campeón, Razmik!! ¡Racha imparable!',
          'Դու իսկական չեմպիոն ես, Ռազմիկ: Անկասելի շարք:'
        );
        confetti({ particleCount: 80, spread: 60 });
      } else {
        const compliments = [
          { es: '¡¡Excelente, Razmik!!', hy: 'Ապրե՛ս, Ռազմիկ' },
          { es: '¡¡Qué golazo!!', hy: 'Ինչպիսի՜ գոլ' },
          { es: '¡¡Buen trabajo!!', hy: 'Հիանալի պատասխան' },
          { es: '¡¡Golazo por la escuadra!!', hy: 'Գոլ ուղիղ իննյակը' },
        ];
        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
        showMotivationalToast(randomCompliment.es, randomCompliment.hy);
      }

      return {
        ...prev,
        goals: newGoals,
        streak: newStreak,
        bestStreak: newBest,
        stars: prev.stars + (newStreak % 3 === 0 ? 1 : 0),
      };
    });
  };

  const handleAddXp = (amount: number) => {
    setStats(prev => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  const handleRecordMistake = (questionId: string) => {
    setStats(prev => {
      const exists = prev.mistakeIds.includes(questionId);
      const newMistakes = exists ? prev.mistakeIds : [...prev.mistakeIds, questionId];
      return {
        ...prev,
        streak: 0, // reset streak
        mistakeIds: newMistakes,
      };
    });

    showMotivationalToast(
      '¡Sigue entrenando, Razmik! ¡Aprende del error!',
      'Փորձի՛ր կրկին, Ռազմիկ: Շարունակի՛ր մարզվել:'
    );
  };

  const handleClearMistakes = () => {
    setStats(prev => ({ ...prev, mistakeIds: [] }));
  };

  const handleChampionshipVictory = () => {
    setStats(prev => ({
      ...prev,
      championshipCompleted: true,
      trophies: prev.trophies.includes('Copa de los Tiempos')
        ? prev.trophies
        : [...prev.trophies, 'Copa de los Tiempos'],
      stars: prev.stars + 5,
    }));
    setIsTrophyOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950 text-white flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        lang={lang}
        onToggleLang={() => setLang(prev => (prev === 'es' ? 'hy' : 'es'))}
        showHints={showHints}
        onToggleHints={() => setShowHints(prev => !prev)}
        onOpenGrammar={() => setIsGrammarOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenTrophy={() => setIsTrophyOpen(true)}
        onOpenMistakes={() => setIsMistakesOpen(true)}
        stats={stats}
      />

      {/* Motivational Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-2xl border-2 border-yellow-200 flex items-center gap-3">
            <span className="text-2xl animate-spin">⭐</span>
            <div>
              <div className="text-sm font-black uppercase">{toastMessage.es}</div>
              <div className="text-xs text-slate-900 font-extrabold">{toastMessage.hy}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Stadium Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        {currentMode === 'penaltis' && (
          <PenaltyGame
            lang={lang}
            showHints={showHints}
            onGoalScored={handleGoalScored}
            onRecordMistake={handleRecordMistake}
            onAddXp={handleAddXp}
          />
        )}

        {currentMode === 'campeonato' && (
          <ChampionshipGame
            lang={lang}
            showHints={showHints}
            onChampionshipVictory={handleChampionshipVictory}
            onAddXp={handleAddXp}
            onRecordMistake={handleRecordMistake}
          />
        )}

        {currentMode === 'error' && (
          <FindErrorGame
            lang={lang}
            showHints={showHints}
            onGoalScored={handleGoalScored}
            onAddXp={handleAddXp}
          />
        )}

        {currentMode === 'entrenador' && (
          <CoachDialogueGame
            lang={lang}
            showHints={showHints}
            onAddXp={handleAddXp}
            onGoalScored={handleGoalScored}
          />
        )}

        {currentMode === 'aventura' && (
          <AdventureGame
            lang={lang}
            showHints={showHints}
            onAddXp={handleAddXp}
            onChampionshipVictory={handleChampionshipVictory}
          />
        )}

        {currentMode === 'entrevista' && (
          <InterviewGame
            lang={lang}
            showHints={showHints}
            onAddXp={handleAddXp}
          />
        )}

        {currentMode === 'minijuegos' && (
          <MiniGames
            lang={lang}
            showHints={showHints}
            onGoalScored={handleGoalScored}
            onAddXp={handleAddXp}
          />
        )}
      </main>

      {/* Stadium Footer */}
      <footer className="mt-auto border-t-2 border-emerald-800 bg-emerald-950/90 py-6 text-center text-xs text-emerald-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              ⚽
            </span>
            <span className="font-bold text-amber-300 uppercase">
              RAZMIK FOOTBALL ACADEMY
            </span>
            <span className="text-emerald-400">| Pretérito Perfecto, Indefinido & Imperfecto</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGrammarOpen(true)}
              className="text-amber-300 hover:text-white underline cursor-pointer"
            >
              {lang === 'es' ? 'Guía Gramatical' : 'Քերականության Ուղեցույց'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsStatsOpen(true)}
              className="text-amber-300 hover:text-white underline cursor-pointer"
            >
              {lang === 'es' ? 'Pasaporte de Razmik' : 'Ռազմիկի Անձնագիր'}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsTrophyOpen(true)}
              className="text-amber-300 hover:text-white underline cursor-pointer"
            >
              {lang === 'es' ? 'Gran Copa' : 'Մեծ Գավաթ'}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GrammarGuideModal
        isOpen={isGrammarOpen}
        onClose={() => setIsGrammarOpen(false)}
        lang={lang}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        lang={lang}
      />

      <TrophyModal
        isOpen={isTrophyOpen}
        onClose={() => setIsTrophyOpen(false)}
        lang={lang}
        goals={stats.goals}
      />

      <MistakesReviewModal
        isOpen={isMistakesOpen}
        onClose={() => setIsMistakesOpen(false)}
        mistakeIds={stats.mistakeIds}
        onClearMistakes={handleClearMistakes}
        lang={lang}
      />
    </div>
  );
}

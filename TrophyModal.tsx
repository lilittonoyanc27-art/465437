import React, { useEffect } from 'react';
import { Trophy, Star, Sparkles, X, Share2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playChampionshipFanfare } from './soundEffects';

interface TrophyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'es' | 'hy';
  goals: number;
}

export const TrophyModal: React.FC<TrophyModalProps> = ({
  isOpen,
  onClose,
  lang,
  goals,
}) => {
  useEffect(() => {
    if (isOpen) {
      playChampionshipFanfare();
      // Multiple waves of confetti
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f59e0b', '#10b981', '#f97316', '#ffffff'],
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#10b981', '#f97316', '#ffffff'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-amber-950 via-emerald-950 to-emerald-950 border-4 border-amber-400 rounded-3xl shadow-2xl p-6 sm:p-8 text-center text-white space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Golden Trophy Graphic */}
        <div className="relative inline-block mx-auto pt-2">
          <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.6)] border-4 border-yellow-200 animate-bounce">
            <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-slate-950 drop-shadow-lg" />
          </div>
          <div className="absolute -top-1 -right-1 text-2xl animate-spin">✨</div>
          <div className="absolute -bottom-1 -left-1 text-2xl animate-spin">⭐</div>
        </div>

        {/* Exact Required Champion Titles */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide uppercase drop-shadow-md">
            🏆 ¡FELICIDADES, RAZMIK! ¡ERES EL CAMPEÓN!
          </h2>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase drop-shadow-md">
            🏆 ՇՆՈՐՀԱՎՈՐՈՒՄ ԵՆՔ, ՌԱԶՄԻԿ։ ԴՈՒ ՉԵՄՊԻՈՆ ԵՍ։
          </h3>
        </div>

        <p className="text-sm sm:text-base text-emerald-200 font-medium max-w-md mx-auto">
          {lang === 'es'
            ? 'Has demostrado maestría absoluta con el balón y con los tiempos del español: Pretérito Perfecto, Indefinido e Imperfecto.'
            : 'Դու ցուցադրեցիր բացառիկ վարպետություն գնդակով և իսպաներենի անցյալ ժամանակաձևերով (Perfecto, Indefinido, Imperfecto):'}
        </p>

        {/* Player Badge */}
        <div className="p-4 bg-emerald-900/80 rounded-2xl border-2 border-emerald-500 flex items-center justify-around text-center">
          <div>
            <div className="text-xs text-emerald-300 uppercase font-bold">DORSAL</div>
            <div className="text-2xl font-black text-amber-300">#7 RAZMIK</div>
          </div>
          <div className="h-8 w-px bg-emerald-700" />
          <div>
            <div className="text-xs text-emerald-300 uppercase font-bold">GOLES TOTALES</div>
            <div className="text-2xl font-black text-white">{goals} ⚽</div>
          </div>
          <div className="h-8 w-px bg-emerald-700" />
          <div>
            <div className="text-xs text-emerald-300 uppercase font-bold">RANGO</div>
            <div className="text-2xl font-black text-orange-400">PICHICHI 🌟</div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-black text-base text-slate-950 rounded-2xl shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            {lang === 'es' ? '¡A por el siguiente partido!' : 'Դեպի հաջորդ հանդիպումը: ⚽'}
          </button>
        </div>
      </div>
    </div>
  );
};

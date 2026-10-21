import React from 'react';
import { X, Trophy, Target, Award, Flame, Zap, Shield, Star } from 'lucide-react';
import { UserStats } from './types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  lang: 'es' | 'hy';
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  lang,
}) => {
  if (!isOpen) return null;

  // Calculate level based on XP
  const levelNumber = Math.floor(stats.xp / 150) + 1;
  const xpCurrentLevel = stats.xp % 150;
  const progressPercent = Math.min(100, Math.round((xpCurrentLevel / 150) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-emerald-950 border-4 border-emerald-500 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl text-amber-300 border-2 border-orange-500 shadow-md">
              7
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300">
                {lang === 'es' ? 'PASAPORTE DEPORTIVO: RAZMIK' : 'ՖՈՒՏԲՈԼԱՅԻՆ ԱՆՁՆԱԳԻՐ. ՌԱԶՄԻԿ'}
              </h2>
              <p className="text-xs text-emerald-200">
                {lang === 'es' ? 'Estadísticas y palmarés del jugador' : 'Խաղացողի վիճակագրությունը և նվաճումները'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Level & XP Bar */}
          <div className="p-4 bg-slate-900 rounded-2xl border-2 border-emerald-600 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌟</span>
                <span className="font-black text-base text-amber-300">
                  {lang === 'es' ? `Nivel ${levelNumber}: Capitán Estrella` : `Մակարդակ ${levelNumber}. Աստղային Ավագ`}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-orange-400">
                {stats.xp} XP
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 bg-emerald-950 rounded-full overflow-hidden border border-emerald-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-right text-slate-400">
              {150 - xpCurrentLevel} XP {lang === 'es' ? 'para el siguiente rango' : 'հաջորդ մակարդակի համար'}
            </div>
          </div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-emerald-900/60 rounded-2xl border border-emerald-700">
              <div className="text-xs text-emerald-400 font-bold uppercase mb-1">
                {lang === 'es' ? 'Goles' : 'Գոլեր'}
              </div>
              <div className="text-2xl font-black text-white">{stats.goals} ⚽</div>
            </div>
            <div className="p-3 bg-emerald-900/60 rounded-2xl border border-emerald-700">
              <div className="text-xs text-emerald-400 font-bold uppercase mb-1">
                {lang === 'es' ? 'Trofeos' : 'Գավաթներ'}
              </div>
              <div className="text-2xl font-black text-amber-300">{stats.trophies.length} 🏆</div>
            </div>
            <div className="p-3 bg-emerald-900/60 rounded-2xl border border-emerald-700">
              <div className="text-xs text-emerald-400 font-bold uppercase mb-1">
                {lang === 'es' ? 'Racha Actual' : 'Շարք'}
              </div>
              <div className="text-2xl font-black text-orange-400">{stats.streak} 🔥</div>
            </div>
            <div className="p-3 bg-emerald-900/60 rounded-2xl border border-emerald-700">
              <div className="text-xs text-emerald-400 font-bold uppercase mb-1">
                {lang === 'es' ? 'Estrellas' : 'Աստղեր'}
              </div>
              <div className="text-2xl font-black text-yellow-300">{stats.stars} ⭐</div>
            </div>
          </div>

          {/* Trophies Room */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>{lang === 'es' ? 'Sala de Trofeos Ganados' : 'Նվաճված Գավաթների Սրահ'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                stats.goals >= 10
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-800 text-slate-500'
              }`}>
                <span className="text-2xl">⚽</span>
                <div>
                  <div className="font-bold text-white">Bota de Oro (10+ goles)</div>
                  <div>{stats.goals >= 10 ? '¡Desbloqueado!' : `${stats.goals}/10 goles`}</div>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                stats.championshipCompleted
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-800 text-slate-500'
              }`}>
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="font-bold text-white">Copa de los Tiempos</div>
                  <div>{stats.championshipCompleted ? '¡Campeón Absoluto!' : 'En progreso'}</div>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                stats.streak >= 5
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-800 text-slate-500'
              }`}>
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="font-bold text-white">Racha Imparable (5+)</div>
                  <div>{stats.streak >= 5 ? '¡En racha goleadora!' : `${stats.streak}/5 aciertos seguidos`}</div>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                stats.xp >= 300
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-800 text-slate-500'
              }`}>
                <span className="text-2xl">🎖️</span>
                <div>
                  <div className="font-bold text-white">Maestro del Pasado</div>
                  <div>{stats.xp >= 300 ? '¡Dominio gramatical!' : `${stats.xp}/300 XP`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-emerald-950 border-t border-emerald-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 font-bold text-white rounded-xl shadow cursor-pointer transition-colors"
          >
            {lang === 'es' ? 'Cerrar' : 'Փակել'}
          </button>
        </div>
      </div>
    </div>
  );
};

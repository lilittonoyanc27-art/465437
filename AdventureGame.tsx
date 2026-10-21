import React, { useState } from 'react';
import { Compass, Trophy, ArrowRight, RotateCcw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { ADVENTURE_STORY } from './spanishArmenianData';
import { playCorrectSound, playWrongSound, playChampionshipFanfare } from './soundEffects';
import { speakSpanish } from './speechHelper';
import confetti from 'canvas-confetti';

interface AdventureGameProps {
  lang: 'es' | 'hy';
  showHints: boolean;
  onAddXp: (amount: number) => void;
  onChampionshipVictory: () => void;
}

export const AdventureGame: React.FC<AdventureGameProps> = ({
  lang,
  showHints,
  onAddXp,
  onChampionshipVictory,
}) => {
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showArmenian, setShowArmenian] = useState<boolean>(false);

  const currentStep = ADVENTURE_STORY[currentStepId] || ADVENTURE_STORY['start'];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const opt = currentStep.options[idx];
    if (opt.isCorrect) {
      playCorrectSound();
      onAddXp(opt.xpBonus);
    } else {
      playWrongSound();
    }
  };

  const handleContinue = () => {
    if (selectedOption === null) return;
    const opt = currentStep.options[selectedOption];
    const nextId = opt.nextStepId;

    if (nextId === 'victory_ending') {
      playChampionshipFanfare();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
      onChampionshipVictory();
    }

    setCurrentStepId(nextId);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowArmenian(false);
  };

  const restartAdventure = () => {
    setCurrentStepId('start');
    setSelectedOption(null);
    setIsAnswered(false);
    setShowArmenian(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-5 rounded-2xl border-2 border-emerald-600 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500 rounded-2xl shadow-lg border-2 border-orange-300">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 uppercase">
              {lang === 'es' ? 'ELIGE TU AVENTURA FUTBOLÍSTICA 📖⚽' : 'ԸՆՏՐԻ՛Ր ՔՈ ՖՈՒՏԲՈԼԱՅԻՆ ԱՐԿԱԾԸ 📖⚽'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              {lang === 'es'
                ? 'Tus decisiones gramaticales y tácticas guían a Razmik hacia la gloria'
                : 'Քո քերականական և մարտավարական որոշումները առաջնորդում են Ռազմիկին դեպի հաղթանակ:'}
            </p>
          </div>
        </div>

        <button
          onClick={restartAdventure}
          className="p-2.5 rounded-xl bg-emerald-800 text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{lang === 'es' ? 'Reiniciar' : 'Վերսկսել'}</span>
        </button>
      </div>

      {/* Story Stage */}
      <div className="bg-emerald-900/90 border-2 border-emerald-600 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
        {/* Chapter Title & Speech */}
        <div className="flex items-center justify-between border-b border-emerald-700 pb-3">
          <div className="text-sm sm:text-base font-black text-amber-400 uppercase tracking-wider">
            {lang === 'es' ? currentStep.chapterTitleEs : currentStep.chapterTitleHy}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => speakSpanish(currentStep.storyEs)}
              className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{lang === 'es' ? 'Escuchar historia' : 'Լսել պատմությունը'}</span>
            </button>
            <button
              onClick={() => setShowArmenian(!showArmenian)}
              className="px-2.5 py-1 text-xs font-bold rounded-xl bg-emerald-800 text-emerald-200 hover:bg-emerald-700 cursor-pointer"
            >
              ՀԱՅ 🇦🇲
            </button>
          </div>
        </div>

        {/* Story paragraph */}
        <div
          onClick={() => setShowArmenian(!showArmenian)}
          className="p-6 bg-slate-900/90 rounded-2xl border-2 border-emerald-500/50 shadow-inner cursor-pointer"
        >
          <p className="text-base sm:text-xl font-medium text-slate-100 leading-relaxed">
            {currentStep.storyEs}
          </p>

          {(showArmenian || showHints) && (
            <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-emerald-300 leading-relaxed">
              <span className="font-bold text-amber-400">🇦🇲 Հայերեն. </span>
              <span>{currentStep.storyHy}</span>
            </div>
          )}
        </div>

        {/* Options (if not ending) */}
        {!currentStep.isEnding ? (
          <div className="space-y-4">
            <div className="text-xs font-black text-amber-300 uppercase tracking-wider">
              {lang === 'es' ? '¿Qué decides hacer, Razmik?' : 'Ի՞նչ ես որոշում անել, Ռազմիկ:'}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentStep.options.map((opt, idx) => {
                let btnStyle = 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-white';

                if (isAnswered) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-300 font-bold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-red-700/80 border-red-400 text-white';
                  } else {
                    btnStyle = 'opacity-40 bg-emerald-950 border-transparent text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1.5 ${btnStyle} ${
                      !isAnswered ? 'hover:scale-[1.01] active:scale-98' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-black">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-sm sm:text-base font-bold">{opt.textEs}</span>
                      </div>
                      {isAnswered && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                      )}
                    </div>
                    {showHints && (
                      <div className="text-xs text-emerald-300/80 ml-9">
                        🇦🇲 {opt.textHy}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback and Continue button */}
            {isAnswered && selectedOption !== null && (
              <div className="p-4 bg-emerald-950 rounded-2xl border border-emerald-600 text-sm text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                <div>
                  <div className="font-bold text-amber-300 mb-1">
                    {currentStep.options[selectedOption].isCorrect ? '🌟 ¡Excelente elección!' : '⚠️ ¡Cuidado con el tiempo verbal!'}
                  </div>
                  <p className="text-xs text-slate-200">
                    {currentStep.options[selectedOption].feedbackHy}
                  </p>
                </div>
                <button
                  onClick={handleContinue}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 shrink-0"
                >
                  <span>{lang === 'es' ? 'Continuar Historia' : 'Շարունակել Պատմությունը'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Victory finale */
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-yellow-200 animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-300">
              ¡¡GRAN FINAL DE LA AVENTURA!! 🏆
            </h3>
            <p className="text-emerald-200 text-base max-w-lg mx-auto">
              Ռազմիկ, դու փայլուն կերպով անցար ամբողջ ճանապարհը և նվաճեցիր բոլորի սերն ու գավաթը:
            </p>
            <button
              onClick={restartAdventure}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-xl inline-flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{lang === 'es' ? 'Jugar otra aventura' : 'Խաղալ նոր արկած'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

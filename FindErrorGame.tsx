import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ArrowRight, Volume2, RotateCcw, Sparkles } from 'lucide-react';
import { ERROR_CORRECTION_DATA } from './spanishArmenianData';
import { playCorrectSound, playWrongSound, playGoalCelebration } from './soundEffects';
import { speakSpanish } from './speechHelper';
import confetti from 'canvas-confetti';

interface FindErrorGameProps {
  lang: 'es' | 'hy';
  showHints: boolean;
  onGoalScored: () => void;
  onAddXp: (amount: number) => void;
}

export const FindErrorGame: React.FC<FindErrorGameProps> = ({
  lang,
  showHints,
  onGoalScored,
  onAddXp,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showArmenian, setShowArmenian] = useState<boolean>(false);
  const [solvedCount, setSolvedCount] = useState<number>(0);

  const currentItem = ERROR_CORRECTION_DATA[currentIndex];

  const handleSelectFix = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === currentItem.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      playGoalCelebration();
      setSolvedCount(prev => prev + 1);
      onGoalScored();
      onAddXp(35);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#f97316', '#eab308'],
      });
    } else {
      playWrongSound();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < ERROR_CORRECTION_DATA.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowArmenian(false);
    } else {
      // Loop or restart
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowArmenian(false);
    }
  };

  if (!currentItem) return null;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-5 rounded-2xl border-2 border-emerald-600 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500 rounded-2xl shadow-lg border-2 border-red-300">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 uppercase">
              {lang === 'es' ? 'ENCUENTRA EL ERROR 🔍⚽' : 'ԳՏԻ՛Ր ՍԽԱԼԸ 🔍⚽'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              {lang === 'es'
                ? 'Corrige el error verbal del comentarista para meter un golazo'
                : 'Ուղղի՛ր մեկնաբանի քերականական սխալը և գոլ խփիր:'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-emerald-700 text-center">
            <div className="text-[10px] text-emerald-400 font-bold uppercase">
              {lang === 'es' ? 'Progreso' : 'Առաջընթաց'}
            </div>
            <div className="text-lg font-black text-amber-300">
              {currentIndex + 1} / {ERROR_CORRECTION_DATA.length}
            </div>
          </div>
          <div className="bg-emerald-950 px-4 py-2 rounded-xl border border-emerald-700 text-center">
            <div className="text-[10px] text-emerald-400 font-bold uppercase">
              {lang === 'es' ? 'Goles Conseguidos' : 'Խփած Գոլեր'}
            </div>
            <div className="text-lg font-black text-white">{solvedCount} ⚽</div>
          </div>
        </div>
      </div>

      {/* Main Challenge Board */}
      <div className="bg-emerald-900/90 border-2 border-emerald-600 p-6 rounded-3xl shadow-2xl space-y-6">
        {/* Error sentence display */}
        <div className="p-6 bg-slate-900 rounded-2xl border-2 border-red-500/70 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-red-600 text-white font-extrabold text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Frase con error gramatical' : 'Սխալ պարունակող նախադասություն'}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => speakSpanish(currentItem.wrongSentence)}
                className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white transition-colors cursor-pointer"
                title={lang === 'es' ? 'Escuchar frase' : 'Լսել նախադասությունը'}
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowArmenian(!showArmenian)}
                className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-800 text-emerald-200 hover:bg-emerald-700 cursor-pointer"
              >
                ՀԱՅ 🇦🇲
              </button>
            </div>
          </div>

          <div
            onClick={() => setShowArmenian(!showArmenian)}
            className="cursor-pointer"
          >
            <p className="text-xl sm:text-2xl font-black text-white leading-relaxed">
              {currentItem.wrongSentence.split(currentItem.wrongWord).map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="text-red-400 underline decoration-wavy decoration-red-500 font-extrabold px-1 bg-red-950/60 rounded">
                      {currentItem.wrongWord}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>

            {(showArmenian || showHints) && (
              <div className="mt-3 pt-3 border-t border-slate-700 text-sm text-emerald-300">
                <span className="font-bold text-amber-400">🇦🇲 Թարգմանություն. </span>
                <span>{currentItem.armenianTranslation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Correction Options */}
        <div className="space-y-2">
          <div className="text-xs uppercase font-extrabold text-amber-300 tracking-wider">
            {lang === 'es'
              ? '¿Cuál es la forma correcta del verbo?'
              : 'Ո՞րն է բայի ճիշտ ձևը այս նախադասության մեջ:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentItem.options.map((opt, idx) => {
              let btnStyle = 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-white';

              if (isAnswered) {
                if (idx === currentItem.correctIndex) {
                  btnStyle = 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-300 shadow-lg font-black';
                } else if (idx === selectedOption) {
                  btnStyle = 'bg-red-600 border-red-300 text-white';
                } else {
                  btnStyle = 'opacity-40 bg-emerald-950 border-transparent text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectFix(idx)}
                  className={`p-3.5 rounded-2xl border-2 text-left font-bold text-base transition-all cursor-pointer flex items-center justify-between ${btnStyle} ${
                    !isAnswered ? 'hover:scale-[1.01] active:scale-95' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswered && idx === currentItem.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback & Animated Goal Replay */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border-2 animate-in fade-in duration-200 ${
              isCorrect
                ? 'bg-emerald-950 border-emerald-500 text-emerald-100'
                : 'bg-red-950 border-red-500 text-red-100'
            }`}
          >
            {isCorrect ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
                  <span className="text-lg font-black text-amber-300 uppercase">
                    {lang === 'es' ? '¡¡QUÉ GOLAZO, RAZMIK!! ⚽' : 'ԻՆՉՊԻՍԻ՜ ԳՈԼԱՍՈ, ՌԱԶՄԻԿ: ⚽'}
                  </span>
                </div>
                <div className="p-3 bg-emerald-900/80 rounded-xl border border-emerald-700 text-sm font-bold text-white flex items-center justify-between">
                  <span>✓ {currentItem.correctedSentence}</span>
                  <button
                    onClick={() => speakSpanish(currentItem.correctedSentence)}
                    className="p-1 text-amber-300 hover:text-white"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-200">{currentItem.armenianExplanation}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-base font-bold text-red-300">
                  {lang === 'es' ? '¡Inténtalo otra vez! Explicación:' : 'Փորձի՛ր կրկին: Բացատրություն:'}
                </div>
                <p className="text-xs sm:text-sm text-slate-200">{currentItem.armenianExplanation}</p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <span>{lang === 'es' ? 'Siguiente frase' : 'Հաջորդ նախադասությունը'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

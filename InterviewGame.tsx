import React, { useState } from 'react';
import { Mic, Volume2, CheckCircle2, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { JOURNALIST_INTERVIEWS } from './spanishArmenianData';
import { playCorrectSound, playWrongSound } from './soundEffects';
import { speakSpanish } from './speechHelper';

interface InterviewGameProps {
  lang: 'es' | 'hy';
  showHints: boolean;
  onAddXp: (amount: number) => void;
}

export const InterviewGame: React.FC<InterviewGameProps> = ({
  lang,
  showHints,
  onAddXp,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showArmenian, setShowArmenian] = useState<boolean>(false);

  const currentItem = JOURNALIST_INTERVIEWS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const chosen = currentItem.options[idx];
    setIsCorrect(chosen.isCorrect);

    if (chosen.isCorrect) {
      playCorrectSound();
      onAddXp(30);
    } else {
      playWrongSound();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < JOURNALIST_INTERVIEWS.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowArmenian(false);
    } else {
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
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-5 rounded-2xl border-2 border-emerald-600 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500 rounded-2xl shadow-lg border-2 border-orange-300">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 uppercase">
              {lang === 'es' ? 'ENTREVISTA CON RAZMIK 🎙️⚽' : 'ՀԱՐՑԱԶՐՈՒՅՑ ՌԱԶՄԻԿԻ ՀԵՏ 🎙️⚽'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              {lang === 'es'
                ? 'Rueda de prensa: responde a los medios con frases futbolísticas coloquiales de España'
                : 'Մամուլի ասուլիս. Պատասխանի՛ր լրագրողներին իսպանական ֆուտբոլային դարձվածքներով:'}
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-emerald-700 text-center">
          <div className="text-[10px] text-emerald-400 font-bold uppercase">
            {lang === 'es' ? 'Pregunta' : 'Հարց'}
          </div>
          <div className="text-lg font-black text-amber-300">
            {currentIndex + 1} / {JOURNALIST_INTERVIEWS.length}
          </div>
        </div>
      </div>

      {/* Press Conference Room */}
      <div className="bg-emerald-900/90 border-2 border-emerald-600 p-6 rounded-3xl shadow-2xl space-y-6">
        {/* Journalist Question */}
        <div className="p-5 bg-slate-900 rounded-2xl border-2 border-orange-500/70 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-black">
                🎙️
              </span>
              <span className="text-xs font-black text-orange-400 uppercase tracking-wider">
                {lang === 'es' ? 'Periodista Deportivo' : 'Մարզական լրագրող'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => speakSpanish(currentItem.journalistQuestionEs)}
                className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white transition-colors cursor-pointer"
                title={lang === 'es' ? 'Escuchar' : 'Լսել'}
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowArmenian(!showArmenian)}
                className="px-2.5 py-1 text-xs font-bold rounded-xl bg-emerald-800 text-emerald-200 hover:bg-emerald-700 cursor-pointer"
              >
                ՀԱՅ 🇦🇲
              </button>
            </div>
          </div>

          <div
            onClick={() => setShowArmenian(!showArmenian)}
            className="cursor-pointer"
          >
            <p className="text-lg sm:text-xl font-bold text-white">
              {currentItem.journalistQuestionEs}
            </p>

            {(showArmenian || showHints) && (
              <div className="mt-3 pt-3 border-t border-slate-700 text-sm text-emerald-300">
                <span className="font-bold text-amber-400">🇦🇲 Թարգմանություն. </span>
                <span>{currentItem.journalistQuestionHy}</span>
              </div>
            )}
          </div>

          {/* Colloquial Idiom Spotlight */}
          {currentItem.idiomEs && (
            <div className="mt-3 p-3 bg-emerald-950/90 rounded-xl border border-emerald-700 flex items-center gap-2.5 text-xs">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-black text-amber-300">🇪🇸 Իսպանական ֆուտբոլային արտահայտություն. </span>
                <span className="text-white font-mono">{currentItem.idiomEs}</span>
                {showHints && <span className="text-emerald-300 ml-1">({currentItem.idiomHy})</span>}
              </div>
            </div>
          )}
        </div>

        {/* Razmik's Answer Options */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-black text-white">
              7
            </div>
            <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
              {lang === 'es' ? 'Declaraciones de Razmik:' : 'Ռազմիկի մեկնաբանությունը.'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentItem.options.map((opt, idx) => {
              let btnStyle = 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-white';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-300 font-bold';
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
                      <span className="text-sm sm:text-base font-bold">{opt.es}</span>
                    </div>
                    {isAnswered && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    )}
                  </div>
                  {showHints && (
                    <div className="text-xs text-emerald-300/80 ml-9">
                      🇦🇲 {opt.hy}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback box */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border-2 animate-in fade-in duration-200 ${
              isCorrect
                ? 'bg-emerald-950 border-emerald-500 text-emerald-100'
                : 'bg-red-950 border-red-500 text-red-100'
            }`}
          >
            <div className="font-extrabold text-sm mb-1 text-amber-300">
              {isCorrect ? '🌟 ¡Titulares de portada! ¡Excelente declaración!' : '⚠️ ¡Cuidado con el micro!'}
            </div>
            <p className="text-xs sm:text-sm text-slate-200">{currentItem.armenianExplanation}</p>
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <span>{lang === 'es' ? 'Siguiente pregunta de la prensa' : 'Հաջորդ հարցը'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

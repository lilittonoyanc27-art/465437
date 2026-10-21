import React, { useState } from 'react';
import { Volume2, MessageSquare, CheckCircle2, XCircle, ArrowRight, UserCheck } from 'lucide-react';
import { COACH_DIALOGUES } from './spanishArmenianData';
import { playCorrectSound, playWrongSound } from './soundEffects';
import { speakSpanish } from './speechHelper';

interface CoachDialogueGameProps {
  lang: 'es' | 'hy';
  showHints: boolean;
  onAddXp: (amount: number) => void;
  onGoalScored: () => void;
}

export const CoachDialogueGame: React.FC<CoachDialogueGameProps> = ({
  lang,
  showHints,
  onAddXp,
  onGoalScored,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showArmenian, setShowArmenian] = useState<boolean>(false);

  const currentDialogue = COACH_DIALOGUES[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const chosen = currentDialogue.options[idx];
    setIsCorrect(chosen.isCorrect);

    if (chosen.isCorrect) {
      playCorrectSound();
      onAddXp(30);
      onGoalScored();
    } else {
      playWrongSound();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < COACH_DIALOGUES.length) {
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

  if (!currentDialogue) return null;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-5 rounded-2xl border-2 border-emerald-600 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500 rounded-2xl shadow-lg border-2 border-orange-300">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 uppercase">
              {lang === 'es' ? 'ESCUCHA AL ENTRENADOR 📋🔊' : 'ԼՍԻ՛Ր ՄԱՐԶՉԻՆ 📋🔊'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              {lang === 'es'
                ? 'Escucha las preguntas tácticas del míster y responde con el tiempo verbal correcto'
                : 'Լսի՛ր մարզչի մարտավարական հարցերը և պատասխանի՛ր ճիշտ ժամանակաձևով:'}
            </p>
          </div>
        </div>

        <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-emerald-700 text-center">
          <div className="text-[10px] text-emerald-400 font-bold uppercase">
            {lang === 'es' ? 'Diálogo' : 'Երկխոսություն'}
          </div>
          <div className="text-lg font-black text-amber-300">
            {currentIndex + 1} / {COACH_DIALOGUES.length}
          </div>
        </div>
      </div>

      {/* Coach Chat Stage */}
      <div className="bg-emerald-900/90 border-2 border-emerald-600 p-6 rounded-3xl shadow-2xl space-y-6">
        {/* Coach Speech Bubble */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-14 h-14 bg-gradient-to-b from-slate-800 to-slate-950 rounded-2xl border-2 border-amber-400 flex items-center justify-center text-2xl shadow-md">
              👔
            </div>
            <span className="text-[11px] font-black text-amber-300 mt-1 uppercase">EL MÍSTER</span>
          </div>

          <div className="flex-1 bg-slate-900 border-2 border-amber-400/80 p-5 rounded-2xl rounded-tl-none shadow-xl relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {lang === 'es' ? 'Pregunta del Entrenador:' : 'Մարզչի հարցը.'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakSpanish(currentDialogue.coachQuestionEs)}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{lang === 'es' ? 'Escuchar' : 'Լսել'}</span>
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
              <p className="text-xl sm:text-2xl font-black text-white leading-relaxed">
                «{currentDialogue.coachQuestionEs}»
              </p>

              {(showArmenian || showHints) && (
                <div className="mt-3 pt-3 border-t border-slate-700 text-sm text-emerald-300">
                  <span className="font-bold text-amber-400">🇦🇲 Թարգմանություն. </span>
                  <span>«{currentDialogue.coachQuestionHy}»</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Razmik's Response Options */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-xs font-black text-white">
              7
            </div>
            <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
              {lang === 'es' ? 'Razmik responde:' : 'Ռազմիկի պատասխանը.'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentDialogue.options.map((opt, idx) => {
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
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-1 ${btnStyle} ${
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
                    {isAnswered && idx === selectedOption && !opt.isCorrect && (
                      <XCircle className="w-5 h-5 text-red-200" />
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

        {/* Coach Feedback Box */}
        {isAnswered && (
          <div
            className={`p-5 rounded-2xl border-2 animate-in fade-in duration-200 ${
              isCorrect
                ? 'bg-emerald-950 border-emerald-500 text-emerald-100'
                : 'bg-red-950 border-red-500 text-red-100'
            }`}
          >
            <div className="font-extrabold text-sm mb-1 text-amber-300 flex items-center gap-2">
              <span>{isCorrect ? '✅ ¡Buen trabajo, Razmik!' : '⚠️ ¡Cuidado con los tiempos!'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200">
              {currentDialogue.options[selectedOption ?? 0].feedbackHy}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
              >
                <span>{lang === 'es' ? 'Siguiente pregunta' : 'Հաջորդ հարցը'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

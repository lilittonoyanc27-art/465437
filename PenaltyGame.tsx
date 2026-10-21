import React, { useState, useEffect } from 'react';
import { Volume2, HelpCircle, ArrowRight, RotateCcw, CheckCircle2, XCircle, Award, Trophy } from 'lucide-react';
import { Question } from './types';
import { ALL_QUESTIONS } from './spanishArmenianData';
import { FootballPitchAnimation, KickZone } from './FootballPitchAnimation';
import { playCorrectSound, playWrongSound, playChampionshipFanfare } from './soundEffects';
import { speakSpanish } from './speechHelper';

interface PenaltyGameProps {
  lang: 'es' | 'hy';
  showHints: boolean;
  onGoalScored: () => void;
  onRecordMistake: (questionId: string) => void;
  onAddXp: (amount: number) => void;
}

export const PenaltyGame: React.FC<PenaltyGameProps> = ({
  lang,
  showHints,
  onGoalScored,
  onRecordMistake,
  onAddXp,
}) => {
  // 10 penalty questions for this session
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [canShoot, setCanShoot] = useState<boolean>(false);
  const [showArmenianTranslation, setShowArmenianTranslation] = useState<boolean>(false);

  // Scoreboard
  const [goalsScored, setGoalsScored] = useState<number>(0);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [penaltyResults, setPenaltyResults] = useState<('goal' | 'miss' | 'pending')[]>(
    Array(10).fill('pending')
  );
  const [isRoundFinished, setIsRoundFinished] = useState<boolean>(false);

  // Shuffle & initialize 10 questions
  const initSession = () => {
    const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setSessionQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setCanShoot(false);
    setShowArmenianTranslation(false);
    setGoalsScored(0);
    setCorrectAnswers(0);
    setPenaltyResults(Array(10).fill('pending'));
    setIsRoundFinished(false);
  };

  useEffect(() => {
    initSession();
  }, []);

  const currentQuestion = sessionQuestions[currentIndex];

  const handleSelectAnswer = (index: number) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const correct = index === currentQuestion.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      setCorrectAnswers(prev => prev + 1);
      onAddXp(25);
      setCanShoot(true);
    } else {
      playWrongSound();
      onRecordMistake(currentQuestion.id);
      // Update this penalty as a miss
      const newResults = [...penaltyResults];
      newResults[currentIndex] = 'miss';
      setPenaltyResults(newResults);
    }
  };

  // Called when the animation finishes
  const handleShootComplete = (_zone: KickZone, isGoal: boolean) => {
    setCanShoot(false);

    const newResults = [...penaltyResults];
    if (isGoal) {
      newResults[currentIndex] = 'goal';
      setGoalsScored(prev => prev + 1);
      onGoalScored();
      onAddXp(20);
    } else {
      newResults[currentIndex] = 'miss';
    }
    setPenaltyResults(newResults);

    // Auto proceed to next question after small pause
    setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < sessionQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setCanShoot(false);
      setShowArmenianTranslation(false);
    } else {
      // Finished all 10 penalties!
      setIsRoundFinished(true);
      if (goalsScored >= 7) {
        playChampionshipFanfare();
      }
    }
  };

  if (!currentQuestion) {
    return <div className="p-8 text-center text-white">Բեռնվում է... / Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Penalty Scoreboard Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-4 rounded-2xl border-2 border-emerald-600 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Match Info */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-md border border-orange-300">
            7
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold text-amber-300 tracking-wider">
              {lang === 'es' ? 'TANDA DE PENALTIS' : '11-ՄԵՏՐԱՆՈՑՆԵՐԻ ՇԱՐՔ'}
            </div>
            <div className="text-lg font-black text-white flex items-center gap-2">
              <span>RAZMIK</span>
              <span className="text-orange-400">vs</span>
              <span>PORTERO RIVAL</span>
            </div>
          </div>
        </div>

        {/* 10 Penalty Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {penaltyResults.map((res, i) => (
            <div
              key={i}
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                i === currentIndex && !isRoundFinished
                  ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-emerald-950 scale-110'
                  : ''
              } ${
                res === 'goal'
                  ? 'bg-emerald-500 text-white shadow-[0_0_10px_#10b981]'
                  : res === 'miss'
                  ? 'bg-red-500 text-white'
                  : 'bg-emerald-800/80 text-emerald-400 border border-emerald-700'
              }`}
            >
              {res === 'goal' ? '⚽' : res === 'miss' ? '✕' : i + 1}
            </div>
          ))}
        </div>

        {/* Score Counter */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-emerald-700">
          <div className="text-right">
            <div className="text-[10px] uppercase text-emerald-400 font-bold">
              {lang === 'es' ? 'Goles / Aciertos' : 'Գոլեր / Ճիշտ'}
            </div>
            <div className="text-xl font-black text-amber-300">
              {goalsScored} ⚽ / {correctAnswers} ✅
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      {!isRoundFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left/Top: The Stadium Pitch Animation */}
          <div className="lg:col-span-7 space-y-4">
            <FootballPitchAnimation
              canShoot={canShoot}
              onShootComplete={handleShootComplete}
              lang={lang}
              showHints={showHints}
            />
          </div>

          {/* Right/Bottom: Question Card & Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-emerald-900/90 border-2 border-emerald-600 p-5 rounded-2xl shadow-xl space-y-4 relative overflow-hidden">
              {/* Question Badge */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-orange-500 text-white font-extrabold text-xs rounded-full uppercase shadow">
                  {lang === 'es' ? `Penalti ${currentIndex + 1} de 10` : `11-մետրանոց ${currentIndex + 1} / 10`}
                </span>

                <div className="flex items-center gap-2">
                  {/* Audio button to listen in Spanish */}
                  <button
                    onClick={() => speakSpanish(currentQuestion.spanishQuestion)}
                    className="p-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white transition-colors cursor-pointer"
                    title={lang === 'es' ? 'Escuchar en español' : 'Լսել իսպաներեն'}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  {/* Toggle Armenian translation */}
                  <button
                    onClick={() => setShowArmenianTranslation(!showArmenianTranslation)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      showArmenianTranslation
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-800 text-emerald-300 hover:bg-emerald-700'
                    }`}
                  >
                    ՀԱՅ 🇦🇲
                  </button>
                </div>
              </div>

              {/* Spanish Question Sentence (clickable for Armenian translation) */}
              <div
                onClick={() => setShowArmenianTranslation(!showArmenianTranslation)}
                className="p-4 bg-slate-900/90 rounded-xl border border-emerald-500/50 cursor-pointer hover:border-amber-400 transition-colors group relative"
                title={lang === 'es' ? 'Toca para ver la traducción al armenio' : 'Սեղմի՛ր հայերեն թարգմանության համար'}
              >
                <p className="text-lg sm:text-xl font-black text-amber-200 group-hover:text-amber-100 transition-colors">
                  {currentQuestion.spanishQuestion}
                </p>

                {/* Optional marker chip */}
                {currentQuestion.timeMarker && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                    <span>⏱️ Marcador:</span>
                    <span className="text-white">{currentQuestion.timeMarker}</span>
                  </div>
                )}

                {/* Armenian translation dropdown */}
                {(showArmenianTranslation || showHints) && (
                  <div className="mt-3 pt-3 border-t border-slate-700/80 text-sm text-emerald-300 animate-in fade-in duration-150">
                    <span className="font-bold text-amber-400">🇦🇲 Թարգմանություն. </span>
                    <span>{currentQuestion.armenianTranslation}</span>
                  </div>
                )}
              </div>

              {/* 4 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  let btnColor = 'bg-emerald-950/80 hover:bg-emerald-800/80 text-white border-emerald-700';

                  if (isAnswered) {
                    if (idx === currentQuestion.correctIndex) {
                      btnColor = 'bg-emerald-600 border-emerald-400 text-white font-bold ring-2 ring-emerald-400 shadow-lg';
                    } else if (idx === selectedOption) {
                      btnColor = 'bg-red-600/90 border-red-400 text-white';
                    } else {
                      btnColor = 'opacity-40 bg-emerald-950 text-slate-400 border-transparent';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`p-3 rounded-xl border-2 text-left font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-between ${btnColor} ${
                        !isAnswered ? 'hover:scale-[1.02] active:scale-95' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-white/10 text-xs flex items-center justify-center font-black">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && idx === currentQuestion.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                        <XCircle className="w-5 h-5 text-red-200" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box on Answer */}
              {isAnswered && (
                <div
                  className={`p-4 rounded-xl border-2 animate-in fade-in zoom-in-95 duration-200 ${
                    isCorrect
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-100'
                      : 'bg-red-950/80 border-red-500 text-red-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm mb-1">
                    {isCorrect ? (
                      <>
                        <span className="text-lg">🎉</span>
                        <span className="text-amber-300">
                          {lang === 'es' ? '¡Excelente, Razmik! ¡Qué bien conoces los tiempos!' : 'Ապրե՛ս, Ռազմիկ: Հիանալի՛ պատասխան:'}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">⚠️</span>
                        <span className="text-red-300">
                          {lang === 'es' ? '¡Ánimo! Aprende de la jugada:' : 'Ոչի՛նչ, սովորի՛ր այս խաղային դրվագից:'}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentQuestion.armenianExplanation}
                  </p>

                  {/* If incorrect, provide next button directly */}
                  {!isCorrect && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={handleNextQuestion}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                      >
                        <span>{lang === 'es' ? 'Siguiente penalti' : 'Հաջորդ 11-մետրանոցը'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ROUND FINISHED SUMMARY */
        <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl border-4 border-yellow-200 animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-300">
              {goalsScored >= 7 ? '¡¡FINAL DE PARTIDO HISTÓRICO!! 🏆' : '¡FIN DE LA TANDA DE PENALTIS! ⚽'}
            </h2>
            <p className="text-emerald-200 text-sm sm:text-base mt-1">
              {goalsScored >= 7
                ? 'Ռազմիկ, դու իսկական չեմպիոն ես: Հիանալի արդյունք:'
                : 'Լավ աշխատանք, Ռազմիկ: Շարունակի՛ր մարզվել և ավելի շատ գոլեր կխփես:'}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-950 p-3 rounded-2xl border border-emerald-700">
              <div className="text-xs text-emerald-400 font-bold uppercase">{lang === 'es' ? 'Goles Marcados' : 'Խփած Գոլեր'}</div>
              <div className="text-2xl font-black text-white">{goalsScored} / 10 ⚽</div>
            </div>
            <div className="bg-emerald-950 p-3 rounded-2xl border border-emerald-700">
              <div className="text-xs text-emerald-400 font-bold uppercase">{lang === 'es' ? 'Aciertos Gramaticales' : 'Ճիշտ Պատասխան'}</div>
              <div className="text-2xl font-black text-amber-300">{correctAnswers} / 10 ✅</div>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-emerald-950 p-3 rounded-2xl border border-emerald-700">
              <div className="text-xs text-emerald-400 font-bold uppercase">{lang === 'es' ? 'Puntos XP Ganados' : 'Վաստակած XP'}</div>
              <div className="text-2xl font-black text-orange-400">+{correctAnswers * 25 + goalsScored * 20} ⚡</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={initSession}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              <span>{lang === 'es' ? 'Jugar otra tanda de 10 penaltis' : 'Խաղալ ևս 10 11-մետրանոց'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Trophy, Award, CheckCircle2, XCircle, ArrowRight, Volume2, RotateCcw, Star, ShieldCheck } from 'lucide-react';
import { Question } from './types';
import { ALL_QUESTIONS } from './spanishArmenianData';
import { playCorrectSound, playWrongSound, playChampionshipFanfare } from './soundEffects';
import { speakSpanish } from './speechHelper';
import confetti from 'canvas-confetti';

interface ChampionshipGameProps {
  lang: 'es' | 'hy';
  showHints: boolean;
  onChampionshipVictory: () => void;
  onAddXp: (amount: number) => void;
  onRecordMistake: (questionId: string) => void;
}

export const ChampionshipGame: React.FC<ChampionshipGameProps> = ({
  lang,
  showHints,
  onChampionshipVictory,
  onAddXp,
  onRecordMistake,
}) => {
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3 | 4>(1);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showArmenian, setShowArmenian] = useState<boolean>(false);
  const [levelScores, setLevelScores] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [isLevelFinished, setIsLevelFinished] = useState<boolean>(false);
  const [isCupWon, setIsCupWon] = useState<boolean>(false);

  // Filter questions according to level tense
  const getLevelQuestions = (lvl: number): Question[] => {
    switch (lvl) {
      case 1:
        return ALL_QUESTIONS.filter(q => q.tense === 'perfecto');
      case 2:
        return ALL_QUESTIONS.filter(q => q.tense === 'indefinido');
      case 3:
        return ALL_QUESTIONS.filter(q => q.tense === 'imperfecto');
      case 4:
      default:
        return ALL_QUESTIONS.filter(q => q.tense === 'mix');
    }
  };

  const currentLevelQuestions = getLevelQuestions(currentLevel).slice(0, 5); // 5 key questions per stage
  const currentQuestion = currentLevelQuestions[questionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === currentQuestion.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      setLevelScores(prev => ({ ...prev, [currentLevel]: prev[currentLevel] + 1 }));
      onAddXp(30);
    } else {
      playWrongSound();
      onRecordMistake(currentQuestion.id);
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 < currentLevelQuestions.length) {
      setQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowArmenian(false);
    } else {
      // Level completed!
      setIsLevelFinished(true);
      if (currentLevel === 4) {
        setIsCupWon(true);
        playChampionshipFanfare();
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#10b981', '#f97316', '#ffffff'],
        });
        onChampionshipVictory();
      }
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < 4) {
      setCurrentLevel((prev) => (prev + 1) as 1 | 2 | 3 | 4);
      setQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowArmenian(false);
      setIsLevelFinished(false);
    }
  };

  const restartChampionship = () => {
    setCurrentLevel(1);
    setQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowArmenian(false);
    setLevelScores({ 1: 0, 2: 0, 3: 0, 4: 0 });
    setIsLevelFinished(false);
    setIsCupWon(false);
  };

  const levelInfo = [
    {
      level: 1,
      titleEs: 'Nivel 1: Pretérito Perfecto',
      titleHy: 'Մակարդակ 1. Pretérito Perfecto',
      descEs: 'Acciones en tiempo no terminado (hoy, esta semana, ya, todavía no)',
      descHy: 'Գործողություններ դեռ չավարտված ժամանակահատվածում (hoy, esta semana...)',
      badge: '🥉 Bronce',
    },
    {
      level: 2,
      titleEs: 'Nivel 2: Pretérito Indefinido',
      titleHy: 'Մակարդակ 2. Pretérito Indefinido',
      descEs: 'Acciones puntuales terminadas en el pasado (ayer, anoche, el año pasado)',
      descHy: 'Ավարտված կոնկրետ գործողություններ անցյալում (ayer, anoche...)',
      badge: '🥈 Plata',
    },
    {
      level: 3,
      titleEs: 'Nivel 3: Pretérito Imperfecto',
      titleHy: 'Մակարդակ 3. Pretérito Imperfecto',
      descEs: 'Hábitos del pasado y descripciones (cuando era pequeño, antes, siempre)',
      descHy: 'Անցյալի սովորություններ և նկարագրություններ (cuando era pequeño...)',
      badge: '🥇 Oro',
    },
    {
      level: 4,
      titleEs: 'Nivel 4: MIX DE TIEMPOS (Gran Final)',
      titleHy: 'Մակարդակ 4. Ժամանակների Համադրություն (Մեծ Եզրափակիչ)',
      descEs: 'Distingue entre los tres tiempos en jugadas maestras',
      descHy: 'Տարբերակիր բոլոր 3 ժամանակաձևերը վարպետ խաղային դրվագներում',
      badge: '🏆 Copa de Campeón',
    },
  ];

  const currentInfo = levelInfo[currentLevel - 1];

  return (
    <div className="space-y-6">
      {/* Championship Header & Progress Road */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-5 rounded-2xl border-2 border-emerald-600 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 rounded-2xl shadow-lg border-2 border-yellow-300">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-300 uppercase">
                {lang === 'es' ? 'EL CAMPEONATO DE LOS TIEMPOS 🏆' : 'ԺԱՄԱՆԱԿՆԵՐԻ ԱՌԱՋՆՈՒԹՅՈՒՆ 🏆'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200">
                {lang === 'es'
                  ? 'Supera los 4 niveles para coronarte Campeón Absoluto de la Academia'
                  : 'Հաղթահարի՛ր բոլոր 4 մակարդակները՝ Ակադեմիայի Բացարձակ Չեմպիոն դառնալու համար:'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-emerald-700 text-center">
              <div className="text-[10px] text-emerald-400 font-bold uppercase">
                {lang === 'es' ? 'Nivel Actual' : 'Ընթացիկ Մակարդակ'}
              </div>
              <div className="text-lg font-black text-amber-400">{currentLevel} / 4</div>
            </div>
          </div>
        </div>

        {/* 4 Levels Progress Road */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-800">
          {levelInfo.map(lvl => {
            const isCompleted = lvl.level < currentLevel || (lvl.level === 4 && isCupWon);
            const isCurrent = lvl.level === currentLevel && !isCupWon;

            return (
              <div
                key={lvl.level}
                className={`p-2.5 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-800/90 border-emerald-400 text-white shadow'
                    : isCurrent
                    ? 'bg-orange-500/90 border-amber-300 text-white ring-2 ring-amber-300 shadow-lg scale-105'
                    : 'bg-emerald-950/60 border-emerald-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>{lvl.badge}</span>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
                </div>
                <div className="text-xs font-black truncate">{lvl.titleEs.split(':')[1] || lvl.titleEs}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content: Question or Level Victory */}
      {!isLevelFinished ? (
        <div className="bg-emerald-900/90 border-2 border-emerald-600 p-5 sm:p-6 rounded-3xl shadow-2xl space-y-5">
          {/* Level Info Banner */}
          <div className="flex items-center justify-between bg-emerald-950 p-3 rounded-2xl border border-emerald-700">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase">
                {lang === 'es' ? currentInfo.titleEs : currentInfo.titleHy}
              </span>
              <p className="text-xs text-slate-300">{lang === 'es' ? currentInfo.descEs : currentInfo.descHy}</p>
            </div>
            <div className="text-xs font-black text-amber-300 px-3 py-1 bg-slate-900 rounded-full border border-emerald-800">
              {lang === 'es' ? `Pregunta ${questionIndex + 1} de 5` : `Հարց ${questionIndex + 1} / 5`}
            </div>
          </div>

          {/* Question Sentence */}
          {currentQuestion && (
            <div className="space-y-4">
              <div className="p-5 bg-slate-900 rounded-2xl border-2 border-emerald-500/60 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800">
                    ⚽ {currentQuestion.tense.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => speakSpanish(currentQuestion.spanishQuestion)}
                      className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-amber-300 hover:text-white transition-colors cursor-pointer"
                      title={lang === 'es' ? 'Escuchar' : 'Լսել'}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowArmenian(!showArmenian)}
                      className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-800 text-emerald-200 hover:bg-emerald-700 cursor-pointer"
                    >
                      ՀԱՅ 🇦🇲
                    </button>
                  </div>
                </div>

                <div
                  onClick={() => setShowArmenian(!showArmenian)}
                  className="cursor-pointer"
                >
                  <p className="text-lg sm:text-2xl font-black text-amber-200">
                    {currentQuestion.spanishQuestion}
                  </p>
                  {(showArmenian || showHints) && (
                    <div className="mt-3 pt-3 border-t border-slate-700 text-sm text-emerald-300">
                      <span className="font-bold text-amber-400">🇦🇲 Թարգմանություն. </span>
                      <span>{currentQuestion.armenianTranslation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  let btnColor = 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-white';

                  if (isAnswered) {
                    if (idx === currentQuestion.correctIndex) {
                      btnColor = 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-300 font-bold';
                    } else if (idx === selectedOption) {
                      btnColor = 'bg-red-600 border-red-300 text-white';
                    } else {
                      btnColor = 'opacity-40 bg-emerald-950 border-transparent text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-3.5 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all cursor-pointer flex items-center justify-between ${btnColor} ${
                        !isAnswered ? 'hover:scale-[1.01] active:scale-95' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs">
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

              {/* Explanation & Next Question Button */}
              {isAnswered && (
                <div
                  className={`p-4 rounded-2xl border-2 animate-in fade-in duration-200 ${
                    isCorrect
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-100'
                      : 'bg-red-950 border-red-500 text-red-100'
                  }`}
                >
                  <div className="font-extrabold text-sm mb-1 flex items-center gap-2">
                    {isCorrect ? (
                      <span className="text-amber-300">
                        {lang === 'es' ? '¡Golazo, Razmik! ¡Gran acierto!' : 'Ապրե՛ս, Ռազմիկ: Ճիշտ պատասխան:'}
                      </span>
                    ) : (
                      <span className="text-red-300">
                        {lang === 'es' ? '¡Cuidado con el fuera de juego! Explicación:' : 'Ուշադի՛ր եղիր. Բացատրություն:'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 mb-3">{currentQuestion.armenianExplanation}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
                    >
                      <span>{lang === 'es' ? 'Siguiente jugada' : 'Հաջորդ դրվագը'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* LEVEL COMPLETED SCREEN */
        <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 p-6 sm:p-8 rounded-3xl border-4 border-amber-400 shadow-2xl text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-yellow-200 animate-bounce">
            <Trophy className="w-12 h-12" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-4xl font-black text-amber-300 uppercase">
              {isCupWon
                ? '🏆 ¡FELICIDADES, RAZMIK! ¡ERES EL CAMPEÓN!'
                : `¡NIVEL ${currentLevel} COMPLETADO! 🥇`}
            </h2>
            <p className="text-lg text-emerald-200 mt-2 font-bold">
              {isCupWon
                ? '🏆 ՇՆՈՐՀԱՎՈՐՈՒՄ ԵՆՔ, ՌԱԶՄԻԿ։ ԴՈՒ ՉԵՄՊԻՈՆ ԵՍ։'
                : `Ռազմիկ, դու հաջողությամբ ավարտեցիր ${currentLevel}-րդ մակարդակը:`}
            </p>
          </div>

          <div className="p-4 bg-emerald-950 rounded-2xl border border-emerald-700 text-sm text-slate-200">
            {lang === 'es'
              ? `Has acertado ${levelScores[currentLevel]} de 5 jugadas en este nivel.`
              : `Այս մակարդակում դու ճիշտ պատասխանեցիր 5-ից ${levelScores[currentLevel]} հարցերին:`}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {!isCupWon ? (
              <button
                onClick={handleNextLevel}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-base rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <span>{lang === 'es' ? `Pasar al Nivel ${currentLevel + 1}` : `Անցնել ${currentLevel + 1}-րդ Մակարդակ`}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={restartChampionship}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <RotateCcw className="w-5 h-5" />
                <span>{lang === 'es' ? 'Jugar Campeonato de nuevo' : 'Խաղալ Առաջնությունը նորից'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

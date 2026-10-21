import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Clock,
  Shuffle,
  Zap,
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import {
  MEMORY_CARDS,
  UNSCRAMBLE_ITEMS,
  SMART_GOALKEEPER_ITEMS,
  PASSING_CHALLENGES,
  GOLDEN_GOAL_QUESTIONS,
} from './spanishArmenianData';
import {
  playCorrectSound,
  playWrongSound,
  playGoalCelebration,
  playKickSound,
} from './soundEffects';
import { speakSpanish } from './speechHelper';
import confetti from 'canvas-confetti';

type MiniGameTab = 'memoria' | 'ordena' | 'portero' | 'pase' | 'oro';

interface MiniGamesProps {
  lang: 'es' | 'hy';
  showHints: boolean;
  onGoalScored: () => void;
  onAddXp: (amount: number) => void;
}

export const MiniGames: React.FC<MiniGamesProps> = ({
  lang,
  showHints,
  onGoalScored,
  onAddXp,
}) => {
  const [activeTab, setActiveTab] = useState<MiniGameTab>('memoria');

  return (
    <div className="space-y-6">
      {/* Mini-Games Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-5 rounded-2xl border-2 border-emerald-600 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500 rounded-2xl shadow-lg border-2 border-yellow-300">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-300 uppercase">
              {lang === 'es' ? 'ZONA DE MINI-JUEGOS 🎮⚽' : 'ՄԻՆԻ-ԽԱՂԵՐԻ ԳՈՏԻ 🎮⚽'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200">
              {lang === 'es'
                ? '5 desafíos rápidos de fútbol y gramática española para Razmik'
                : '5 արագ ֆուտբոլային և քերականական մարտահրավերներ Ռազմիկի համար:'}
            </p>
          </div>
        </div>

        {/* Mini Game Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-emerald-950 rounded-xl border border-emerald-700">
          <button
            onClick={() => setActiveTab('memoria')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'memoria' ? 'bg-orange-500 text-white shadow' : 'text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            🃏 {lang === 'es' ? 'Memoria' : 'Հիշողություն'}
          </button>
          <button
            onClick={() => setActiveTab('ordena')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ordena' ? 'bg-orange-500 text-white shadow' : 'text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            🧩 {lang === 'es' ? 'Ordena la frase' : 'Կարգավորի՛ր'}
          </button>
          <button
            onClick={() => setActiveTab('portero')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'portero' ? 'bg-orange-500 text-white shadow' : 'text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            🧤 {lang === 'es' ? 'Portero inteligente' : 'Խելացի դարպասապահ'}
          </button>
          <button
            onClick={() => setActiveTab('pase')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pase' ? 'bg-orange-500 text-white shadow' : 'text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            🎯 {lang === 'es' ? 'Pase perfecto' : 'Ճշգրիտ փոխանցում'}
          </button>
          <button
            onClick={() => setActiveTab('oro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'oro' ? 'bg-amber-500 text-slate-950 font-black shadow' : 'text-amber-300 hover:bg-emerald-800'
            }`}
          >
            ⭐ {lang === 'es' ? 'Gol de oro' : 'Ոսկե գոլ'}
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'memoria' && <MemoriaTab lang={lang} onAddXp={onAddXp} onGoalScored={onGoalScored} />}
      {activeTab === 'ordena' && <OrdenaFraseTab lang={lang} onAddXp={onAddXp} onGoalScored={onGoalScored} />}
      {activeTab === 'portero' && <PorteroInteligenteTab lang={lang} onAddXp={onAddXp} onGoalScored={onGoalScored} />}
      {activeTab === 'pase' && <PasePerfectoTab lang={lang} onAddXp={onAddXp} onGoalScored={onGoalScored} />}
      {activeTab === 'oro' && <GolDeOroTab lang={lang} onAddXp={onAddXp} onGoalScored={onGoalScored} />}
    </div>
  );
};

// 1. MEMORIA FUTBOLÍSTICA
const MemoriaTab: React.FC<{ lang: 'es' | 'hy'; onAddXp: (n: number) => void; onGoalScored: () => void }> = ({
  lang,
  onAddXp,
  onGoalScored,
}) => {
  type Card = { id: string; text: string; pairId: string; isSpanish: boolean };

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  const setupCards = () => {
    const list: Card[] = [];
    MEMORY_CARDS.slice(0, 8).forEach((item, idx) => {
      list.push({ id: `es-${idx}`, text: item.spanish, pairId: item.id, isSpanish: true });
      list.push({ id: `hy-${idx}`, text: item.armenian, pairId: item.id, isSpanish: false });
    });
    setCards(list.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchedPairs([]);
  };

  useEffect(() => {
    setupCards();
  }, []);

  const handleCardClick = (idx: number) => {
    if (selectedCards.length === 2 || selectedCards.includes(idx)) return;
    const card = cards[idx];
    if (matchedPairs.includes(card.pairId)) return;

    if (card.isSpanish) {
      speakSpanish(card.text);
    }

    const newSelected = [...selectedCards, idx];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const first = cards[newSelected[0]];
      const second = cards[newSelected[1]];

      if (first.pairId === second.pairId && first.isSpanish !== second.isSpanish) {
        // Match!
        playCorrectSound();
        setMatchedPairs(prev => [...prev, first.pairId]);
        onAddXp(20);
        setSelectedCards([]);

        if (matchedPairs.length + 1 === 8) {
          playGoalCelebration();
          onGoalScored();
          confetti({ particleCount: 80, spread: 70 });
        }
      } else {
        playWrongSound();
        setTimeout(() => setSelectedCards([]), 1000);
      }
    }
  };

  return (
    <div className="bg-emerald-900/90 border-2 border-emerald-600 p-6 rounded-3xl shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold text-amber-300">
          {lang === 'es' ? 'Encuentra las parejas de palabras' : 'Գտի՛ր բառերի իսպաներեն-հայերեն զույգերը'}
        </div>
        <button
          onClick={setupCards}
          className="px-3 py-1 bg-emerald-800 text-emerald-200 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'es' ? 'Barajar' : 'Խառնել'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card, idx) => {
          const isFlipped = selectedCards.includes(idx) || matchedPairs.includes(card.pairId);
          const isMatched = matchedPairs.includes(card.pairId);

          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-24 p-3 rounded-2xl border-2 font-bold text-center flex items-center justify-center transition-all cursor-pointer ${
                isMatched
                  ? 'bg-emerald-700 border-emerald-400 text-white scale-95 shadow-inner'
                  : isFlipped
                  ? card.isSpanish
                    ? 'bg-amber-500 border-yellow-200 text-slate-950 shadow-lg'
                    : 'bg-blue-600 border-blue-300 text-white shadow-lg'
                  : 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-emerald-400'
              }`}
            >
              {isFlipped ? (
                <div className="space-y-1">
                  <div className="text-xs uppercase font-extrabold opacity-75">
                    {card.isSpanish ? '🇪🇸 ES' : '🇦🇲 ՀԱՅ'}
                  </div>
                  <div className="text-sm sm:text-base font-black leading-tight">{card.text}</div>
                </div>
              ) : (
                <div className="text-2xl opacity-60">⚽</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 2. ORDENA LA FRASE
const OrdenaFraseTab: React.FC<{ lang: 'es' | 'hy'; onAddXp: (n: number) => void; onGoalScored: () => void }> = ({
  lang,
  onAddXp,
  onGoalScored,
}) => {
  const [itemIndex, setItemIndex] = useState<number>(0);
  const currentItem = UNSCRAMBLE_ITEMS[itemIndex];

  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    if (currentItem) {
      setAvailableWords([...currentItem.words].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
      setIsAnswered(false);
      setIsCorrect(false);
    }
  }, [itemIndex, currentItem]);

  const handlePickWord = (word: string, indexInAvailable: number) => {
    if (isAnswered) return;
    const newAvail = [...availableWords];
    newAvail.splice(indexInAvailable, 1);
    setAvailableWords(newAvail);
    setSelectedWords(prev => [...prev, word]);
    playKickSound();
  };

  const handleRemoveWord = (indexInSelected: number) => {
    if (isAnswered) return;
    const word = selectedWords[indexInSelected];
    const newSel = [...selectedWords];
    newSel.splice(indexInSelected, 1);
    setSelectedWords(newSel);
    setAvailableWords(prev => [...prev, word]);
  };

  const checkSentence = () => {
    const constructed = selectedWords.join(' ');
    const correct = constructed === currentItem.correctSentence;
    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      playGoalCelebration();
      onGoalScored();
      onAddXp(30);
      confetti({ particleCount: 60, spread: 60 });
    } else {
      playWrongSound();
    }
  };

  const nextItem = () => {
    setItemIndex((prev) => (prev + 1) % UNSCRAMBLE_ITEMS.length);
  };

  return (
    <div className="bg-emerald-900/90 border-2 border-emerald-600 p-6 rounded-3xl shadow-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-emerald-700 pb-3">
        <span className="text-xs font-bold text-amber-300 uppercase">
          {lang === 'es' ? 'Construye la frase futbolística en orden:' : 'Դասավորի՛ր բառերը ճիշտ հերթականությամբ.'}
        </span>
        <button
          onClick={() => speakSpanish(currentItem.correctSentence)}
          className="p-1.5 rounded-lg bg-emerald-800 text-amber-300 hover:text-white"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Armenian Meaning Prompt */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-emerald-500/50 text-center">
        <div className="text-xs text-amber-400 font-bold mb-1">🇦🇲 Թարգմանություն / Significado:</div>
        <div className="text-lg font-black text-white">{currentItem.armenianTranslation}</div>
      </div>

      {/* Assembly Dropzone */}
      <div className="min-h-16 p-4 bg-emerald-950 rounded-2xl border-2 border-dashed border-emerald-500 flex flex-wrap items-center gap-2">
        {selectedWords.length === 0 ? (
          <span className="text-xs text-emerald-400 italic">
            {lang === 'es' ? 'Toca las palabras de abajo para añadirlas aquí...' : 'Սեղմի՛ր ներքևի բառերին՝ այստեղ տեղադրելու համար...'}
          </span>
        ) : (
          selectedWords.map((w, i) => (
            <button
              key={i}
              onClick={() => handleRemoveWord(i)}
              className="px-3.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-xl shadow cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              {w} ✕
            </button>
          ))
        )}
      </div>

      {/* Available Word Bank */}
      <div className="flex flex-wrap gap-2 pt-2">
        {availableWords.map((w, i) => (
          <button
            key={i}
            onClick={() => handlePickWord(w, i)}
            className="px-4 py-2 bg-emerald-950 hover:bg-emerald-800 text-amber-200 border-2 border-emerald-700 rounded-xl font-black text-sm shadow cursor-pointer transition-transform hover:scale-105"
          >
            {w}
          </button>
        ))}
      </div>

      {/* Verification or Next */}
      <div className="flex items-center justify-between pt-3 border-t border-emerald-800">
        <button
          onClick={() => {
            setAvailableWords([...currentItem.words].sort(() => Math.random() - 0.5));
            setSelectedWords([]);
            setIsAnswered(false);
          }}
          className="px-3 py-1.5 bg-emerald-800 text-xs font-bold rounded-xl text-emerald-200 hover:text-white cursor-pointer"
        >
          {lang === 'es' ? 'Reiniciar' : 'Սկզբից'}
        </button>

        {!isAnswered ? (
          <button
            disabled={availableWords.length > 0}
            onClick={checkSentence}
            className={`px-6 py-2.5 rounded-xl font-black text-sm shadow-lg transition-all ${
              availableWords.length === 0
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer animate-pulse'
                : 'bg-emerald-950 text-slate-500 border border-emerald-800 cursor-not-allowed'
            }`}
          >
            {lang === 'es' ? '¡Verificar Frase!' : 'Ստուգե՛լ նախադասությունը'}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold ${isCorrect ? 'text-amber-300' : 'text-red-400'}`}>
              {isCorrect ? '⚽ ¡GOOOL! ¡Perfecto!' : '❌ ¡Inténtalo de nuevo!'}
            </span>
            <button
              onClick={nextItem}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              {lang === 'es' ? 'Siguiente' : 'Հաջորդը'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. EL PORTERO INTELIGENTE (Rapid-fire)
const PorteroInteligenteTab: React.FC<{ lang: 'es' | 'hy'; onAddXp: (n: number) => void; onGoalScored: () => void }> = ({
  lang,
  onAddXp,
  onGoalScored,
}) => {
  const [index, setIndex] = useState<number>(0);
  const current = SMART_GOALKEEPER_ITEMS[index];
  const [timeLeft, setTimeLeft] = useState<number>(8);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    setTimeLeft(8);
    setIsAnswered(false);
    setIsCorrect(false);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsAnswered(true);
          setIsCorrect(false);
          playWrongSound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [index]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    const correct = idx === current.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      playGoalCelebration();
      onGoalScored();
      onAddXp(25);
    } else {
      playWrongSound();
    }
  };

  const handleNext = () => {
    setIndex(prev => (prev + 1) % SMART_GOALKEEPER_ITEMS.length);
  };

  return (
    <div className="bg-emerald-900/90 border-2 border-emerald-600 p-6 rounded-3xl shadow-2xl space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-amber-300 uppercase">
          {lang === 'es' ? '¡El portero se acerca! ¡Elige rápido!' : 'Դարպասապահը մոտենում է. Արագ ընտրի՛ր:'}
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-full font-black text-xs animate-pulse">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeLeft}s</span>
        </div>
      </div>

      <div className="p-5 bg-slate-900 rounded-2xl border-2 border-orange-500 text-center">
        <div className="text-xl sm:text-2xl font-black text-white">{current.promptEs}</div>
        <div className="text-xs text-emerald-300 mt-2 font-bold">🇦🇲 {current.promptHy}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={isAnswered}
            onClick={() => handleSelect(idx)}
            className={`p-4 rounded-2xl border-2 font-black text-base transition-all cursor-pointer ${
              isAnswered && idx === current.correctIndex
                ? 'bg-emerald-600 border-emerald-300 text-white'
                : isAnswered && !isCorrect
                ? 'bg-red-700 border-red-400 text-white'
                : 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-white active:scale-95'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="p-4 bg-emerald-950 rounded-2xl border border-emerald-600 flex items-center justify-between">
          <div className="text-xs text-slate-200">{current.explanationHy}</div>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
          >
            {lang === 'es' ? 'Siguiente' : 'Հաջորդը'}
          </button>
        </div>
      )}
    </div>
  );
};

// 4. PASE PERFECTO
const PasePerfectoTab: React.FC<{ lang: 'es' | 'hy'; onAddXp: (n: number) => void; onGoalScored: () => void }> = ({
  lang,
  onAddXp,
  onGoalScored,
}) => {
  const [index, setIndex] = useState<number>(0);
  const current = PASSING_CHALLENGES[index];
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    const correct = idx === current.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      playKickSound();
      onAddXp(25);
    } else {
      playWrongSound();
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setIndex(prev => (prev + 1) % PASSING_CHALLENGES.length);
  };

  return (
    <div className="bg-emerald-900/90 border-2 border-emerald-600 p-6 rounded-3xl shadow-2xl space-y-5">
      <div className="text-xs font-black text-amber-300 uppercase">
        {lang === 'es' ? '¡Elige la conjugación exacta para dar el pase de gol!' : 'Ընտրի՛ր բայի ճիշտ ձևը գոլային փոխանցում կատարելու համար.'}
      </div>

      <div className="p-5 bg-slate-900 rounded-2xl border-2 border-emerald-500">
        <div className="text-lg sm:text-xl font-bold text-white">{current.promptEs}</div>
        <div className="text-xs text-emerald-300 mt-2 font-bold">🇦🇲 {current.promptHy}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={isAnswered}
            onClick={() => handleSelect(idx)}
            className={`p-3.5 rounded-2xl border-2 font-black text-base transition-all cursor-pointer ${
              isAnswered && idx === current.correctIndex
                ? 'bg-emerald-600 border-emerald-300 text-white'
                : 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="p-4 bg-emerald-950 rounded-2xl border border-emerald-600 flex items-center justify-between">
          <div className="text-xs text-slate-200">{current.armenianExplanation}</div>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
          >
            {lang === 'es' ? 'Siguiente pase' : 'Հաջորդ փոխանցումը'}
          </button>
        </div>
      )}
    </div>
  );
};

// 5. GOL DE ORO
const GolDeOroTab: React.FC<{ lang: 'es' | 'hy'; onAddXp: (n: number) => void; onGoalScored: () => void }> = ({
  lang,
  onAddXp,
  onGoalScored,
}) => {
  const [index, setIndex] = useState<number>(0);
  const current = GOLDEN_GOAL_QUESTIONS[index];
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    const correct = idx === current.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playCorrectSound();
      playGoalCelebration();
      onGoalScored();
      onAddXp(50);
      confetti({ particleCount: 120, spread: 80, colors: ['#f59e0b', '#ffffff'] });
    } else {
      playWrongSound();
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setIndex(prev => (prev + 1) % GOLDEN_GOAL_QUESTIONS.length);
  };

  return (
    <div className="bg-gradient-to-b from-amber-950/70 via-emerald-900 to-emerald-950 border-4 border-amber-400 p-6 rounded-3xl shadow-2xl space-y-5">
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
        <span className="text-sm font-black text-amber-300 uppercase tracking-wider">
          {lang === 'es' ? '¡PRÓRROGA: GOL DE ORO!' : 'ԼՐԱՑՈՒՑԻՉ ԺԱՄԱՆԱԿ. ՈՍԿԵ ԳՈԼ:'}
        </span>
      </div>

      <div className="p-5 bg-slate-900 rounded-2xl border-2 border-amber-400">
        <div className="text-lg sm:text-xl font-black text-amber-200">{current.promptEs}</div>
        <div className="text-xs text-emerald-300 mt-2 font-bold">🇦🇲 {current.promptHy}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={isAnswered}
            onClick={() => handleSelect(idx)}
            className={`p-4 rounded-2xl border-2 font-black text-sm sm:text-base transition-all cursor-pointer ${
              isAnswered && idx === current.correctIndex
                ? 'bg-amber-500 border-yellow-200 text-slate-950 shadow-lg'
                : 'bg-emerald-950 hover:bg-emerald-800 border-emerald-700 text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className="p-4 bg-emerald-950 rounded-2xl border border-amber-500/50 flex items-center justify-between">
          <div className="text-xs text-slate-200">{current.armenianExplanation}</div>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer"
          >
            {lang === 'es' ? 'Siguiente Desafío' : 'Հաջորդ Մարտահրավերը'}
          </button>
        </div>
      )}
    </div>
  );
};

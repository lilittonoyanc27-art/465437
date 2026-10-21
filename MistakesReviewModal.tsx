import React from 'react';
import { X, RotateCcw, Volume2, CheckCircle2 } from 'lucide-react';
import { ALL_QUESTIONS } from './spanishArmenianData';
import { speakSpanish } from './speechHelper';

interface MistakesReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mistakeIds: string[];
  onClearMistakes: () => void;
  lang: 'es' | 'hy';
}

export const MistakesReviewModal: React.FC<MistakesReviewModalProps> = ({
  isOpen,
  onClose,
  mistakeIds,
  onClearMistakes,
  lang,
}) => {
  if (!isOpen) return null;

  const mistakeQuestions = ALL_QUESTIONS.filter(q => mistakeIds.includes(q.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-emerald-950 border-4 border-orange-500 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-xl shadow">
              <RotateCcw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-300">
                {lang === 'es' ? 'REPASO DE JUGADAS Y ERRORES 🔄' : 'ՍԽԱԼՆԵՐԻ ԿՐԿՆՈՒԹՅՈՒՆ ԵՎ ՎԵՐԼՈՒԾՈՒԹՅՈՒՆ 🔄'}
              </h2>
              <p className="text-xs text-emerald-200">
                {lang === 'es'
                  ? `${mistakeQuestions.length} jugadas para repasar y dominar los tiempos pasados`
                  : `${mistakeQuestions.length} հարց՝ անցյալ ժամանակաձևերը կատարելապես յուրացնելու համար`}
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

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {mistakeQuestions.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 bg-emerald-800 rounded-full flex items-center justify-center mx-auto text-3xl">
                ⚽
              </div>
              <h3 className="text-lg font-bold text-amber-300">
                {lang === 'es' ? '¡Sin errores pendientes, Razmik!' : 'Սխալներ չկան, Ռազմիկ:'}
              </h3>
              <p className="text-xs text-emerald-300 max-w-sm mx-auto">
                {lang === 'es'
                  ? 'Estás jugando con una precisión impecable. ¡Sigue así, campeón!'
                  : 'Դու խաղում ես կատարյալ ճշգրտությամբ: Շարունակի՛ր նույն ոգով, չեմպիո՛ն:'}
              </p>
            </div>
          ) : (
            mistakeQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 bg-slate-900 rounded-2xl border-2 border-emerald-700 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-orange-400 uppercase">
                    {lang === 'es' ? `Jugada ${idx + 1}` : `Հարց ${idx + 1}`}
                  </span>
                  <button
                    onClick={() => speakSpanish(q.spanishQuestion)}
                    className="p-1 text-amber-300 hover:text-white cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-base font-bold text-white">{q.spanishQuestion}</div>
                <div className="text-xs text-emerald-300">🇦🇲 {q.armenianTranslation}</div>

                <div className="p-2.5 bg-emerald-950 rounded-xl border border-emerald-600/50 flex items-center justify-between text-xs">
                  <span className="text-slate-300">{lang === 'es' ? 'Respuesta correcta:' : 'Ճիշտ պատասխան.'}</span>
                  <span className="font-black text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{q.options[q.correctIndex]}</span>
                  </span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-bold text-amber-400">Կանոն. </span>
                  <span>{q.armenianExplanation}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {mistakeQuestions.length > 0 && (
          <div className="p-4 bg-emerald-950 border-t border-emerald-800 flex justify-between items-center">
            <button
              onClick={onClearMistakes}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              {lang === 'es' ? 'Borrar historial' : 'Մաքրել պատմությունը'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              {lang === 'es' ? 'Cerrar' : 'Փակել'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

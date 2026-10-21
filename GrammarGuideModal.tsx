import React, { useState } from 'react';
import { X, BookOpen, Volume2, Award } from 'lucide-react';
import { speakSpanish } from './speechHelper';

interface GrammarGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'es' | 'hy';
}

export const GrammarGuideModal: React.FC<GrammarGuideModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'perfecto' | 'indefinido' | 'imperfecto' | 'comparativa'>('comparativa');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-emerald-950 border-4 border-emerald-500 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 border-b border-emerald-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-xl shadow">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-300">
                {lang === 'es' ? 'GUÍA DE TIEMPOS PASADOS ⚽' : 'ԻՍՊԱՆԵՐԵՆԻ ԱՆՑՅԱԼ ԺԱՄԱՆԱԿԱՁԵՎԵՐԻ ՈՒՂԵՑՈՒՅՑ ⚽'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200">
                {lang === 'es'
                  ? 'Aprende cuándo usar cada tiempo en tus jugadas futbolísticas'
                  : 'Սովորի՛ր, թե երբ օգտագործել յուրաքանչյուր ժամանակը խաղի ընթացքում'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 p-3 sm:px-6 bg-emerald-900/60 border-b border-emerald-800 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('comparativa')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'comparativa'
                ? 'bg-orange-500 text-white shadow-lg scale-105'
                : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            ⚡ {lang === 'es' ? 'Comparativa Rápida' : 'Արագ Համեմատություն'}
          </button>
          <button
            onClick={() => setActiveTab('perfecto')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'perfecto'
                ? 'bg-amber-500 text-slate-950 shadow-lg scale-105'
                : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            ⏱️ Pretérito Perfecto
          </button>
          <button
            onClick={() => setActiveTab('indefinido')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'indefinido'
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            🎯 Pretérito Indefinido
          </button>
          <button
            onClick={() => setActiveTab('imperfecto')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'imperfecto'
                ? 'bg-purple-600 text-white shadow-lg scale-105'
                : 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            📖 Pretérito Imperfecto
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-100">
          {activeTab === 'comparativa' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Perfecto card */}
                <div className="bg-amber-950/40 border-2 border-amber-500/50 p-4 rounded-2xl flex flex-col">
                  <div className="flex items-center gap-2 text-amber-400 font-black text-base sm:text-lg mb-2">
                    <span>⏱️</span>
                    <span>Pretérito Perfecto</span>
                  </div>
                  <div className="text-xs text-amber-200 mb-3 font-semibold">
                    Հայերեն. Հարակատար (ներկայի հետ կապ ունեցող)
                  </div>
                  <p className="text-xs text-slate-300 mb-3 flex-1">
                    Գործողություն, որը կատարվել է դեռևս <b>չավարտված ժամանակահատվածում</b> կամ կարևոր է ներկա պահին:
                  </p>
                  <div className="bg-emerald-950 p-2.5 rounded-xl border border-amber-600/30 text-xs space-y-1 mb-3">
                    <div className="text-amber-300 font-bold">Ժամանակի ցուցիչներ (Marcadores):</div>
                    <div className="text-slate-200">Hoy, esta semana, este mes, este año, ya, todavía no, alguna vez, nunca.</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg text-xs italic text-amber-100 flex items-center justify-between">
                    <span>«Hoy Razmik ha marcado un gol».</span>
                    <button onClick={() => speakSpanish('Hoy Razmik ha marcado un gol')} className="text-amber-400 hover:text-white p-1">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Indefinido card */}
                <div className="bg-blue-950/40 border-2 border-blue-500/50 p-4 rounded-2xl flex flex-col">
                  <div className="flex items-center gap-2 text-blue-400 font-black text-base sm:text-lg mb-2">
                    <span>🎯</span>
                    <span>Pretérito Indefinido</span>
                  </div>
                  <div className="text-xs text-blue-200 mb-3 font-semibold">
                    Հայերեն. Անցյալ կատարյալ (ավարտված փաստ)
                  </div>
                  <p className="text-xs text-slate-300 mb-3 flex-1">
                    <b>Մեկանգամյա, ավարտված գործողություն</b> անցյալի կոնկրետ ժամանակահատվածում:
                  </p>
                  <div className="bg-emerald-950 p-2.5 rounded-xl border border-blue-600/30 text-xs space-y-1 mb-3">
                    <div className="text-blue-300 font-bold">Ժամանակի ցուցիչներ (Marcadores):</div>
                    <div className="text-slate-200">Ayer, anteayer, anoche, el año pasado, el domingo pasado, en 2024, hace dos días.</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg text-xs italic text-blue-100 flex items-center justify-between">
                    <span>«Ayer Razmik marcó dos goles».</span>
                    <button onClick={() => speakSpanish('Ayer Razmik marcó dos goles')} className="text-blue-400 hover:text-white p-1">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Imperfecto card */}
                <div className="bg-purple-950/40 border-2 border-purple-500/50 p-4 rounded-2xl flex flex-col">
                  <div className="flex items-center gap-2 text-purple-400 font-black text-base sm:text-lg mb-2">
                    <span>📖</span>
                    <span>Pretérito Imperfecto</span>
                  </div>
                  <div className="text-xs text-purple-200 mb-3 font-semibold">
                    Հայերեն. Անցյալ անկատար (նկարագրություն, սովորություն)
                  </div>
                  <p className="text-xs text-slate-300 mb-3 flex-1">
                    Անցյալի <b>կրկնվող սովորություններ</b>, տևական իրավիճակներ, ֆոնային նկարագրություններ:
                  </p>
                  <div className="bg-emerald-950 p-2.5 rounded-xl border border-purple-600/30 text-xs space-y-1 mb-3">
                    <div className="text-purple-300 font-bold">Ժամանակի ցուցիչներ (Marcadores):</div>
                    <div className="text-slate-200">Antes, cuando era pequeño, todos los días, siempre, a menudo, mientras.</div>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg text-xs italic text-purple-100 flex items-center justify-between">
                    <span>«De niño, Razmik jugaba siempre».</span>
                    <button onClick={() => speakSpanish('De niño, Razmik jugaba siempre')} className="text-purple-400 hover:text-white p-1">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Master Comparison Table */}
              <div className="bg-emerald-900/80 border border-emerald-700 rounded-2xl p-4 overflow-x-auto">
                <h3 className="text-sm font-extrabold text-amber-300 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Ֆուտբոլային օրինակների համեմատություն (Ejemplos de Fútbol)</span>
                </h3>
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-emerald-700 text-emerald-300">
                      <th className="py-2 px-3">Իրադարձություն</th>
                      <th className="py-2 px-3">Իսպաներեն նախադասություն</th>
                      <th className="py-2 px-3">Հայերեն թարգմանություն</th>
                      <th className="py-2 px-3">Ինչո՞ւ այս ժամանակը</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-800/60">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-amber-400">Այսօրվա մարզում</td>
                      <td className="py-2.5 px-3 font-mono text-white">Hoy he entrenado dos horas.</td>
                      <td className="py-2.5 px-3 text-emerald-100">Այսօր ես երկու ժամ մարզվել եմ:</td>
                      <td className="py-2.5 px-3 text-slate-300">«Hoy»-ը դեռ չի ավարտվել (Pretérito Perfecto)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-blue-400">Երեկվա հանդիպում</td>
                      <td className="py-2.5 px-3 font-mono text-white">Ayer ganamos el partido.</td>
                      <td className="py-2.5 px-3 text-emerald-100">Երեկ մենք հաղթեցինք հանդիպումը:</td>
                      <td className="py-2.5 px-3 text-slate-300">«Ayer»-ը ավարտված անցյալ է (Pretérito Indefinido)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-purple-400">Մանկության սովորություն</td>
                      <td className="py-2.5 px-3 font-mono text-white">Antes entrenaba en el parque.</td>
                      <td className="py-2.5 px-3 text-emerald-100">Նախկինում ես պարկում էի մարզվում:</td>
                      <td className="py-2.5 px-3 text-slate-300">«Antes»-ը անցյալի սովորություն է (Pretérito Imperfecto)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-orange-400">Զուգահեռ գործողություններ</td>
                      <td className="py-2.5 px-3 font-mono text-white">Mientras corría, el árbitro pitó.</td>
                      <td className="py-2.5 px-3 text-emerald-100">Մինչ վազում էի, մրցավարը սուլեց:</td>
                      <td className="py-2.5 px-3 text-slate-300">Ընթացք (Imperfecto) + ընդհատող հարված (Indefinido)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'perfecto' && (
            <div className="space-y-4">
              <div className="bg-amber-950/40 border border-amber-600/40 p-4 rounded-2xl">
                <h3 className="text-base font-bold text-amber-300 mb-2">Ինչպե՞ս է կազմվում Pretérito Perfecto-ն</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-3">
                  Կազմվում է <b>HABER</b> օժանդակ բայի ներկա ձևերով + <b>Participio</b> (հիմնական բայի հարակատար ձևով):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs bg-emerald-950 p-3 rounded-xl border border-amber-700/50">
                  <div>(Yo) <b>he</b> marcado</div>
                  <div>(Tú) <b>has</b> marcado</div>
                  <div>(Él/Ella) <b>ha</b> marcado</div>
                  <div>(Nosotros) <b>hemos</b> marcado</div>
                  <div>(Vosotros) <b>habéis</b> marcado</div>
                  <div>(Ellos/Ellas) <b>han</b> marcado</div>
                </div>
              </div>

              <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700">
                <h4 className="text-sm font-bold text-amber-400 mb-2">Անկանոն Participio-ներ (Կարևոր ֆուտբոլում):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2 rounded-lg">
                    <span className="text-amber-300 font-bold">Hacer (անել)</span> → <b>hecho</b> (He hecho un buen pase)
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg">
                    <span className="text-amber-300 font-bold">Ver (տեսնել)</span> → <b>visto</b> (He visto el partido)
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg">
                    <span className="text-amber-300 font-bold">Poner (դնել)</span> → <b>puesto</b> (He puesto el balón)
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg">
                    <span className="text-amber-300 font-bold">Decir (ասել)</span> → <b>dicho</b> (El míster ha dicho...)
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg">
                    <span className="text-amber-300 font-bold">Abrir (բացել)</span> → <b>abierto</b> (Ha abierto el marcador)
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg">
                    <span className="text-amber-300 font-bold">Volver (վերադառնալ)</span> → <b>vuelto</b> (Ha vuelto al campo)
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'indefinido' && (
            <div className="space-y-4">
              <div className="bg-blue-950/40 border border-blue-600/40 p-4 rounded-2xl">
                <h3 className="text-base font-bold text-blue-300 mb-2">Ինչպե՞ս է կազմվում Pretérito Indefinido-ն</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-3">
                  Կանոնավոր բայերի վերջավորությունները:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-emerald-950 p-3 rounded-xl border border-blue-700/50">
                    <div className="text-blue-300 font-bold mb-1">-AR (օր. CHUTAR / MARCAR)</div>
                    <div>chut<b>é</b></div>
                    <div>chut<b>aste</b></div>
                    <div>chut<b>ó</b> (Razmik chutó)</div>
                    <div>chut<b>amos</b></div>
                    <div>chut<b>asteis</b></div>
                    <div>chut<b>aron</b></div>
                  </div>
                  <div className="bg-emerald-950 p-3 rounded-xl border border-blue-700/50">
                    <div className="text-blue-300 font-bold mb-1">-ER / -IR (օր. CORRER / SALIR)</div>
                    <div>corr<b>í</b></div>
                    <div>corr<b>iste</b></div>
                    <div>corr<b>ió</b></div>
                    <div>corr<b>imos</b></div>
                    <div>corr<b>isteis</b></div>
                    <div>corr<b>ieron</b></div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700">
                <h4 className="text-sm font-bold text-blue-300 mb-2">Հիմնական անկանոն բայերը Indefinido-ում:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg">
                    <div className="text-amber-300 font-bold mb-1">IR / SER</div>
                    <div>fui, fuiste, fue, fuimos, fuisteis, fueron</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg">
                    <div className="text-amber-300 font-bold mb-1">HACER</div>
                    <div>hice, hiciste, hizo, hicimos, hicisteis, hicieron</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg">
                    <div className="text-amber-300 font-bold mb-1">TENER</div>
                    <div>tuve, tuviste, tuvo, tuvimos, tuvisteis, tuvieron</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'imperfecto' && (
            <div className="space-y-4">
              <div className="bg-purple-950/40 border border-purple-600/40 p-4 rounded-2xl">
                <h3 className="text-base font-bold text-purple-300 mb-2">Ինչպե՞ս է կազմվում Pretérito Imperfecto-ն</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-3">
                  Շատ հեշտ ժամանակաձև է: -AR բայերի համար՝ -aba, իսկ -ER / -IR բայերի համար՝ -ía:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-emerald-950 p-3 rounded-xl border border-purple-700/50">
                    <div className="text-purple-300 font-bold mb-1">-AR (օր. JUGAR / ENTRENAR)</div>
                    <div>jug<b>aba</b></div>
                    <div>jug<b>abas</b></div>
                    <div>jug<b>aba</b> (Razmik jugaba)</div>
                    <div>jug<b>ábamos</b></div>
                    <div>jug<b>abais</b></div>
                    <div>jug<b>aban</b></div>
                  </div>
                  <div className="bg-emerald-950 p-3 rounded-xl border border-purple-700/50">
                    <div className="text-purple-300 font-bold mb-1">-ER / -IR (օր. CORRER / VIVIR)</div>
                    <div>corr<b>ía</b></div>
                    <div>corr<b>ías</b></div>
                    <div>corr<b>ía</b></div>
                    <div>corr<b>íamos</b></div>
                    <div>corr<b>íais</b></div>
                    <div>corr<b>ían</b></div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-900/60 p-4 rounded-2xl border border-emerald-700">
                <h4 className="text-sm font-bold text-purple-300 mb-2">Ընդամենը 3 անկանոն բայ կա Imperfecto-ում:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg">
                    <div className="text-amber-300 font-bold mb-1">SER (լինել)</div>
                    <div>era, eras, era, éramos, erais, eran</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg">
                    <div className="text-amber-300 font-bold mb-1">IR (գնալ)</div>
                    <div>iba, ibas, iba, íbamos, ibais, iban</div>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg">
                    <div className="text-amber-300 font-bold mb-1">VER (տեսնել)</div>
                    <div>veía, veías, veía, veíamos, veíais, veían</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-emerald-950 border-t border-emerald-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 font-bold text-white rounded-xl shadow cursor-pointer transition-colors"
          >
            {lang === 'es' ? '¡Entendido, a jugar!' : 'Հասկացա՛, դեպի խաղադաշտ:'}
          </button>
        </div>
      </div>
    </div>
  );
};

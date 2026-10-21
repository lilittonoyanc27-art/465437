import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playKickSound, playGoalCelebration, playSaveSound } from './soundEffects';

export type KickZone = 'left-high' | 'left-low' | 'center' | 'right-high' | 'right-low';

interface FootballPitchAnimationProps {
  canShoot: boolean;
  onShootComplete: (zone: KickZone, isGoal: boolean) => void;
  lang: 'es' | 'hy';
  showHints: boolean;
  isPracticeMode?: boolean;
}

export const FootballPitchAnimation: React.FC<FootballPitchAnimationProps> = ({
  canShoot,
  onShootComplete,
  lang,
  showHints,
}) => {
  const [shotState, setShotState] = useState<'idle' | 'running' | 'flying' | 'celebrating' | 'saved'>('idle');
  const [selectedZone, setSelectedZone] = useState<KickZone | null>(null);
  const [keeperDiving, setKeeperDiving] = useState<'idle' | 'left' | 'right' | 'center'>('idle');
  const [isGoalResult, setIsGoalResult] = useState<boolean>(true);

  // Goalkeeper subtle idle sway
  const [keeperOffset, setKeeperOffset] = useState<number>(0);

  useEffect(() => {
    if (shotState === 'idle') {
      const interval = setInterval(() => {
        setKeeperOffset(prev => (prev === 12 ? -12 : 12));
      }, 1400);
      return () => clearInterval(interval);
    }
  }, [shotState]);

  const handleShoot = (zone: KickZone) => {
    if (!canShoot || shotState !== 'idle') return;

    setSelectedZone(zone);
    setShotState('running');
    playKickSound();

    // Determine goalkeeper dive logic:
    // With 85% probability in regular good answer mode, Razmik scores if he placed it well!
    const keeperDirection: 'left' | 'right' | 'center' = 
      Math.random() < 0.4 ? 'left' : (Math.random() < 0.7 ? 'right' : 'center');

    // High corners (escuadras) are almost impossible for keeper to save
    const isEscuadra = zone === 'left-high' || zone === 'right-high';
    const isGoal = isEscuadra || (
      (zone.includes('left') && keeperDirection !== 'left') ||
      (zone.includes('right') && keeperDirection !== 'right') ||
      (zone === 'center' && keeperDirection !== 'center') ||
      Math.random() > 0.15
    );

    setIsGoalResult(isGoal);

    // Timeline:
    // 0ms: run up
    // 400ms: ball leaves foot
    setTimeout(() => {
      setShotState('flying');
      setKeeperDiving(keeperDirection);
    }, 400);

    // 950ms: ball arrives at goal
    setTimeout(() => {
      if (isGoal) {
        setShotState('celebrating');
        playGoalCelebration();
        // Fire confetti cannons
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#f97316', '#eab308', '#ffffff'],
        });
      } else {
        setShotState('saved');
        playSaveSound();
      }

      // Notify parent after animation finishes
      setTimeout(() => {
        onShootComplete(zone, isGoal);
        setShotState('idle');
        setSelectedZone(null);
        setKeeperDiving('idle');
      }, 2200);
    }, 950);
  };

  // Ball destination coordinates based on chosen zone
  const getBallStyles = () => {
    if (shotState === 'idle' || shotState === 'running') {
      return {
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%) scale(1)',
        transition: 'none',
      };
    }

    let top = '38%';
    let left = '50%';

    switch (selectedZone) {
      case 'left-high':
        top = '22%';
        left = '32%';
        break;
      case 'left-low':
        top = '36%';
        left = '31%';
        break;
      case 'center':
        top = '28%';
        left = '50%';
        break;
      case 'right-high':
        top = '22%';
        left = '68%';
        break;
      case 'right-low':
        top = '36%';
        left = '69%';
        break;
    }

    return {
      top,
      left,
      transform: 'translate(-50%, -50%) scale(0.48) rotate(720deg)',
      transition: 'all 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  // Goalkeeper dive style
  const getKeeperStyles = () => {
    if (keeperDiving === 'idle') {
      return {
        transform: `translateX(calc(-50% + ${keeperOffset}px))`,
        transition: 'transform 1.4s ease-in-out',
      };
    }
    if (keeperDiving === 'left') {
      return {
        transform: 'translateX(-120%) translateY(20%) rotate(-35deg) scale(0.9)',
        transition: 'transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
      };
    }
    if (keeperDiving === 'right') {
      return {
        transform: 'translateX(20%) translateY(20%) rotate(35deg) scale(0.9)',
        transition: 'transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
      };
    }
    return {
      transform: 'translateX(-50%) translateY(10%) scale(1.05)',
      transition: 'transform 0.3s ease-out',
    };
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-4 border-emerald-600 bg-emerald-900 shadow-2xl">
      {/* Stadium Crowd & Floodlights */}
      <div className="relative h-20 sm:h-24 bg-gradient-to-b from-slate-900 via-emerald-950 to-emerald-900 overflow-hidden flex items-end justify-between px-4">
        {/* Floodlight beams */}
        <div className="absolute -top-10 left-10 w-32 h-44 bg-gradient-to-b from-amber-100/30 via-white/10 to-transparent rotate-12 blur-md pointer-events-none" />
        <div className="absolute -top-10 right-10 w-32 h-44 bg-gradient-to-b from-amber-100/30 via-white/10 to-transparent -rotate-12 blur-md pointer-events-none" />
        
        {/* Animated Stadium Crowd silhouettes */}
        <div className="w-full flex justify-around opacity-40 items-end pb-1 select-none">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="w-2 sm:w-2.5 rounded-t-full bg-slate-200 animate-pulse"
              style={{
                height: `${14 + (i % 5) * 4}px`,
                animationDelay: `${(i * 0.15) % 1.5}s`,
              }}
            />
          ))}
        </div>

        {/* Stadium Banner */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-amber-500/90 text-slate-950 font-extrabold text-xs sm:text-sm px-4 py-0.5 rounded-full shadow-md tracking-wider uppercase border border-amber-300">
          ESTADIO RAZMIK ARENA ⚽
        </div>
      </div>

      {/* Football Pitch Floor */}
      <div className="relative h-72 sm:h-80 md:h-96 pitch-stripes-vertical overflow-hidden">
        {/* Penalty Box White Lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[78%] h-44 border-b-2 border-l-2 border-r-2 border-white/80 rounded-b-sm" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[42%] h-24 border-b-2 border-l-2 border-r-2 border-white/70" />
        
        {/* Penalty Arc */}
        <div className="absolute top-36 left-1/2 -translate-x-1/2 w-28 h-14 border-b-2 border-white/60 rounded-b-full" />
        
        {/* Penalty Spot */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md ring-4 ring-emerald-600/40" />

        {/* GOAL STRUCTURE */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[64%] sm:w-[56%] h-28 sm:h-32 border-4 border-white bg-emerald-950/40 rounded-t-sm shadow-2xl">
          {/* Net Pattern */}
          <div className="w-full h-full net-pattern opacity-90 relative">
            {/* Goal Line Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white shadow-[0_0_12px_#ffffff]" />
          </div>

          {/* Aiming Targets (Visible when player answered correctly and can shoot) */}
          {canShoot && shotState === 'idle' && (
            <div className="absolute inset-0 z-20 grid grid-cols-3 grid-rows-2 p-1 gap-1">
              <button
                type="button"
                onClick={() => handleShoot('left-high')}
                className="group relative flex items-center justify-center rounded border-2 border-dashed border-amber-300/80 bg-amber-500/20 hover:bg-amber-500/50 hover:border-amber-400 cursor-pointer transition-all active:scale-95"
                title={lang === 'es' ? 'Escuadra izquierda (¡Imparable!)' : 'Ձախ վերին իննյակ (Անկասելի)'}
              >
                <span className="text-amber-300 font-black text-xs sm:text-sm drop-shadow group-hover:scale-110 transition-transform">
                  ↖ 90°
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleShoot('center')}
                className="group col-start-2 row-span-2 relative flex items-center justify-center rounded border-2 border-dashed border-orange-400/80 bg-orange-500/20 hover:bg-orange-500/50 hover:border-orange-300 cursor-pointer transition-all active:scale-95"
                title={lang === 'es' ? 'Centro potente' : 'Ուժգին կենտրոն'}
              >
                <span className="text-orange-200 font-black text-xs sm:text-base drop-shadow group-hover:scale-110 transition-transform flex flex-col items-center">
                  <span>⚡</span>
                  <span className="text-[10px] sm:text-xs uppercase">{lang === 'es' ? 'Centro' : 'Կենտրոն'}</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleShoot('right-high')}
                className="group relative flex items-center justify-center rounded border-2 border-dashed border-amber-300/80 bg-amber-500/20 hover:bg-amber-500/50 hover:border-amber-400 cursor-pointer transition-all active:scale-95"
                title={lang === 'es' ? 'Escuadra derecha (¡Imparable!)' : 'Աջ վերին իննյակ (Անկասելի)'}
              >
                <span className="text-amber-300 font-black text-xs sm:text-sm drop-shadow group-hover:scale-110 transition-transform">
                  ↗ 90°
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleShoot('left-low')}
                className="group relative flex items-center justify-center rounded border-2 border-dashed border-emerald-300/80 bg-emerald-500/20 hover:bg-emerald-500/50 hover:border-emerald-200 cursor-pointer transition-all active:scale-95"
                title={lang === 'es' ? 'Raso izquierda' : 'Ձախ ներքև'}
              >
                <span className="text-emerald-200 font-bold text-xs drop-shadow group-hover:scale-110 transition-transform">
                  ↙ {lang === 'es' ? 'Raso' : 'Ներքև'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleShoot('right-low')}
                className="group relative flex items-center justify-center rounded border-2 border-dashed border-emerald-300/80 bg-emerald-500/20 hover:bg-emerald-500/50 hover:border-emerald-200 cursor-pointer transition-all active:scale-95"
                title={lang === 'es' ? 'Raso derecha' : 'Աջ ներքև'}
              >
                <span className="text-emerald-200 font-bold text-xs drop-shadow group-hover:scale-110 transition-transform">
                  ↘ {lang === 'es' ? 'Raso' : 'Ներքև'}
                </span>
              </button>
            </div>
          )}

          {/* GOALKEEPER */}
          <div
            className="absolute bottom-1 left-1/2 z-10 w-14 sm:w-16 h-20 sm:h-24 flex flex-col items-center pointer-events-none select-none"
            style={getKeeperStyles()}
          >
            {/* Goalkeeper Head */}
            <div className="w-5 h-5 bg-amber-200 rounded-full border border-amber-900 relative shadow-sm">
              <div className="absolute top-1 left-1 w-1 h-1 bg-slate-900 rounded-full" />
              <div className="absolute top-1 right-1 w-1 h-1 bg-slate-900 rounded-full" />
            </div>
            {/* Goalkeeper Gloves & Arms */}
            <div className="relative w-12 flex justify-between -mt-1">
              <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full border border-slate-900 shadow-sm" />
              <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full border border-slate-900 shadow-sm" />
            </div>
            {/* Goalkeeper Jersey (Cyan/Black keeper kit) */}
            <div className="w-8 h-9 bg-cyan-500 rounded-t-md border border-cyan-800 shadow flex items-center justify-center text-[8px] font-black text-slate-950">
              1
            </div>
            {/* Goalkeeper Shorts & Legs */}
            <div className="w-7 h-4 bg-slate-900 rounded-b-sm" />
            <div className="w-6 flex justify-between mt-0.5">
              <div className="w-2 h-4 bg-cyan-400 rounded-b-sm" />
              <div className="w-2 h-4 bg-cyan-400 rounded-b-sm" />
            </div>
          </div>
        </div>

        {/* RAZMIK THE FOOTBALLER */}
        <div
          className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none transition-all duration-300 ${
            shotState === 'running' ? '-translate-y-4 scale-105' : ''
          }`}
        >
          {/* Head & Hair */}
          <div className="relative w-6 h-6 bg-amber-100 rounded-full border border-amber-900/60 shadow">
            {/* Hair */}
            <div className="absolute -top-1 left-0 right-0 h-3 bg-amber-950 rounded-t-full" />
          </div>

          {/* Jersey - Razmik #7 in vibrant royal blue & orange trim */}
          <div className="relative w-11 h-11 bg-gradient-to-b from-blue-600 to-blue-700 rounded-t-md border-t-2 border-orange-500 shadow-lg flex flex-col items-center justify-center text-white">
            <span className="text-[7px] font-black tracking-tighter text-amber-300 uppercase leading-none">
              RAZMIK
            </span>
            <span className="text-sm font-black leading-none text-white drop-shadow">
              7
            </span>
          </div>

          {/* Shorts & Legs */}
          <div className="w-9 h-5 bg-blue-900 rounded-b-sm border-t border-white/20" />
          <div className="w-7 flex justify-between mt-0.5">
            <div className={`w-2.5 h-5 bg-orange-500 rounded-b-sm border border-orange-700 shadow ${shotState === 'running' ? 'rotate-12' : ''}`} />
            <div className={`w-2.5 h-5 bg-orange-500 rounded-b-sm border border-orange-700 shadow ${shotState === 'running' ? '-rotate-12' : ''}`} />
          </div>
        </div>

        {/* THE BALL */}
        <div
          className="absolute z-30 pointer-events-none"
          style={getBallStyles()}
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full border-2 border-slate-900 shadow-lg flex items-center justify-center relative overflow-hidden">
            {/* Classic pentagons */}
            <div className="w-2 h-2 bg-slate-900 rounded-full" />
            <div className="absolute -top-1 left-1.5 w-1.5 h-1.5 bg-slate-900 rotate-45" />
            <div className="absolute -bottom-1 right-1.5 w-1.5 h-1.5 bg-slate-900 rotate-45" />
          </div>
          {/* Ball Shadow on Ground */}
          <div className="w-6 h-2 bg-black/40 rounded-full blur-[1px] -mt-1 mx-auto" />
        </div>

        {/* OVERLAYS: CELEBRATION OR SAVE */}
        {shotState === 'celebrating' && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[1px] animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white font-black text-2xl sm:text-4xl md:text-5xl px-6 py-3 rounded-2xl shadow-2xl border-4 border-yellow-300 tracking-wider animate-bounce text-center">
              ⚽ ¡¡GOOOOOOL, RAZMIK!! ⚽
            </div>
            <div className="text-yellow-300 font-extrabold text-base sm:text-lg mt-2 drop-shadow-md text-center">
              {lang === 'es' ? '¡Disparo imparable directo a la red!' : 'Հիասքա՛նչ հարված՝ ուղիղ ցանցը:'}
            </div>
          </div>
        )}

        {shotState === 'saved' && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[1px] animate-in fade-in duration-200">
            <div className="bg-red-700 text-white font-extrabold text-xl sm:text-3xl px-6 py-2.5 rounded-2xl shadow-2xl border-2 border-red-300 text-center">
              🧤 {lang === 'es' ? '¡PARADA DEL PORTERO!' : 'ԴԱՐՊԱՍԱՊԱՀԸ ՀԵՏ ՄՂԵՑ:'}
            </div>
            <div className="text-slate-100 font-bold text-sm sm:text-base mt-2 text-center bg-slate-900/80 px-4 py-1 rounded-full">
              {lang === 'es' ? '¡Buen intento, Razmik! Sigue entrenando.' : 'Լավ փորձ էր, Ռազմիկ: Շարունակի՛ր մարզվել:'}
            </div>
          </div>
        )}

        {/* Guidance Prompt for child */}
        {canShoot && shotState === 'idle' && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-orange-600/95 text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg border border-orange-300 animate-pulse flex items-center gap-1.5 whitespace-nowrap">
            <span>🎯</span>
            <span>
              {lang === 'es' 
                ? '¡Respuesta correcta! Elige hacia dónde chutar el penalti:' 
                : 'Ճիշտ պատասխան: Ընտրի՛ր, թե ուր հարվածել 11-մետրանոցը:'}
            </span>
          </div>
        )}
      </div>

      {/* Aiming helper caption below pitch */}
      {canShoot && shotState === 'idle' && showHints && (
        <div className="p-2 bg-emerald-950/90 text-center text-xs text-emerald-200 border-t border-emerald-800">
          {lang === 'es' 
            ? '💡 Consejo táctico: Las escuadras (90°) son más difíciles de alcanzar para el portero.' 
            : '💡 Մարտավարական հուշում. Վերին անկյունները (90°) դարպասապահի համար ամենաբարդն են:'}
        </div>
      )}
    </div>
  );
};

'use client';

import { useEffect, useRef, useState } from 'react';

// CONTENUTO
import Hero from './components/hero';
import About from './components/about';
import { TimelinePartOne, TimelinePartTwo } from './components/timeline';
import Projects from './components/myprojects';
import Contacts from './components/contacts';
import Footer from './components/footer';

// SFONDI
import {
  BackgroundVariantA,
  BackgroundVariantB,
  BackgroundVariantC,
} from './components/UI/Backgrounds';

type SceneIndex = 0 | 1 | 2 | 3 | 4 | 5;

export default function Page() {
  // scene: 0 A/Hero, 1 B/About, 2 C/TL1, 3 C/TL2, 4 A/Projects, 5 B/Contacts
  const [scene, setScene] = useState<SceneIndex>(0);

  const scrollerRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  // intro: prima A leggermente più lenta
  const [intro, setIntro] = useState(true);
  const [didInitialA, setDidInitialA] = useState(false);

  // fasi per A/B (C resta sticky → un solo layer)
  const [aPhase, setAPhase] = useState<0 | 1>(0);
  const [bPhase, setBPhase] = useState<0 | 1>(0);

  const prevVariantRef = useRef<'A' | 'B' | 'C'>('A');
  const sceneRef = useRef<SceneIndex>(scene);
  const isProgrammaticScrollRef = useRef(false);
  const releaseTimerRef = useRef<number | null>(null);

  const log = (...a: unknown[]) => console.log('[ScrollDebug]', ...a);

  // IntersectionObserver per capire quale section è dominante
  useEffect(() => {
    const r = requestAnimationFrame(() => setIntro(false));

    const root = sectionsRef.current;
    if (!root) return () => cancelAnimationFrame(r);

    const io = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const next = Number((visible.target as HTMLElement).dataset.index) as SceneIndex;
        setScene(next);
      },
      { threshold: [0.5], root: scrollerRef.current || null }
    );

    root.querySelectorAll<HTMLElement>('[data-index]').forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      cancelAnimationFrame(r);
    };
  }, []);

  // Parametri animazione
  const DUR_OUT = 560;
  const GAP_MS = 240;
  const DUR_IN = 700;
  const INITIAL_IN = 1200;
  const OUT_OPACITY_TAIL = 90;
  const EASING_OUT = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
  const EASING_IN = 'cubic-bezier(0.16, 1, 0.3, 1)';

  // Reduced motion
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  function mkMorphStyle(opts: {
    active: boolean; // family attiva ora
    isOn: boolean;   // true = entrante, false = uscente
    z: number;
    initialSlow?: boolean;
  }): React.CSSProperties {
    const { active, isOn, z, initialSlow } = opts;
    const delayIn = initialSlow ? 0 : DUR_OUT + GAP_MS;
    const delayOut = 0;

    if (reduced) {
      return {
        opacity: active && isOn ? 1 : 0,
        transform: `scale(${active ? (isOn ? 1 : 0) : 0})`,
        transformOrigin: '50% 50%',
        transition: isOn
          ? `transform ${initialSlow ? INITIAL_IN : DUR_IN}ms ${EASING_IN} ${delayIn}ms, opacity ${initialSlow ? INITIAL_IN : DUR_IN}ms ${EASING_IN} ${delayIn}ms`
          : `transform ${DUR_OUT}ms ${EASING_OUT} ${delayOut}ms, opacity ${OUT_OPACITY_TAIL}ms ${EASING_OUT} ${Math.max(0, DUR_OUT - OUT_OPACITY_TAIL)}ms`,
        zIndex: active ? (isOn ? z + 1 : z) : 1,
        willChange: 'transform, opacity',
      };
    }

    return {
      opacity: active ? (isOn ? 1 : 0) : 0,
      transform: `scale(${active ? (isOn ? 1 : 0) : 0})`,
      transformOrigin: '50% 50%',
      transition: isOn
        ? `transform ${initialSlow ? INITIAL_IN : DUR_IN}ms ${EASING_IN} ${delayIn}ms, opacity ${initialSlow ? INITIAL_IN : DUR_IN}ms ${EASING_IN} ${delayIn}ms`
        : `transform ${DUR_OUT}ms ${EASING_OUT} ${delayOut}ms, opacity ${OUT_OPACITY_TAIL}ms ${EASING_OUT} ${Math.max(0, DUR_OUT - OUT_OPACITY_TAIL)}ms`,
      zIndex: active ? (isOn ? z + 1 : z) : 1,
      willChange: 'transform, opacity',
    };
  }

  // Mappatura variant per scena (ordine richiesto)
  const variantFor = (s: number): 'A' | 'B' | 'C' => {
    if (s === 0) return 'A';             // Hero
    if (s === 1) return 'B';             // About
    if (s === 2 || s === 3) return 'C';  // Timeline1 & Timeline2 (C "sticky")
    if (s === 4) return 'A';             // Projects
    return 'B';                          // Contacts
  };

  const aActive = scene === 0 || scene === 4;
  const bActive = scene === 1 || scene === 5;
  const cActive = scene === 2 || scene === 3; // C resta attivo su entrambe

  // Toggle fasi SOLO quando si cambia *variant* (non tra 2→3 che resta C)
  useEffect(() => {
    const curr = variantFor(scene);
    const prev = prevVariantRef.current;
    if (curr !== prev) {
      if (curr === 'A') setAPhase((p) => (p ^ 1) as 0 | 1);
      if (curr === 'B') setBPhase((p) => (p ^ 1) as 0 | 1);
      prevVariantRef.current = curr;
    }
    sceneRef.current = scene;
  }, [scene]);

  // scroll controllato: una sezione per “tacca”
  useEffect(() => {
    const scroller = scrollerRef.current;
    const root = sectionsRef.current;
    if (!scroller || !root) return;

    const clamp = (v: number): SceneIndex => {
      const totalSections = root.querySelectorAll('[data-index]').length;
      const maxIndex = Math.min(Math.max(totalSections - 1, 0), 5);
      const normalized = Math.max(0, Math.min(maxIndex, Math.round(v)));
      return normalized as SceneIndex;
    };

    const scrollToScene = (target: SceneIndex) => {
      const el = root.querySelector<HTMLElement>(`[data-index="${target}"]`);
      if (!el) return;
      const scrollerRect = scroller.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();  
      const offset = elRect.top - scrollerRect.top + scroller.scrollTop;

      isProgrammaticScrollRef.current = true;
      sceneRef.current = target;
      setScene(target);
      scroller.scrollTo({ top: offset, behavior: 'smooth' });

      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        releaseTimerRef.current = null;
      }, DUR_OUT + GAP_MS + DUR_IN + 20);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isProgrammaticScrollRef.current) return;
      if (Math.abs(e.deltaY) < 10) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = clamp(sceneRef.current + dir);
      if (next !== sceneRef.current) scrollToScene(next);
    };

    let touchStartY = 0;
    let handled = false;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
      handled = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (handled || touchStartY === 0) return;
      const dy = touchStartY - (e.touches[0]?.clientY ?? 0);
      if (Math.abs(dy) < 40) return;
      e.preventDefault();
      handled = true;
      if (isProgrammaticScrollRef.current) return;
      const dir = dy > 0 ? 1 : -1;
      const next = clamp(sceneRef.current + dir);
      if (next !== sceneRef.current) scrollToScene(next);
    };
    const onTouchEnd = () => {
      touchStartY = 0;
      handled = false;
    };

    const onKey = (e: KeyboardEvent) => {
      if (!['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp'].includes(e.key)) return;
      e.preventDefault();
      const dir = ['ArrowDown', 'PageDown'].includes(e.key) ? 1 : -1;
      const next = clamp(sceneRef.current + dir);
      if (next !== sceneRef.current) scrollToScene(next);
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });
    scroller.addEventListener('touchstart', onTouchStart, { passive: true });
    scroller.addEventListener('touchmove', onTouchMove, { passive: false });
    scroller.addEventListener('touchend', onTouchEnd);
    scroller.addEventListener('touchcancel', onTouchEnd);
    scroller.addEventListener('keydown', onKey, { passive: false });

    return () => {
      scroller.removeEventListener('wheel', onWheel);
      scroller.removeEventListener('touchstart', onTouchStart);
      scroller.removeEventListener('touchmove', onTouchMove);
      scroller.removeEventListener('touchend', onTouchEnd);
      scroller.removeEventListener('touchcancel', onTouchEnd);
      scroller.removeEventListener('keydown', onKey);
      if (releaseTimerRef.current) {
        clearTimeout(releaseTimerRef.current);
        releaseTimerRef.current = null;
      }
    };
  }, []);

  // Prima A più lenta
  useEffect(() => {
    if (!intro && aActive && !didInitialA) setDidInitialA(true);
  }, [intro, aActive, didInitialA]);

  // STILI LAYER
  const aStyle1: React.CSSProperties = mkMorphStyle({
    active: aActive && aPhase === 0,
    isOn: aActive && aPhase === 0,
    z: 2,
    initialSlow: aActive && !didInitialA && !intro,
  });
  const aStyle2: React.CSSProperties = mkMorphStyle({
    active: aActive && aPhase === 1,
    isOn: aActive && aPhase === 1,
    z: 2,
  });

  const bStyle1: React.CSSProperties = mkMorphStyle({
    active: bActive && bPhase === 0,
    isOn: bActive && bPhase === 0,
    z: 2,
  });
  const bStyle2: React.CSSProperties = mkMorphStyle({
    active: bActive && bPhase === 1,
    isOn: bActive && bPhase === 1,
    z: 2,
  });

  // C STICKY: un solo layer, nessun toggle tra scena 2→3
  const cStyle: React.CSSProperties = mkMorphStyle({
    active: cActive,
    isOn: cActive,
    z: 2,
  });

  return (
    <main
      ref={scrollerRef}
      tabIndex={0}
      className="relative h-dvh overflow-y-auto no-scrollbar snap-y snap-mandatory z-10 bg-black text-white"
    >
      {/* BACKGROUND FISSO */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* A (2 layer) */}
        <div className="absolute inset-0" style={aStyle1}><BackgroundVariantA /></div>
        <div className="absolute inset-0" style={aStyle2}><BackgroundVariantA /></div>

        {/* B (2 layer) */}
        <div className="absolute inset-0" style={bStyle1}><BackgroundVariantB /></div>
        <div className="absolute inset-0" style={bStyle2}><BackgroundVariantB /></div>

        {/* C (STICKY, 1 layer) */}
        <div className="absolute inset-0" style={cStyle}><BackgroundVariantC /></div>
      </div>

      {/* SEZIONI */}
      <div ref={sectionsRef}>
        {/* 0 - A / Hero */}
        <section id="hero" data-index={0} className="h-dvh snap-start snap-always flex items-center justify-center">
          <Hero />
        </section>

        {/* 1 - B / About */}
        <section id="about" data-index={1} className="h-dvh snap-start snap-always flex items-center justify-center">
          <About />
        </section>

        {/* 2 - C / Timeline Parte 1 */}
        <section id="timeline" data-index={2} className="h-dvh snap-start snap-always flex items-center justify-center">
          <TimelinePartOne className="h-dvh" />
        </section>

        {/* 3 - C / Timeline Parte 2 (C resta attivo, niente re-animazione) */}
        <section id="timeline-continued" data-index={3} className="h-dvh snap-start snap-always flex items-center justify-center">
          <TimelinePartTwo className="h-dvh" />
        </section>

        {/* 4 - A / Projects */}
        <section id="projects" data-index={4} className="h-dvh snap-start snap-always flex items-center justify-center">
          <Projects />
        </section>

        {/* 5 - B / Contacts */}
        <section id="contact" data-index={5} className="h-dvh snap-start snap-always flex items-center justify-center">
          <div className="w-full max-w-6xl px-4">
            <Contacts />
          </div>
        </section>
      </div>
    </main>
  );
}

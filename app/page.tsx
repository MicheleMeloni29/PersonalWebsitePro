'use client';

import { useEffect, useRef, useState } from 'react';

import About from './components/about';
import Contacts from './components/contacts';
import Hero from './components/hero';
import Projects from './components/myprojects';
import { Timeline } from './components/timeline';
import {
  BackgroundVariantA,
  BackgroundVariantB,
  BackgroundVariantC,
} from './components/UI/Backgrounds';

type SceneIndex = 0 | 1 | 2 | 3 | 4;

const ABOUT_SCENES = 3;
const PROJECT_SCENES = 4;

export default function Page() {
  const [scene, setScene] = useState<SceneIndex>(0);

  const scrollerRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  const [intro, setIntro] = useState(true);
  const [didInitialA, setDidInitialA] = useState(false);

  const [aPhase, setAPhase] = useState<0 | 1>(0);
  const [bPhase, setBPhase] = useState<0 | 1>(0);

  const prevVariantRef = useRef<'A' | 'B' | 'C'>('A');
  const sceneRef = useRef<SceneIndex>(scene);
  const isProgrammaticScrollRef = useRef(false);
  const releaseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const r = requestAnimationFrame(() => setIntro(false));

    const root = sectionsRef.current;
    const scroller = scrollerRef.current;
    if (!root || !scroller) return () => cancelAnimationFrame(r);

    const getSectionBounds = (selector: string) => {
      const section = root.querySelector<HTMLElement>(selector);
      if (!section) return null;

      const start = section.offsetTop;
      const end = Math.max(start, start + section.offsetHeight - scroller.clientHeight);
      return { start, end };
    };

    const getForcedScene = (): SceneIndex | null => {
      const scrollTop = scroller.scrollTop;
      const ranges: Array<{ selector: string; sceneIndex: SceneIndex }> = [
        { selector: '#about', sceneIndex: 1 },
        { selector: '#timeline', sceneIndex: 2 },
        { selector: '#projects', sceneIndex: 3 },
      ];

      for (const range of ranges) {
        const bounds = getSectionBounds(range.selector);
        if (bounds && scrollTop >= bounds.start && scrollTop <= bounds.end) {
          return range.sceneIndex;
        }
      }

      return null;
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return;

        const forcedScene = getForcedScene();
        if (forcedScene !== null) {
          setScene(forcedScene);
          return;
        }

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        const next = Number((visible.target as HTMLElement).dataset.index) as SceneIndex;
        setScene(next);
      },
      { threshold: [0, 0.15, 0.3, 0.5], root: scroller }
    );

    root.querySelectorAll<HTMLElement>('[data-index]').forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      cancelAnimationFrame(r);
    };
  }, []);

  const DUR_OUT = 560;
  const GAP_MS = 240;
  const DUR_IN = 700;
  const INITIAL_IN = 1200;
  const OUT_OPACITY_TAIL = 90;
  const EASING_OUT = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
  const EASING_IN = 'cubic-bezier(0.16, 1, 0.3, 1)';

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);

  function mkMorphStyle(opts: {
    active: boolean;
    isOn: boolean;
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
      zIndex: active ? (isOn ? z + 1 : z) : z,
      willChange: 'transform, opacity',
    };
  }

  const variantFor = (currentScene: SceneIndex): 'A' | 'B' | 'C' => {
    if (currentScene === 0 || currentScene === 3) return 'A';
    if (currentScene === 2) return 'C';
    return 'B';
  };

  const aActive = scene === 0 || scene === 3;
  const bActive = scene === 1 || scene === 4;
  const cActive = scene === 2;

  useEffect(() => {
    const curr = variantFor(scene);
    const prev = prevVariantRef.current;
    if (curr !== prev) {
      if (curr === 'A') setAPhase((phase) => (phase ^ 1) as 0 | 1);
      if (curr === 'B') setBPhase((phase) => (phase ^ 1) as 0 | 1);
      prevVariantRef.current = curr;
    }
    sceneRef.current = scene;
  }, [scene]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const root = sectionsRef.current;
    if (!scroller || !root) return;

    const isTimelineTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement && Boolean(target.closest('#timeline'));
    const isProjectsGridTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement && Boolean(target.closest('[data-projects-grid="true"]'));
    const isProjectsModalTarget = (target: EventTarget | null) =>
      target instanceof HTMLElement && Boolean(target.closest('[data-projects-modal="true"]'));

    const getSectionBounds = (selector: string) => {
      const section = root.querySelector<HTMLElement>(selector);
      if (!section) return null;

      const start = section.offsetTop;
      const end = Math.max(start, start + section.offsetHeight - scroller.clientHeight);
      return { start, end };
    };

    const getTimelineScrollContainer = () =>
      root.querySelector<HTMLElement>('[data-timeline-scroll="true"]');
    const getProjectsGridScrollContainer = () =>
      root.querySelector<HTMLElement>('[data-projects-grid="true"]');

    const isTimelineScrolledToBottom = () => {
      const timelineScroller = getTimelineScrollContainer();
      if (!timelineScroller) return false;

      return timelineScroller.scrollTop + timelineScroller.clientHeight >= timelineScroller.scrollHeight - 4;
    };

    const isProjectsGridScrolledToTop = () => {
      const projectsGridScroller = getProjectsGridScrollContainer();
      if (!projectsGridScroller) return true;

      return projectsGridScroller.scrollTop <= 4;
    };

    const isProjectsGridScrolledToBottom = () => {
      const projectsGridScroller = getProjectsGridScrollContainer();
      if (!projectsGridScroller) return true;

      return (
        projectsGridScroller.scrollTop + projectsGridScroller.clientHeight >=
        projectsGridScroller.scrollHeight - 4
      );
    };

    const scrollProjectsGridBy = (delta: number) => {
      const projectsGridScroller = getProjectsGridScrollContainer();
      if (!projectsGridScroller) return false;
      if (projectsGridScroller.scrollHeight <= projectsGridScroller.clientHeight + 1) return false;

      projectsGridScroller.scrollTop += delta;
      return true;
    };

    const getSteppedSceneIndex = (selector: string, totalScenes: number) => {
      const bounds = getSectionBounds(selector);
      if (!bounds) return 0;

      const relativeTop = scroller.scrollTop - bounds.start;
      const rawIndex = Math.round(relativeTop / scroller.clientHeight);
      return Math.max(0, Math.min(totalScenes - 1, rawIndex));
    };

    const isWithinRange = (selector: string) => {
      const bounds = getSectionBounds(selector);
      if (!bounds) return false;
      return scroller.scrollTop >= bounds.start && scroller.scrollTop <= bounds.end;
    };

    const clamp = (value: number): SceneIndex => {
      const totalSections = root.querySelectorAll('[data-index]').length;
      const maxIndex = Math.min(Math.max(totalSections - 1, 0), 4);
      const normalized = Math.max(0, Math.min(maxIndex, Math.round(value)));
      return normalized as SceneIndex;
    };

    const scrollToAbsoluteTop = (top: number, targetScene: SceneIndex) => {
      isProgrammaticScrollRef.current = true;
      sceneRef.current = targetScene;
      setScene(targetScene);
      scroller.scrollTo({ top, behavior: 'smooth' });

      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = window.setTimeout(() => {
        scroller.scrollTop = top;
        isProgrammaticScrollRef.current = false;
        releaseTimerRef.current = null;
      }, DUR_OUT + GAP_MS + DUR_IN + 20);
    };

    const scrollToSteppedScene = (selector: string, nextIndex: number, totalScenes: number, targetScene: SceneIndex) => {
      const bounds = getSectionBounds(selector);
      if (!bounds) return;

      const clampedIndex = Math.max(0, Math.min(totalScenes - 1, nextIndex));
      const targetTop = bounds.start + clampedIndex * scroller.clientHeight;
      scrollToAbsoluteTop(targetTop, targetScene);
    };

    const scrollToScene = (target: SceneIndex) => {
      const el = root.querySelector<HTMLElement>(`[data-index="${target}"]`);
      if (!el) return;
      const scrollerRect = scroller.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset = elRect.top - scrollerRect.top + scroller.scrollTop;
      scrollToAbsoluteTop(offset, target);
    };

    const advanceAbout = (direction: 1 | -1) => {
      const currentSceneIndex = getSteppedSceneIndex('#about', ABOUT_SCENES);

      if (direction > 0) {
        if (currentSceneIndex < ABOUT_SCENES - 1) {
          scrollToSteppedScene('#about', currentSceneIndex + 1, ABOUT_SCENES, 1);
        } else {
          scrollToScene(2);
        }
        return;
      }

      if (currentSceneIndex > 0) {
        scrollToSteppedScene('#about', currentSceneIndex - 1, ABOUT_SCENES, 1);
      } else {
        scrollToScene(0);
      }
    };

    const advanceProjects = (direction: 1 | -1) => {
      const currentSceneIndex = getSteppedSceneIndex('#projects', PROJECT_SCENES);

      if (direction > 0) {
        if (currentSceneIndex < PROJECT_SCENES - 1) {
          scrollToSteppedScene('#projects', currentSceneIndex + 1, PROJECT_SCENES, 3);
        } else {
          scrollToScene(4);
        }
        return;
      }

      if (currentSceneIndex > 0) {
        scrollToSteppedScene('#projects', currentSceneIndex - 1, PROJECT_SCENES, 3);
      } else {
        scrollToScene(2);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (isTimelineTarget(e.target)) {
        if (e.deltaY > 0 && isTimelineScrolledToBottom()) {
          e.preventDefault();
          if (isProgrammaticScrollRef.current) return;
          scrollToScene(3);
        }
        return;
      }

      if (isProjectsModalTarget(e.target)) return;
      if (isProjectsGridTarget(e.target)) {
        if (Math.abs(e.deltaY) < 10) return;

        const movingDown = e.deltaY > 0;
        const canContinueInsideGrid =
          (movingDown && !isProjectsGridScrolledToBottom()) ||
          (!movingDown && !isProjectsGridScrolledToTop());

        if (canContinueInsideGrid) {
          e.preventDefault();
          scrollProjectsGridBy(e.deltaY);
          return;
        }

        if (isWithinRange('#projects')) {
          e.preventDefault();
          if (isProgrammaticScrollRef.current) return;
          advanceProjects(movingDown ? 1 : -1);
          return;
        }

        return;
      }
      if (Math.abs(e.deltaY) < 10) return;

      if (isWithinRange('#about')) {
        e.preventDefault();
        if (isProgrammaticScrollRef.current) return;
        advanceAbout(e.deltaY > 0 ? 1 : -1);
        return;
      }

      if (isWithinRange('#timeline')) return;

      if (isWithinRange('#projects')) {
        e.preventDefault();
        if (isProgrammaticScrollRef.current) return;
        advanceProjects(e.deltaY > 0 ? 1 : -1);
        return;
      }

      e.preventDefault();
      if (isProgrammaticScrollRef.current) return;

      const next = clamp(sceneRef.current + (e.deltaY > 0 ? 1 : -1));
      if (next !== sceneRef.current) scrollToScene(next);
    };

    let touchStartY = 0;
    let handled = false;
    let touchStartedInTimeline = false;
    let touchStartedInProjectsGrid = false;
    let touchStartedInProjectsModal = false;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
      handled = false;
      touchStartedInTimeline = isTimelineTarget(e.target);
      touchStartedInProjectsGrid = isProjectsGridTarget(e.target);
      touchStartedInProjectsModal = isProjectsModalTarget(e.target);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartedInTimeline) {
        const dy = touchStartY - (e.touches[0]?.clientY ?? 0);
        if (dy > 40 && isTimelineScrolledToBottom()) {
          e.preventDefault();
          handled = true;
          if (isProgrammaticScrollRef.current) return;
          scrollToScene(3);
        }
        return;
      }

      if (touchStartedInProjectsGrid) {
        if (handled || touchStartY === 0) return;

        const dy = touchStartY - (e.touches[0]?.clientY ?? 0);
        if (Math.abs(dy) < 40) return;

        const movingDown = dy > 0;
        const canContinueInsideGrid =
          (movingDown && !isProjectsGridScrolledToBottom()) ||
          (!movingDown && !isProjectsGridScrolledToTop());

        if (canContinueInsideGrid) {
          e.preventDefault();
          scrollProjectsGridBy(dy);
          touchStartY = e.touches[0]?.clientY ?? touchStartY;
          return;
        }

        e.preventDefault();
        handled = true;
        if (isProgrammaticScrollRef.current) return;
        advanceProjects(movingDown ? 1 : -1);
        return;
      }

      if (touchStartedInProjectsModal) return;
      if (handled || touchStartY === 0) return;

      const dy = touchStartY - (e.touches[0]?.clientY ?? 0);
      if (Math.abs(dy) < 40) return;

      if (isWithinRange('#about')) {
        e.preventDefault();
        handled = true;
        if (isProgrammaticScrollRef.current) return;
        advanceAbout(dy > 0 ? 1 : -1);
        return;
      }

      if (isWithinRange('#timeline')) return;

      if (isWithinRange('#projects')) {
        e.preventDefault();
        handled = true;
        if (isProgrammaticScrollRef.current) return;
        advanceProjects(dy > 0 ? 1 : -1);
        return;
      }

      e.preventDefault();
      handled = true;
      if (isProgrammaticScrollRef.current) return;

      const next = clamp(sceneRef.current + (dy > 0 ? 1 : -1));
      if (next !== sceneRef.current) scrollToScene(next);
    };

    const onTouchEnd = () => {
      touchStartY = 0;
      handled = false;
      touchStartedInTimeline = false;
      touchStartedInProjectsGrid = false;
      touchStartedInProjectsModal = false;
    };

    const onKey = (e: KeyboardEvent) => {
      if (!['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp'].includes(e.key)) return;

      const direction = ['ArrowDown', 'PageDown'].includes(e.key) ? 1 : -1;

      if (isWithinRange('#about')) {
        e.preventDefault();
        if (isProgrammaticScrollRef.current) return;
        advanceAbout(direction);
        return;
      }

      if (isWithinRange('#timeline')) return;

      if (isWithinRange('#projects')) {
        e.preventDefault();
        if (isProgrammaticScrollRef.current) return;
        advanceProjects(direction);
        return;
      }

      e.preventDefault();
      const next = clamp(sceneRef.current + direction);
      if (next !== sceneRef.current) scrollToScene(next);
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });
    scroller.addEventListener('touchstart', onTouchStart, { passive: true });
    scroller.addEventListener('touchmove', onTouchMove, { passive: false });
    scroller.addEventListener('touchend', onTouchEnd);
    scroller.addEventListener('touchcancel', onTouchEnd);
    scroller.addEventListener('keydown', onKey);

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

  useEffect(() => {
    if (!intro && aActive && !didInitialA) setDidInitialA(true);
  }, [intro, aActive, didInitialA]);

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
  const cStyle: React.CSSProperties = mkMorphStyle({
    active: cActive,
    isOn: cActive,
    z: 2,
  });

  return (
    <main
      ref={scrollerRef}
      tabIndex={0}
      className="relative z-10 h-dvh overflow-y-auto bg-black text-white no-scrollbar snap-y snap-proximity"
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0" style={aStyle1}>
          <BackgroundVariantA />
        </div>
        <div className="absolute inset-0" style={aStyle2}>
          <BackgroundVariantA />
        </div>

        <div className="absolute inset-0" style={bStyle1}>
          <BackgroundVariantB />
        </div>
        <div className="absolute inset-0" style={bStyle2}>
          <BackgroundVariantB />
        </div>

        <div className="absolute inset-0" style={cStyle}>
          <BackgroundVariantC />
        </div>
      </div>

      <div ref={sectionsRef}>
        <section
          id="hero"
          data-index={0}
          className="flex h-dvh snap-start snap-always items-center justify-center"
        >
          <Hero />
        </section>

        <About data-index={1} scrollContainerRef={scrollerRef} />

        <Timeline data-index={2} />

        <Projects data-index={3} scrollContainerRef={scrollerRef} />

        <section
          id="contact"
          data-index={4}
          className="flex h-dvh snap-start snap-always items-center justify-center"
        >
          <div className="w-full max-w-6xl px-4">
            <Contacts />
          </div>
        </section>

      </div>
    </main>
  );
}

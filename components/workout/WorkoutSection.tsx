'use client';

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const WorkoutCanvas = dynamic(() => import('../three/WorkoutCanvas'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   CATEGORY DATA
───────────────────────────────────────────── */
const CATEGORIES = [
  {
    id: '01',
    label: 'STRENGTH',
    descriptor: 'Calibrated progressive overload. Biomechanical\npower engineered without intimidation.',
    telemetry: '01 // CALIBRATED LOAD · TENSION INTEGRITY',
  },
  {
    id: '02',
    label: 'CARDIO',
    descriptor: 'High-output conditioning intervals.\nPeak cardiovascular threshold and athletic stamina.',
    telemetry: '02 // ZONE 4 THRESHOLD · METABOLIC PEAK',
  },
  {
    id: '03',
    label: 'FUNCTIONAL\nTRAINING',
    descriptor: 'Multi-planar rotational movement.\nBuilding core stability that translates to life.',
    telemetry: '03 // MULTI-PLANAR · CORE STABILIZATION',
  },
  {
    id: '04',
    label: 'MOBILITY',
    descriptor: 'Fascial elasticity, joint decompression,\nand restorative flow for sustainable longevity.',
    telemetry: '04 // FASCIAL RESTORATION · ZERO INFLAMMATION',
  },
] as const;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function WorkoutSection() {
  const containerRef   = useRef<HTMLDivElement>(null!);
  const stickyRef      = useRef<HTMLDivElement>(null!);
  // Manifesto
  const manifestoRef   = useRef<HTMLDivElement>(null!);
  const headlineRef    = useRef<HTMLDivElement>(null!);
  const supportRef     = useRef<HTMLDivElement>(null!);
  // Category layers — each category has its own ref
  const cat0Ref        = useRef<HTMLDivElement>(null!);
  const cat1Ref        = useRef<HTMLDivElement>(null!);
  const cat2Ref        = useRef<HTMLDivElement>(null!);
  const cat3Ref        = useRef<HTMLDivElement>(null!);
  const catRefs        = [cat0Ref, cat1Ref, cat2Ref, cat3Ref];
  // HUD
  const sectionTagRef  = useRef<HTMLDivElement>(null!);
  const telemetryRef   = useRef<HTMLDivElement>(null!);
  const outroRef       = useRef<HTMLDivElement>(null!);
  const progressDotsRef = useRef<HTMLDivElement>(null!);

  const scrollProgress = useRef(0);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── MASTER SCRUB TIMELINE (pinned 350% virtual scroll) ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=350%',
          scrub: 1.2,
          pin: stickyRef.current,
          anticipatePin: 1,
          onUpdate: (self) => {
            scrollProgress.current = self.progress;
          },
        },
      });

      /* ── PHASE 1 (0% → 28%): SECTION TAG + MANIFESTO ENTRANCE ── */
      // Section label drops in
      tl.fromTo(sectionTagRef.current,
        { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' },
        0,
      );

      // Headline words blur-fade in from below
      tl.fromTo(headlineRef.current,
        { opacity: 0, y: 60, filter: 'blur(14px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.22, ease: 'power3.out' },
        0.04,
      );

      // Supporting text staggered after headline
      tl.fromTo(supportRef.current,
        { opacity: 0, y: 30, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.18, ease: 'power2.out' },
        0.14,
      );

      /* ── PHASE 2 (28% → 42%): MANIFESTO RETREATS ── */
      tl.to(headlineRef.current,
        { opacity: 0, y: -30, filter: 'blur(10px)', duration: 0.12, ease: 'power2.in' },
        0.28,
      );
      tl.to(supportRef.current,
        { opacity: 0, y: -20, duration: 0.1, ease: 'power1.in' },
        0.3,
      );

      /* ── PHASE 3 (42% → 92%): CATEGORY STATES ── */
      // Each category occupies ~12.5% of total progress
      // Stagger: 0, 0.125, 0.25, 0.375 offset from 0.42
      const catDuration = 0.11;
      const catSpacing  = 0.125;

      CATEGORIES.forEach((cat, i) => {
        const startIn  = 0.42 + i * catSpacing;
        const startOut = startIn + catDuration + 0.02;

        // Entrance
        tl.fromTo(catRefs[i].current,
          { opacity: 0, x: 60, filter: 'blur(12px)' },
          {
            opacity: 1, x: 0, filter: 'blur(0px)',
            duration: catDuration, ease: 'power3.out',
            onStart: () => setActiveCategory(i),
          },
          startIn,
        );

        // Exit (except last which stays until outro)
        if (i < CATEGORIES.length - 1) {
          tl.to(catRefs[i].current,
            { opacity: 0, x: -60, filter: 'blur(12px)', duration: 0.08, ease: 'power2.in' },
            startOut,
          );
        }
      });

      /* ── PHASE 4 (92% → 100%): OUTRO ── */
      // Last category out
      tl.to(catRefs[3].current,
        { opacity: 0, x: -60, filter: 'blur(12px)', duration: 0.06, ease: 'power2.in' },
        0.92,
      );
      tl.fromTo(outroRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' },
        0.94,
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    /* OUTER: sets the scrollable height */
    <div ref={containerRef} id="strength" className="relative w-full" style={{ height: '450vh' }}>
      {/* STICKY VIEWPORT */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-blite-black"
      >
        {/* ── AMBIENT BACKGROUND GLOW ── */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Deep radial purple center */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: '70vw',
              height: '70vw',
              background: 'radial-gradient(circle, rgba(107,0,173,0.18) 0%, transparent 70%)',
            }}
          />
          {/* Subtle magenta corner accent */}
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: '40vw',
              height: '40vw',
              background: 'radial-gradient(circle at 100% 100%, rgba(236,19,128,0.07) 0%, transparent 60%)',
            }}
          />
        </div>

        {/* ── SUBTLE GRID ── */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(157,78,221,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(157,78,221,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* ── 3D CANVAS (right half) ── */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <WorkoutCanvas scrollProgress={scrollProgress} phase={activeCategory} />
        </div>

        {/* ── SECTION TAG ── */}
        <div
          ref={sectionTagRef}
          className="absolute top-8 left-1/2 -translate-x-1/2 z-30 opacity-0 pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-pill border border-blite-violet/30 backdrop-blur-md">
            <span className="w-1 h-1 rounded-full bg-blite-pink animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-blite-pink">
              01 // THE BLITE WORKOUT
            </span>
          </div>
        </div>

        {/* ── LAYER 1: MANIFESTO ── */}
        <div
          ref={manifestoRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none"
        >
          <div ref={headlineRef} className="opacity-0 text-center max-w-5xl">
            <h2
              className="font-black uppercase leading-[0.9] tracking-tighter text-white"
              style={{ fontSize: 'clamp(3.2rem, 9vw, 8rem)' }}
            >
              YOUR STRONGEST<br />
              <span className="text-gradient-pink">SELF</span> STARTS HERE.
            </h2>
          </div>
          <div ref={supportRef} className="opacity-0 mt-6 text-center">
            <p className="text-blite-steel text-lg sm:text-xl font-light tracking-wide">
              Train with purpose.&nbsp;&nbsp;Move with confidence.
            </p>
          </div>
        </div>

        {/* ── LAYER 2: CATEGORY STATES ── */}
        {CATEGORIES.map((cat, i) => (
          <div
            key={cat.id}
            ref={catRefs[i]}
            className="absolute inset-0 z-20 flex flex-col items-start justify-center px-[8vw] sm:px-[10vw] pointer-events-none opacity-0"
          >
            {/* Category number */}
            <div className="text-[11px] font-mono tracking-[0.35em] uppercase text-blite-pink/80 mb-4">
              {cat.id}
            </div>

            {/* EDITORIAL LARGE LABEL */}
            <h3
              className="font-black uppercase leading-[0.85] tracking-tighter text-white whitespace-pre-line"
              style={{ fontSize: 'clamp(4rem, 11vw, 10rem)' }}
            >
              {cat.label}
            </h3>

            {/* Thin divider */}
            <div className="w-16 h-[2px] bg-gradient-to-r from-blite-pink to-transparent mt-6 mb-5" />

            {/* Descriptor */}
            <p
              className="text-blite-steel font-light leading-relaxed whitespace-pre-line max-w-md"
              style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.15rem)' }}
            >
              {cat.descriptor}
            </p>
          </div>
        ))}

        {/* ── LAYER 3: OUTRO CUE ── */}
        <div
          ref={outroRef}
          className="absolute bottom-16 left-0 right-0 z-30 flex flex-col items-center pointer-events-none select-none text-center opacity-0"
        >
          <div className="text-[11px] font-mono tracking-[0.3em] uppercase text-blite-pink mb-2">
            CONTINUE SCROLLING
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
            02 // FIND YOUR POWER
          </div>
          <div className="w-[1px] h-10 bg-gradient-to-b from-blite-pink to-transparent mt-3 animate-pulse" />
        </div>

        {/* ── LEFT SIDEBAR: CATEGORY PROGRESS DOTS ── */}
        <div
          ref={progressDotsRef}
          className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4 pointer-events-none select-none"
        >
          <span className="text-[9px] font-mono tracking-widest uppercase text-blite-steel/50 rotate-180 [writing-mode:vertical-rl] mb-2">
            PROGRAMME
          </span>
          {CATEGORIES.map((cat, i) => (
            <div key={cat.id} className="flex items-center gap-2">
              <div
                className="w-[1.5px] rounded-full transition-all duration-500"
                style={{
                  height: activeCategory === i ? '28px' : '10px',
                  background: activeCategory === i
                    ? 'linear-gradient(to bottom, #ec1380, #9d4edd)'
                    : 'rgba(156,143,168,0.3)',
                }}
              />
            </div>
          ))}
          <span className="text-[9px] font-mono tracking-widest uppercase text-blite-pink font-semibold mt-1">
            {String(activeCategory + 1).padStart(2, '0')}
          </span>
        </div>

        {/* ── BOTTOM HUD ── */}
        <div className="absolute bottom-8 left-0 right-0 z-30 px-6 sm:px-10 flex items-end justify-between pointer-events-none select-none">
          {/* Left telemetry */}
          <div ref={telemetryRef} className="hidden sm:flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-blite-steel transition-all duration-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blite-pink animate-pulse" />
            <span>{CATEGORIES[activeCategory].telemetry}</span>
          </div>
          {/* Right — section index */}
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-blite-silver/50">
            <span>SECTION</span>
            <span className="text-blite-pink font-semibold">02 / 05</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   PROGRAM CHAPTER DEFINITIONS
───────────────────────────────────────────── */
interface ProgramData {
  id: string;
  num: string;
  title: string;
  tagline: string;
  subline: string;
  telemetry: string;
  focus: string;
  metrics: { label: string; value: string }[];
  accentColor: string;
  bgGlow: string;
  ambientGradient: string;
  // Visual motif description
  motif: {
    type: 'strength' | 'cardio' | 'functional' | 'mobility';
    titleCode: string;
  };
}

const PROGRAMS: ProgramData[] = [
  {
    id: 'strength',
    num: '01',
    title: 'STRENGTH',
    tagline: 'Build strength.',
    subline: 'Build confidence.',
    telemetry: '01 // LOAD PROFILE · ADAPTIVE HYPERTROPHY',
    focus: 'Calibrated Progressive Overload',
    metrics: [
      { label: 'INTENSITY', value: '85-92%' },
      { label: 'CADENCE', value: '3-4X / WK' },
      { label: 'DURATION', value: '50 MIN' },
    ],
    accentColor: '#ec1380', // Blite Pink
    bgGlow: 'rgba(236, 19, 128, 0.18)',
    ambientGradient: 'radial-gradient(circle at 70% 50%, rgba(139, 47, 201, 0.25) 0%, rgba(7, 3, 14, 0.95) 70%)',
    motif: {
      type: 'strength',
      titleCode: 'BIOMECHANICS // 25MM OLYMPIC AXIS',
    },
  },
  {
    id: 'cardio',
    num: '02',
    title: 'CARDIO',
    tagline: 'Move faster.',
    subline: 'Feel stronger.',
    telemetry: '02 // LACTATE CLEARANCE · VO2 MAX PEAK',
    focus: 'High-Output Interval Conditioning',
    metrics: [
      { label: 'ZONE TARGET', value: 'ZONE 4/5' },
      { label: 'ENERGY SYSTEM', value: 'AEROBIC-GLYCO' },
      { label: 'DURATION', value: '45 MIN' },
    ],
    accentColor: '#ff2a8d', // Hot Magenta
    bgGlow: 'rgba(255, 42, 141, 0.20)',
    ambientGradient: 'radial-gradient(circle at 65% 55%, rgba(236, 19, 128, 0.28) 0%, rgba(11, 5, 22, 0.96) 75%)',
    motif: {
      type: 'cardio',
      titleCode: 'THRESHOLD // HIGH-VELOCITY FLUX',
    },
  },
  {
    id: 'functional',
    num: '03',
    title: 'FUNCTIONAL',
    tagline: 'Train for the way',
    subline: 'you move.',
    telemetry: '03 // ROTATIONAL POWER · ASYMMETRIC STABILITY',
    focus: 'Multi-Planar Kinetic Translation',
    metrics: [
      { label: 'PLANES', value: 'SAGITTAL / TRANSVERSE' },
      { label: 'CORE LOAD', value: 'CONTINUOUS' },
      { label: 'DURATION', value: '50 MIN' },
    ],
    accentColor: '#9d4edd', // Radiant Violet
    bgGlow: 'rgba(157, 78, 221, 0.22)',
    ambientGradient: 'radial-gradient(circle at 60% 45%, rgba(157, 78, 221, 0.26) 0%, rgba(7, 3, 14, 0.95) 70%)',
    motif: {
      type: 'functional',
      titleCode: 'KINETIC // MULTI-AXIAL MATRIX',
    },
  },
  {
    id: 'mobility',
    num: '04',
    title: 'MOBILITY',
    tagline: 'Move freely.',
    subline: 'Move better.',
    telemetry: '04 // FASCIAL RESTORATION · PARASYMPATHETIC',
    focus: 'Joint Decompression & Fascial Glide',
    metrics: [
      { label: 'ELONGATION', value: '+34% EXT' },
      { label: 'RECOVERY', value: 'ZERO STRAIN' },
      { label: 'DURATION', value: '40 MIN' },
    ],
    accentColor: '#c084fc', // Lavender Light
    bgGlow: 'rgba(192, 132, 252, 0.18)',
    ambientGradient: 'radial-gradient(circle at 65% 50%, rgba(107, 0, 173, 0.22) 0%, rgba(7, 3, 14, 0.98) 70%)',
    motif: {
      type: 'mobility',
      titleCode: 'RESTORATION // FASCIAL TENSION RELEASE',
    },
  },
];

/* ─────────────────────────────────────────────
   VISUAL MOTIF COMPONENT
   Procedural editorial artwork for each program
───────────────────────────────────────────── */
function ProgramVisualArtwork({
  motif,
  active,
}: {
  motif: ProgramData['motif'];
  active: boolean;
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      {/* Outer framing HUD bracket */}
      <div className="absolute inset-4 sm:inset-10 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-[2px]">
        {/* Top-right corner tag */}
        <div className="absolute top-4 right-5 text-[9px] font-mono tracking-widest text-blite-steel/60 uppercase">
          {motif.titleCode}
        </div>
        {/* Precision grid marks */}
        <div className="absolute bottom-4 left-5 text-[9px] font-mono tracking-widest text-blite-pink/70">
          BLITE // STUDIO SPEC 0{motif.type === 'strength' ? '1' : motif.type === 'cardio' ? '2' : motif.type === 'functional' ? '3' : '4'}
        </div>
      </div>

      {/* SVG Kinetic Editorial Geometries */}
      {motif.type === 'strength' && (
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Outer rotating knurl ring */}
          <div className="absolute inset-0 rounded-full border border-blite-pink/20 animate-[spin_40s_linear_infinite]" />
          {/* Inner multi-layered concentric power rings */}
          <div className="absolute inset-6 rounded-full border border-blite-violet/30 border-dashed animate-[spin_25s_linear_infinite_reverse]" />
          <div className="absolute inset-14 rounded-full border-2 border-blite-pink/40" />
          <div className="absolute inset-20 rounded-full bg-gradient-to-tr from-blite-purple/20 via-blite-pink/10 to-transparent backdrop-blur-sm" />
          {/* Central Monolith Pillar */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-1.5 h-28 bg-gradient-to-b from-blite-pink via-blite-violet to-transparent rounded-full shadow-[0_0_24px_rgba(236,19,128,0.8)]" />
            <div className="w-12 h-1.5 bg-white/70 rounded-full mt-2" />
            <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-blite-silver mt-3">
              LOAD INTEGRITY
            </div>
          </div>
        </div>
      )}

      {motif.type === 'cardio' && (
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Dynamic pulse waves */}
          <div className="absolute inset-0 rounded-full border-2 border-blite-magenta/30 animate-ping [animation-duration:3s]" />
          <div className="absolute inset-8 rounded-full border border-blite-pink/40 animate-[spin_15s_linear_infinite]" />
          <div className="absolute inset-16 rounded-full border border-white/20 border-dotted" />
          {/* Radiant energy vortex */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-blite-magenta via-blite-purple to-transparent opacity-80 blur-[2px] flex items-center justify-center shadow-[0_0_40px_rgba(255,42,141,0.6)]">
            <div className="w-10 h-10 rounded-full bg-white/90 shadow-lg" />
          </div>
        </div>
      )}

      {motif.type === 'functional' && (
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* 3D Multi-axial isometric cube wireframe */}
          <svg className="w-full h-full text-blite-violet/50" viewBox="0 0 200 200" fill="none">
            <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" />
            <line x1="100" y1="20" x2="100" y2="100" stroke="currentColor" strokeWidth="1.5" />
            <line x1="170" y1="60" x2="100" y2="100" stroke="#ec1380" strokeWidth="1.5" />
            <line x1="30" y1="60" x2="100" y2="100" stroke="#9d4edd" strokeWidth="1.5" />
            <line x1="100" y1="100" x2="100" y2="180" stroke="#ec1380" strokeWidth="2" />
            <circle cx="100" cy="100" r="4" fill="#ff2a8d" />
            <circle cx="100" cy="20" r="3" fill="#ffffff" />
            <circle cx="170" cy="60" r="3" fill="#ffffff" />
            <circle cx="30" cy="60" r="3" fill="#ffffff" />
          </svg>
        </div>
      )}

      {motif.type === 'mobility' && (
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Smooth breathing organic flow loops */}
          <div className="absolute inset-4 rounded-[40%] border border-purple-400/30 animate-[spin_20s_ease-in-out_infinite]" />
          <div className="absolute inset-10 rounded-[45%] border border-blite-pink/30 animate-[spin_28s_ease-in-out_infinite_reverse]" />
          <div className="absolute inset-16 rounded-full bg-gradient-to-tr from-purple-900/30 to-blite-violet/10 backdrop-blur-md" />
          {/* Floating serene drop */}
          <div className="relative z-10 w-6 h-16 rounded-full bg-gradient-to-b from-purple-200 via-blite-violet to-transparent shadow-[0_0_30px_rgba(192,132,252,0.7)]" />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PROGRAMS COMPONENT
───────────────────────────────────────────── */
export default function ProgramsSection() {
  const containerRef = useRef<HTMLDivElement>(null!);
  const stickyRef    = useRef<HTMLDivElement>(null!);

  // Intro manifesto elements
  const introBadgeRef    = useRef<HTMLDivElement>(null!);
  const introHeadlineRef = useRef<HTMLDivElement>(null!);
  const introSupportRef  = useRef<HTMLDivElement>(null!);
  const introContainerRef= useRef<HTMLDivElement>(null!);

  // Program chapter container refs
  const prog0Ref = useRef<HTMLDivElement>(null!);
  const prog1Ref = useRef<HTMLDivElement>(null!);
  const prog2Ref = useRef<HTMLDivElement>(null!);
  const prog3Ref = useRef<HTMLDivElement>(null!);
  const programRefs = [prog0Ref, prog1Ref, prog2Ref, prog3Ref];

  // Visual background element for morphing gradients
  const bgGlowRef = useRef<HTMLDivElement>(null!);

  // Outro transition cue
  const outroRef = useRef<HTMLDivElement>(null!);

  // Active program index for live UI states
  const [activeProgIdx, setActiveProgIdx] = useState(0);

  // Mouse parallax state
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const mouseAnimFrame = useRef<number>();

  useEffect(() => {
    // Mouse movement listener for micro-parallax
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mousePos.current.targetX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      mousePos.current.targetY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth lerp loop for cursor parallax
    const updateMouse = () => {
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;
      mouseAnimFrame.current = requestAnimationFrame(updateMouse);
    };
    mouseAnimFrame.current = requestAnimationFrame(updateMouse);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseAnimFrame.current) cancelAnimationFrame(mouseAnimFrame.current);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── MASTER SCRUBBED TIMELINE (pinned 420% virtual scroll) ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=420%',
          scrub: 1.1,
          pin: stickyRef.current,
          anticipatePin: 1,
        },
      });

      /* ── PHASE 1: MANIFESTO ENTRANCE (0% → 22%) ── */
      // Badge reveal
      tl.fromTo(
        introBadgeRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
        0,
      );

      // "FIND YOUR POWER." mammoth headline reveal
      tl.fromTo(
        introHeadlineRef.current,
        { opacity: 0, y: 60, scale: 1.08, filter: 'blur(16px)' },
        { opacity: 1, y: 0, scale: 1.0, filter: 'blur(0px)', duration: 0.2, ease: 'power3.out' },
        0.04,
      );

      // Supporting copy reveal
      tl.fromTo(
        introSupportRef.current,
        { opacity: 0, y: 24, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.14, ease: 'power2.out' },
        0.12,
      );

      /* ── PHASE 2: MANIFESTO RETREATS (22% → 32%) ── */
      tl.to(
        introContainerRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.94,
          filter: 'blur(12px)',
          duration: 0.12,
          ease: 'power2.in',
        },
        0.22,
      );

      /* ── PHASE 3: FOUR PROGRAM CHAPTERS (32% → 92%) ── */
      // 4 programs spaced across the scroll track
      const chapterTimes = [
        { in: 0.32, stay: 0.44, out: 0.48 },
        { in: 0.48, stay: 0.60, out: 0.64 },
        { in: 0.64, stay: 0.76, out: 0.80 },
        { in: 0.80, stay: 0.90, out: 0.93 },
      ];

      PROGRAMS.forEach((prog, i) => {
        const targetRef = programRefs[i].current;
        const timing = chapterTimes[i];

        // Entrance
        tl.fromTo(
          targetRef,
          {
            opacity: 0,
            x: 80,
            scale: 0.96,
            filter: 'blur(14px)',
          },
          {
            opacity: 1,
            x: 0,
            scale: 1.0,
            filter: 'blur(0px)',
            duration: 0.12,
            ease: 'power3.out',
            onStart: () => setActiveProgIdx(i),
            onReverseComplete: () => {
              if (i > 0) setActiveProgIdx(i - 1);
            },
          },
          timing.in,
        );

        // Ambient background color shift
        tl.to(
          bgGlowRef.current,
          {
            background: prog.ambientGradient,
            duration: 0.12,
            ease: 'none',
          },
          timing.in,
        );

        // Exit (all except the last program, which flows into outro)
        if (i < PROGRAMS.length - 1) {
          tl.to(
            targetRef,
            {
              opacity: 0,
              x: -80,
              scale: 1.03,
              filter: 'blur(14px)',
              duration: 0.08,
              ease: 'power2.in',
            },
            timing.out,
          );
        }
      });

      /* ── PHASE 4: OUTRO PORTAL (92% → 100%) ── */
      // Program 4 dissolves toward the center
      tl.to(
        programRefs[3].current,
        {
          opacity: 0,
          scale: 1.05,
          filter: 'blur(16px)',
          duration: 0.08,
          ease: 'power2.in',
        },
        0.92,
      );

      // Deep portal cue appears with glowing light horizon
      tl.fromTo(
        outroRef.current,
        { opacity: 0, scale: 0.92, y: 30 },
        { opacity: 1, scale: 1.0, y: 0, duration: 0.08, ease: 'power2.out' },
        0.93,
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="programs"
      className="relative w-full"
      style={{ height: '520vh' }}
    >
      {/* ── STICKY FULL-VIEWPORT STAGE ── */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-blite-black"
      >
        {/* ── DYNAMIC AMBIENT BACKDROP ── */}
        <div
          ref={bgGlowRef}
          className="absolute inset-0 pointer-events-none z-0 transition-colors duration-700"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(139, 47, 201, 0.18) 0%, rgba(7, 3, 14, 0.98) 70%)',
          }}
        />

        {/* ── CINEMATIC ARCHITECTURAL GRID ── */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(236,19,128,0.7) 1px, transparent 1px),
              linear-gradient(90deg, rgba(236,19,128,0.7) 1px, transparent 1px)
            `,
            backgroundSize: '96px 96px',
          }}
        />

        {/* ── FIXED TOP SECTION BADGE ── */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div
            ref={introBadgeRef}
            className="inline-flex items-center gap-2 px-4 py-1.5 glass-pill border border-blite-violet/30 backdrop-blur-md opacity-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blite-pink animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-blite-pink">
              02 // FIND YOUR POWER
            </span>
          </div>
        </div>

        {/* ── INTRO CAMPAIGN MANIFESTO (PHASE 1) ── */}
        <div
          ref={introContainerRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center pointer-events-none select-none"
        >
          <div ref={introHeadlineRef} className="opacity-0 max-w-5xl">
            <h2
              className="font-black uppercase leading-[0.88] tracking-tighter text-white"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 8.5rem)' }}
            >
              FIND YOUR<br />
              <span className="text-gradient-pink">POWER</span>.
            </h2>
          </div>
          <div ref={introSupportRef} className="opacity-0 mt-8 max-w-xl">
            <p className="text-blite-silver font-light text-lg sm:text-2xl leading-relaxed tracking-wide">
              Every body is different.<br />
              <span className="text-blite-steel font-normal">
                Every goal deserves its own way forward.
              </span>
            </p>
          </div>
        </div>

        {/* ── PHASE 3: FOUR PROGRAM CHAPTERS ── */}
        {PROGRAMS.map((prog, idx) => {
          return (
            <div
              key={prog.id}
              ref={programRefs[idx]}
              className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-16 lg:px-24 pointer-events-none opacity-0"
            >
              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* LEFT COLUMN: Large Editorial Typography & Storytelling */}
                <div className="lg:col-span-7 flex flex-col items-start justify-center select-none">
                  {/* Chapter Index with live hover glow */}
                  <div className="flex items-center gap-3 mb-4 pointer-events-auto">
                    <span
                      className="text-xs font-mono tracking-[0.35em] uppercase font-bold transition-all duration-300 hover:scale-110"
                      style={{ color: prog.accentColor }}
                    >
                      CHAPTER {prog.num}
                    </span>
                    <div className="w-10 h-[1px] bg-white/20" />
                    <span className="text-[10px] font-mono tracking-widest text-blite-steel/70 uppercase">
                      {prog.focus}
                    </span>
                  </div>

                  {/* Program Title */}
                  <h3
                    className="font-black uppercase tracking-tighter leading-[0.84] text-white"
                    style={{ fontSize: 'clamp(3.8rem, 9.5vw, 8.5rem)' }}
                  >
                    {prog.title}
                  </h3>

                  {/* Dual-line Manifesto Quote */}
                  <div className="mt-5 space-y-1">
                    <p
                      className="font-medium tracking-tight text-white/90"
                      style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)' }}
                    >
                      {prog.tagline}
                    </p>
                    <p
                      className="font-light tracking-tight"
                      style={{
                        fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)',
                        color: prog.accentColor,
                      }}
                    >
                      {prog.subline}
                    </p>
                  </div>

                  {/* Biomechanical Telemetry Metrics */}
                  <div className="mt-8 pt-6 border-t border-white/10 w-full max-w-lg grid grid-cols-3 gap-4">
                    {prog.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="flex flex-col">
                        <span className="text-[9px] font-mono tracking-widest text-blite-steel/70 uppercase">
                          {m.label}
                        </span>
                        <span className="text-sm sm:text-base font-semibold text-white tracking-wide mt-1">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action CTA Button */}
                  <div className="mt-8 pointer-events-auto">
                    <button
                      type="button"
                      className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-full overflow-hidden text-xs font-mono uppercase tracking-[0.25em] font-semibold text-white transition-all duration-300 active:scale-95"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${prog.accentColor}55`,
                      }}
                    >
                      <span className="relative z-10">EXPLORE {prog.title}</span>
                      <span
                        className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: prog.accentColor }}
                      >
                        →
                      </span>
                      {/* Glow hover accent */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at center, ${prog.accentColor}33 0%, transparent 80%)`,
                        }}
                      />
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: Procedural Visual Artwork Motif */}
                <div className="lg:col-span-5 h-[340px] sm:h-[420px] relative flex items-center justify-center">
                  <ProgramVisualArtwork
                    motif={prog.motif}
                    active={activeProgIdx === idx}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* ── PHASE 4: CINEMATIC OUTRO PORTAL (DEEP HORIZON) ── */}
        <div
          ref={outroRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 pointer-events-none select-none text-center opacity-0"
        >
          {/* Radiant horizon portal line */}
          <div className="w-48 sm:w-80 h-[2px] bg-gradient-to-r from-transparent via-blite-pink to-transparent mb-8 shadow-[0_0_30px_#ec1380]" />

          <div className="text-[11px] font-mono tracking-[0.35em] uppercase text-blite-pink mb-3">
            03 // TRANSFORMATION TIMELINE
          </div>

          <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mb-4">
            DAY 01 → DAY 90
          </h3>

          <p className="text-blite-steel font-light max-w-md text-sm sm:text-base leading-relaxed mb-6">
            Watch her posture, confidence, and biomechanical power evolve in real time as consistency creates strength.
          </p>

          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-blite-silver/60 uppercase">
              SCROLL TO ENTER
            </span>
            <span className="text-blite-pink text-lg animate-bounce">↓</span>
          </div>
        </div>

        {/* ── LEFT SIDEBAR CHAPTER NAVIGATOR ── */}
        <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-4 pointer-events-none select-none">
          <span className="text-[9px] font-mono tracking-widest uppercase text-blite-steel/50 rotate-180 [writing-mode:vertical-rl] mb-2">
            PROGRAMS
          </span>
          {PROGRAMS.map((p, i) => (
            <div key={p.id} className="flex items-center gap-2">
              <div
                className="w-[2px] rounded-full transition-all duration-500"
                style={{
                  height: activeProgIdx === i ? '32px' : '10px',
                  background:
                    activeProgIdx === i
                      ? `linear-gradient(to bottom, ${p.accentColor}, #9d4edd)`
                      : 'rgba(156,143,168,0.25)',
                }}
              />
            </div>
          ))}
          <span
            className="text-[9px] font-mono tracking-widest uppercase font-semibold mt-1 transition-colors duration-300"
            style={{ color: PROGRAMS[activeProgIdx].accentColor }}
          >
            {PROGRAMS[activeProgIdx].num}
          </span>
        </div>

        {/* ── BOTTOM TELEMETRY HUD ── */}
        <div className="absolute bottom-8 left-0 right-0 z-30 px-6 sm:px-10 flex items-end justify-between pointer-events-none select-none">
          {/* Left Telemetry readout */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-blite-steel transition-all duration-300">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: PROGRAMS[activeProgIdx].accentColor }}
            />
            <span>{PROGRAMS[activeProgIdx].telemetry}</span>
          </div>

          {/* Right Section Index */}
          <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-blite-silver/50 ml-auto">
            <span>SECTION</span>
            <span className="text-blite-pink font-semibold">03 / 05</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useRef, useLayoutEffect } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Lazy load 3D canvas with SSR disabled to prevent hydration/WebGL mismatch
const HeroCanvas = dynamic(() => import('../three/HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border border-forge-border border-t-white animate-spin" />
    </div>
  ),
});

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryCopyRef = useRef<HTMLDivElement>(null);
  const secondaryCopyRef = useRef<HTMLDivElement>(null);
  const transitionCopyRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  // Mutable ref to pass scroll progress (0..1) directly to R3F without triggering React re-renders
  const scrollProgress = useRef<number>(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Master scrubbed timeline pinned for 220vh
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: prefersReducedMotion ? false : 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            scrollProgress.current = self.progress;
            if (progressLineRef.current) {
              progressLineRef.current.style.transform = `scaleY(${self.progress})`;
            }
          },
        },
      });

      // 1. PRIMARY HEADLINE FADES OUT & RETREATS IN DEPTH (0% -> 40%)
      tl.to(
        primaryCopyRef.current,
        {
          scale: 0.85,
          y: -80,
          opacity: 0,
          filter: 'blur(10px)',
          ease: 'power2.inOut',
          duration: 1.2,
        },
        0
      );

      // 2. BACKGROUND GLOW SHIFT (0% -> 100%)
      tl.to(
        bgGlowRef.current,
        {
          opacity: 0.35,
          scale: 1.3,
          ease: 'none',
          duration: 3.0,
        },
        0
      );

      // 3. SECONDARY TECHNICAL SPECIFICATIONS ENTER (35% -> 75%)
      tl.fromTo(
        secondaryCopyRef.current,
        {
          opacity: 0,
          scale: 1.15,
          y: 60,
          filter: 'blur(8px)',
        },
        {
          opacity: 1,
          scale: 1.0,
          y: 0,
          filter: 'blur(0px)',
          ease: 'power2.out',
          duration: 1.0,
        },
        0.9
      );

      tl.to(
        secondaryCopyRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: -50,
          filter: 'blur(6px)',
          ease: 'power2.in',
          duration: 0.9,
        },
        2.0
      );

      // 4. TRANSITION CUE TO SECTION 02: STRENGTH (75% -> 100%)
      tl.fromTo(
        transitionCopyRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          ease: 'power2.out',
          duration: 0.8,
        },
        2.3
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full h-screen overflow-hidden bg-blite-black text-blite-platinum"
    >
      {/* Background Dynamic Ambient Radial Violet & Magenta Glow */}
      <div
        ref={bgGlowRef}
        className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-1000 bg-[radial-gradient(ellipse_at_65%_48%,rgba(236,19,128,0.25)_0%,rgba(139,47,201,0.22)_40%,rgba(11,5,22,0.8)_70%,transparent_90%)]"
      />

      {/* Quiet depth, no technical grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(180deg,transparent_0%,rgba(11,5,22,0.35)_100%)]" />

      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-10">
        <HeroCanvas scrollProgress={scrollProgress} />
      </div>

      {/* LAYER 1: PRIMARY HEADLINE & INTRO COPY (0% - 40% scroll) */}
      <div
        ref={primaryCopyRef}
        className="absolute inset-0 z-20 flex flex-col justify-center pointer-events-none select-none max-w-7xl mx-auto px-6 sm:px-10 pt-24"
      >
        <div className="max-w-xl">
          <p className="mb-5 text-[11px] tracking-[0.28em] uppercase text-blite-steel">
            Women&apos;s gym · Royapettah
          </p>

          <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black tracking-tighter uppercase leading-[0.85] text-white">
            BLITE<span className="text-blite-pink">.</span>
          </h1>

          <p className="mt-4 text-2xl sm:text-3xl font-medium tracking-tight text-white">
            A gym that feels like yours.
          </p>

          <p className="mt-5 text-base sm:text-lg font-light text-blite-silver/90 max-w-md leading-relaxed">
            Walk in as you are. Train without the stare. Leave a little stronger than yesterday.
          </p>
        </div>
      </div>

      {/* LAYER 2: TECHNICAL SPECIFICATIONS & CALIBRATION HUD (35% - 75% scroll) */}
      <div
        ref={secondaryCopyRef}
        className="absolute inset-0 z-20 flex flex-col justify-center items-start md:items-end pointer-events-none select-none max-w-7xl mx-auto px-6 sm:px-10 opacity-0"
      >
        <div className="max-w-md md:text-right">
          <p className="mb-4 text-[11px] tracking-[0.28em] uppercase text-blite-pink/80">
            What it feels like
          </p>

          <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-[1.1]">
            No proving.
            <br />
            Just training.
          </h3>

          <p className="mt-5 text-sm sm:text-base font-light text-blite-silver/80 leading-relaxed">
            Coaches who actually coach. Rooms that don&apos;t intimidate. Strength that shows up when you lift a bag, take the stairs, or take up space.
          </p>

          <div className="mt-8 flex flex-col md:items-end gap-3 pt-6 border-t border-white/10 text-sm text-blite-steel">
            <span>Women only</span>
            <span>Small rooms</span>
            <span>Progress you can feel</span>
          </div>
        </div>
      </div>

      {/* LAYER 3: CHAPTER 01 TRANSITION PROMPT (75% - 100% scroll) */}
      <div
        ref={transitionCopyRef}
        className="absolute bottom-16 left-0 right-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none text-center opacity-0 px-6"
      >
        <div className="text-[11px] tracking-[0.22em] uppercase text-blite-steel mb-2">
          Keep going
        </div>
        <div className="text-xl sm:text-2xl font-medium tracking-tight text-white">
          How we train
        </div>
        <div className="w-[1px] h-8 bg-gradient-to-b from-blite-pink/70 to-transparent mt-3" />
      </div>

      {/* HUD Telemetry Elements (Fixed to viewports) */}
      <div ref={hudRef} className="absolute inset-0 z-20 pointer-events-none select-none">
        {/* Left Side Scroll Scrub Progress Bar */}
        <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
          <span className="text-[9px] tracking-widest uppercase text-blite-steel/50 rotate-180 [writing-mode:vertical-rl]">
            Scroll
          </span>
          <div className="w-[1.5px] h-28 bg-white/10 rounded-full overflow-hidden relative">
            <div
              ref={progressLineRef}
              className="w-full h-full bg-gradient-to-b from-blite-pink to-blite-purple origin-top transform scale-y-0 transition-transform duration-75"
            />
          </div>
          <span className="text-[9px] font-mono tracking-widest uppercase text-blite-pink font-semibold">00</span>
        </div>

        {/* Bottom Left Telemetry */}
        <div className="absolute bottom-8 left-6 sm:left-10 hidden sm:flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-blite-steel">
          <span className="w-1.5 h-1.5 rounded-full bg-blite-pink animate-pulse" />
          <span>Blite · women&apos;s fitness</span>
        </div>

        {/* Bottom Right Scroll Down Prompt */}
        <div className="absolute bottom-8 right-6 sm:right-10 flex items-center gap-3 text-[10px] font-mono tracking-widest uppercase text-blite-silver/60">
          <span>Scroll</span>
          <span className="text-blite-pink animate-bounce">↓</span>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TransformationTimeline from './TransformationTimeline';
import TransformationMetrics from './TransformationMetrics';
import TransformationSequence from './TransformationSequence';
import {
  getCurrentDayNumber,
  getActiveMilestoneData,
} from '../../lib/animations/transformationTimeline';

gsap.registerPlugin(ScrollTrigger);

export default function TransformationSection() {
  const containerRef = useRef<HTMLDivElement>(null!);
  const stickyRef    = useRef<HTMLDivElement>(null!);

  // Mutable refs for smooth 60-120Hz canvas rendering without React re-renders
  const scrollProgress = useRef(0);

  // Low-frequency UI state for HUD & Typography
  const [uiProgress, setUiProgress] = useState(0);

  // GSAP ScrollTrigger timeline setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=600%',
        scrub: 1.1,
        pin: stickyRef.current,
        anticipatePin: 1,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
          setUiProgress(self.progress);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle clicking milestone nodes to smoothly jump to that day's state
  const handleSelectMilestone = (targetProgress: number) => {
    if (typeof window === 'undefined') return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number) => void } }).__lenis;
    const st = ScrollTrigger.getAll().find(s => s.trigger === containerRef.current);

    if (st) {
      const targetScroll = st.start + (st.end - st.start) * targetProgress;
      if (lenis) {
        lenis.scrollTo(targetScroll);
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  };

  const dayNumber = getCurrentDayNumber(uiProgress);
  const milestone = getActiveMilestoneData(uiProgress);
  const isOutro = uiProgress > 0.93;

  return (
    <div
      ref={containerRef}
      id="transformation"
      className="relative w-full"
      style={{ height: '700vh' }}
    >
      {/* ── PINNED 100VH VIEWPORT ── */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden bg-blite-black"
      >
        {/* ── AMBIENT STUDIO GLOW BACKDROP ── */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 55%, rgba(139, 47, 201, 0.18) 0%, rgba(7, 3, 14, 0.98) 75%)',
          }}
        />

        {/* ── SCROLL-DRIVEN IMAGE SEQUENCE (CENTERPIECE) ── */}
        <TransformationSequence scrollProgress={scrollProgress} />

        {/* ── TOP SECTION HEADER ── */}
        <div className="absolute top-6 sm:top-8 left-0 right-0 z-20 flex flex-col items-center px-6 text-center pointer-events-none select-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-[10px] font-mono tracking-[0.3em] uppercase text-blite-pink mb-2 border border-blite-pink/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blite-pink animate-pulse" />
            90-DAY TRANSFORMATION
          </div>
          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">
            THE TRANSFORMATION IS REAL<span className="text-blite-pink">.</span>
          </h2>
          <p className="text-[11px] sm:text-xs font-mono tracking-widest text-blite-steel uppercase mt-1">
            90 DAYS. ONE BODY. A DIFFERENT VERSION OF YOU.
          </p>
        </div>

        {/* ── ACTIVE TRANSFORMATION OVERLAY (DAY 01 -> DAY 90) ── */}
        {!isOutro && (
          <>
            {/* LEFT SIDE: Large Cinematic Day Counter */}
            <div className="absolute left-6 sm:left-14 lg:left-20 top-1/2 -translate-y-1/2 z-20 flex flex-col items-start pointer-events-none select-none">
              <span className="text-xs sm:text-sm font-mono tracking-[0.35em] text-blite-steel uppercase mb-1">
                DAY
              </span>
              <div
                className="font-black tracking-tighter text-white leading-[0.8] tabular-nums"
                style={{ fontSize: 'clamp(4.5rem, 11vw, 9.5rem)' }}
              >
                {String(dayNumber).padStart(2, '0')}
              </div>
              <div className="w-12 h-[2px] bg-gradient-to-r from-blite-pink to-transparent mt-4" />
              <span className="text-xs font-mono tracking-widest text-blite-pink uppercase mt-3">
                {milestone.title}
              </span>
              <p className="mt-2 text-xs text-blite-steel max-w-[200px] leading-relaxed hidden sm:block">
                {milestone.subtitle}
              </p>
            </div>

            {/* RIGHT SIDE: Body / Strength / Consistency Telemetry Card */}
            <div className="hidden sm:block absolute right-6 sm:right-10 lg:right-16 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <TransformationMetrics progress={uiProgress} />
            </div>
          </>
        )}

        {/* ── OUTRO TRANSITION (AFTER DAY 90): COMMUNITY CONNECTION ── */}
        {isOutro && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none select-none transition-all duration-700">
            <div className="w-36 h-[1.5px] bg-gradient-to-r from-transparent via-blite-pink to-transparent mb-6 shadow-[0_0_24px_#ec1380]" />

            <div className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.35em] text-blite-pink uppercase mb-3">
              <span>STRONGER</span>
              <span>·</span>
              <span>MORE CONFIDENT</span>
              <span>·</span>
              <span>MORE YOU</span>
            </div>

            <h3
              className="font-black uppercase tracking-tighter text-white leading-[0.88]"
              style={{ fontSize: 'clamp(2.8rem, 7.5vw, 6.5rem)' }}
            >
              MORE THAN<br />
              <span className="text-gradient-pink">A WORKOUT</span>.
            </h3>

            <p className="mt-5 text-blite-steel font-light text-base sm:text-xl max-w-xl leading-relaxed">
              A sisterhood of women training, transforming, and showing up for themselves every single day.
            </p>

            <div className="mt-8 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-blite-pink">
                SCROLL TO DISCOVER COMMUNITY
              </span>
              <span className="text-blite-pink text-lg animate-bounce">↓</span>
            </div>
          </div>
        )}

        {/* ── 7-MILESTONE HORIZONTAL TIMELINE SCRUBBER (BOTTOM) ── */}
        <div className="absolute bottom-8 left-0 right-0 z-30 pointer-events-auto">
          <TransformationTimeline
            progress={uiProgress}
            onSelectMilestone={handleSelectMilestone}
          />
        </div>
      </div>
    </div>
  );
}

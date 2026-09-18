'use client';

import React from 'react';
import { getCurrentDay, getActiveMilestone } from '../../lib/animations/transformation';

interface TransformationTextProps {
  progress: number;
}

export default function TransformationText({ progress }: TransformationTextProps) {
  const dayNumber = getCurrentDay(progress);
  const milestone = getActiveMilestone(progress);
  const isOutro = progress > 0.93;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none">
      {/* ── TOP EDITORIAL SECTION HEADER ── */}
      <div className="absolute top-6 sm:top-8 left-0 right-0 flex flex-col items-center px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill text-[10px] font-mono tracking-[0.3em] uppercase text-blite-pink mb-2 border border-blite-pink/30">
          <span className="w-1.5 h-1.5 rounded-full bg-blite-pink animate-pulse" />
          90 days
        </div>
        <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-white">
          Consistency shows<span className="text-blite-pink">.</span>
        </h2>
        <p className="text-[11px] sm:text-xs font-mono tracking-widest text-blite-steel uppercase mt-1">
          Day 1 to day 90
        </p>
      </div>

      {/* ── ACTIVE TRANSFORMATION STAGE (0.0 -> 0.93) ── */}
      {!isOutro && (
        <>
          {/* LEFT SIDE: Large Cinematic Day Counter */}
          <div className="absolute left-6 sm:left-14 lg:left-20 top-1/2 -translate-y-1/2 flex flex-col items-start">
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
          </div>

          {/* RIGHT SIDE: Narrative Milestone Statement */}
          <div className="hidden lg:flex absolute right-14 xl:right-20 top-1/2 -translate-y-1/2 flex-col items-end text-right max-w-sm">
            <span className="text-[10px] font-mono tracking-[0.3em] text-blite-steel/70 uppercase mb-2">
              Progress
            </span>
            <h3 className="text-3xl xl:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              {milestone.day === '01' && 'ONE DECISION.\nONE START.'}
              {milestone.day === '15' && 'SHOWING UP.\nFINDING RHYTHM.'}
              {milestone.day === '30' && 'SMALL CHOICES.\nBUILDING HABITS.'}
              {milestone.day === '45' && 'FEELING STRONGER.\nVISIBLE CHANGE.'}
              {milestone.day === '60' && 'SEEING CHANGE.\nCORE STABILITY.'}
              {milestone.day === '75' && 'BECOMING STRONGER.\nATHLETIC FORM.'}
              {milestone.day === '90' && 'TRANSFORMED.\nPOWER UNLOCKED.'}
            </h3>
            <p className="mt-4 text-xs font-mono tracking-widest text-blite-silver/80 uppercase leading-relaxed">
              Show up. Repeat.
            </p>
          </div>
        </>
      )}

      {/* ── OUTRO STAGE (0.93 -> 1.00): COMMUNITY CONNECTION ── */}
      {isOutro && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 transition-all duration-700">
          <div className="w-36 h-[1.5px] bg-gradient-to-r from-transparent via-blite-pink to-transparent mb-6 shadow-[0_0_24px_#ec1380]" />

          <div className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-[0.35em] text-blite-pink uppercase mb-3">
            <span>Stronger</span>
            <span>·</span>
            <span>Clearer</span>
          </div>

          <h3
            className="font-black uppercase tracking-tighter text-white leading-[0.88]"
            style={{ fontSize: 'clamp(2.8rem, 7.5vw, 6.5rem)' }}
          >
            THEN<br />
            <span className="text-gradient-pink">JOIN.</span>
          </h3>

          <p className="mt-5 text-blite-steel font-light text-base sm:text-xl max-w-xl leading-relaxed">
            Membership, personal training, or Zumba.
          </p>

          <div className="mt-8 flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-blite-pink">
              Scroll
            </span>
            <span className="text-blite-pink text-lg animate-bounce">↓</span>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { getActiveMilestoneData } from '../../lib/animations/transformationTimeline';

interface TransformationMetricsProps {
  progress: number;
}

export default function TransformationMetrics({ progress }: TransformationMetricsProps) {
  const milestone = getActiveMilestoneData(progress);

  return (
    <div className="flex flex-col gap-3.5 p-5 rounded-2xl glass-panel border border-white/10 backdrop-blur-md max-w-[260px] sm:max-w-[280px] select-none shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
      {/* Milestone Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blite-pink animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-blite-pink font-semibold">
            DAY {milestone.day} METRICS
          </span>
        </div>
        <span className="text-[9px] font-mono tracking-widest text-blite-steel/70 uppercase">
          {milestone.title}
        </span>
      </div>

      {/* Metric 1: BODY */}
      <div className="flex flex-col">
        <span className="text-[9px] font-mono tracking-widest text-blite-steel/70 uppercase">
          BODY
        </span>
        <span className="text-sm font-semibold text-white tracking-wide mt-0.5 transition-all duration-300">
          {milestone.body}
        </span>
      </div>

      {/* Metric 2: STRENGTH */}
      <div className="flex flex-col">
        <span className="text-[9px] font-mono tracking-widest text-blite-steel/70 uppercase">
          STRENGTH
        </span>
        <span className="text-sm font-semibold text-blite-silver tracking-wide mt-0.5 transition-all duration-300">
          {milestone.strength}
        </span>
      </div>

      {/* Metric 3: CONSISTENCY */}
      <div className="flex flex-col">
        <span className="text-[9px] font-mono tracking-widest text-blite-steel/70 uppercase">
          CONSISTENCY
        </span>
        <span className="text-sm font-semibold text-blite-violet tracking-wide mt-0.5 transition-all duration-300">
          {milestone.consistency}
        </span>
      </div>
    </div>
  );
}

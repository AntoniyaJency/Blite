'use client';

import React from 'react';
import { MILESTONES } from '../../lib/animations/transformationTimeline';

interface TransformationTimelineProps {
  progress: number;
  onSelectMilestone?: (targetProgress: number) => void;
}

export default function TransformationTimeline({
  progress,
  onSelectMilestone,
}: TransformationTimelineProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 select-none pointer-events-auto">
      {/* Horizontal Scrubber Track */}
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 rounded-full" />

        {/* Dynamic active progress fill bar */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-blite-pink via-blite-violet to-blite-magenta rounded-full transition-all duration-75 shadow-[0_0_12px_#ec1380]"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />

        {/* 7 Interactive Milestone Nodes */}
        {MILESTONES.map((m) => {
          const isReached = progress >= m.progress - 0.04;
          const isActive = Math.abs(progress - m.progress) < 0.08;

          return (
            <button
              key={m.day}
              type="button"
              onClick={() => onSelectMilestone && onSelectMilestone(m.progress)}
              className="group relative z-10 flex flex-col items-center focus:outline-none"
            >
              {/* Node Indicator Dot */}
              <div
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? 'scale-125 border-blite-pink bg-white shadow-[0_0_16px_#ec1380]'
                    : isReached
                    ? 'border-blite-pink bg-blite-pink/80 scale-100'
                    : 'border-white/20 bg-blite-black scale-90 group-hover:border-white/50'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blite-black animate-pulse" />
                )}
              </div>

              {/* Day Label Number */}
              <span
                className={`text-[10px] sm:text-xs font-mono tracking-widest mt-2 transition-colors duration-200 ${
                  isActive
                    ? 'text-white font-bold'
                    : isReached
                    ? 'text-blite-pink/90 font-medium'
                    : 'text-blite-steel/50 group-hover:text-blite-steel'
                }`}
              >
                DAY {m.day}
              </span>

              {/* Milestone Title */}
              <span
                className={`hidden md:block text-[8px] font-mono tracking-wider uppercase mt-0.5 transition-opacity duration-200 ${
                  isActive ? 'opacity-100 text-blite-silver' : 'opacity-0 group-hover:opacity-60'
                }`}
              >
                {m.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

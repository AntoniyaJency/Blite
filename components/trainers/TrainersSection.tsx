'use client';

import React from 'react';

const TRAINERS = [
  {
    id: 'lalitha',
    name: 'Mrs Lalitha',
    role: 'Manager and trainer',
    initial: 'L',
    featured: true,
  },
  {
    id: 'jamalia',
    name: 'Mrs Jamalia',
    role: 'Trainer',
    initial: 'J',
    featured: false,
  },
  {
    id: 'aafia',
    name: 'Ms Aafia',
    role: 'Trainer',
    initial: 'A',
    featured: false,
  },
  {
    id: 'fouzia',
    name: 'Ms Fouzia',
    role: 'Trainer',
    initial: 'F',
    featured: false,
  },
  {
    id: 'nazira',
    name: 'Mrs Nazira',
    role: 'Trainer',
    initial: 'N',
    featured: false,
  },
] as const;

function PortraitPlaceholder({
  initial,
  featured = false,
}: {
  initial: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-blite-surface aspect-[4/5] ${
        featured ? 'lg:aspect-[4/5]' : ''
      }`}
      style={{
        clipPath: featured
          ? 'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)'
          : 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,19,128,0.28),transparent_52%),radial-gradient(circle_at_80%_90%,rgba(139,47,201,0.35),transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-black tracking-tighter text-white/25 leading-none ${
            featured ? 'text-[7rem] sm:text-[9rem]' : 'text-6xl sm:text-7xl'
          }`}
        >
          {initial}
        </span>
        <span className="mt-3 text-[10px] tracking-[0.28em] uppercase text-blite-steel">Photo soon</span>
      </div>
    </div>
  );
}

export default function TrainersSection() {
  const lead = TRAINERS[0];
  const rest = TRAINERS.slice(1);

  return (
    <section id="trainers" className="relative py-24 sm:py-32 px-6 sm:px-10 bg-blite-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[520px] bg-blite-pink/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[420px] bg-blite-purple/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12 lg:mb-16">
          <p className="text-[10px] tracking-[0.28em] uppercase text-blite-pink mb-4">The team</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
            The women you&apos;ll train with.
          </h2>
          <p className="mt-5 text-base sm:text-lg font-light text-blite-silver/85 leading-relaxed">
            Same faces every week. They know the room, they know the work, and they will know you.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
          <article className="col-span-2">
            <PortraitPlaceholder initial={lead.initial} featured />
            <p className="mt-3 text-[10px] font-mono tracking-[0.22em] uppercase text-blite-pink">01</p>
            <h3 className="mt-1 text-2xl sm:text-3xl font-semibold text-white">{lead.name}</h3>
            <p className="text-sm text-blite-steel mt-1">{lead.role}</p>
          </article>

          {rest.map((trainer, index) => (
            <article key={trainer.id} className="col-span-1">
              <PortraitPlaceholder initial={trainer.initial} />
              <p className="mt-3 text-[10px] font-mono tracking-[0.22em] uppercase text-blite-steel">
                {String(index + 2).padStart(2, '0')}
              </p>
              <h3 className="mt-1 text-base sm:text-lg font-medium text-white">{trainer.name}</h3>
              <p className="text-sm text-blite-steel">{trainer.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

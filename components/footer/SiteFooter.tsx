'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { id: 'strength', label: 'How we train' },
  { id: 'programs', label: 'Your pace' },
  { id: 'transformation', label: '90 days' },
  { id: 'trainers', label: 'The team' },
  { id: 'membership', label: 'Plans' },
  { id: 'contact', label: 'Come by' },
] as const;

type LenisWindow = Window & {
  __lenis?: { scrollTo: (el: Element, opts?: object) => void };
};

export default function SiteFooter() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';

  const goTo = (id: string) => {
    if (!isHome) {
      router.push(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    const lenis = (window as LenisWindow).__lenis;
    if (element && lenis) {
      lenis.scrollTo(element, { offset: 0, duration: 1.2 });
      return;
    }
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-blite-black border-t border-white/10 overflow-hidden">
      <span
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blite-pink to-transparent"
      />
      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 right-0 text-[22vw] leading-none font-black tracking-tighter text-white/[0.03] select-none"
      >
        BLITE
      </p>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-5">
            <a
              href="/#hero"
              onClick={(e) => {
                e.preventDefault();
                goTo('hero');
              }}
              className="inline-flex items-center gap-3"
            >
              <img src="/images/blite-logo.png" alt="Blite" className="h-8 w-auto object-contain" />
              <span className="text-[11px] tracking-[0.22em] uppercase text-blite-steel">
                Women&apos;s fitness
              </span>
            </a>
            <p className="mt-5 text-lg sm:text-xl font-medium tracking-tight text-white max-w-sm leading-snug">
              A gym that feels like yours.
            </p>
            <p className="mt-3 text-sm text-blite-steel max-w-sm leading-relaxed">
              Second floor, Besant Road, Royapettah. Walk in as you are.
            </p>
          </div>

          <nav className="lg:col-span-3" aria-label="Footer">
            <p className="text-[10px] tracking-[0.28em] uppercase text-blite-pink mb-4">Explore</p>
            <ul className="space-y-2.5">
              {LINKS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`/#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(item.id);
                    }}
                    className="text-sm text-blite-silver/80 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="text-[10px] tracking-[0.28em] uppercase text-blite-pink mb-4">Gym</p>
            <p className="text-sm text-blite-silver leading-relaxed">
              BLITE WOMEN&apos;S FITNESS
              <br />
              2nd floor, 110/190, Dr Besant Rd
              <br />
              Royapettah, Chennai 600014
            </p>
            <p className="mt-4 text-sm text-blite-steel">Mon–Sat · 6AM – 9PM</p>
            <a
              href="mailto:hello@blite.com"
              className="mt-2 inline-block text-sm text-white hover:text-blite-pink transition-colors"
            >
              hello@blite.com
            </a>
            <p className="mt-1 text-sm text-blite-silver">+91 98765 43210</p>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-blite-steel">© 2026 Blite Women&apos;s Fitness</p>
          <p className="text-xs tracking-[0.18em] uppercase text-blite-steel/70">Royapettah · Chennai</p>
        </div>
      </div>
    </footer>
  );
}

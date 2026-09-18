'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const LINKS = [
  { id: 'strength', num: '01', label: 'How we train', hint: 'Strength, cardio, mobility' },
  { id: 'programs', num: '02', label: 'Your pace', hint: 'Find a program that fits' },
  { id: 'transformation', num: '03', label: '90 days', hint: 'What showing up looks like' },
  { id: 'trainers', num: '04', label: 'The team', hint: 'The women who coach you' },
  { id: 'membership', num: '05', label: 'Plans', hint: 'Join when you are ready' },
  { id: 'contact', num: '06', label: 'Come by', hint: 'Write or visit the gym' },
] as const;

type LenisWindow = Window & {
  __lenis?: {
    scrollTo: (el: Element, opts?: object) => void;
    stop: () => void;
    start: () => void;
  };
};

function scrollToId(id: string, attempt = 0) {
  const element = document.getElementById(id);
  const lenis = (window as LenisWindow).__lenis;

  if (element && lenis) {
    lenis.scrollTo(element, { offset: 0, duration: 1.2 });
    return;
  }
  if (attempt < 40) {
    window.setTimeout(() => scrollToId(id, attempt + 1), 50);
    return;
  }
  element?.scrollIntoView({ behavior: 'smooth' });
}

export default function HeroNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('hero');
  const isHome = pathname === '/';

  const goToSection = useCallback(
    (id: string) => {
      setOpen(false);
      (window as LenisWindow).__lenis?.start();

      if (!isHome) {
        router.push(`/#${id}`);
        return;
      }

      window.requestAnimationFrame(() => scrollToId(id));
    },
    [isHome, router]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setActiveId('');
      return;
    }

    const ids = ['hero', ...LINKS.map((link) => link.id)];
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-18% 0px -55% 0px', threshold: [0.08, 0.2, 0.4] }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;

    const jumpToHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) scrollToId(hash);
    };

    jumpToHash();
    window.addEventListener('hashchange', jumpToHash);
    const timer = window.setTimeout(jumpToHash, 400);
    return () => {
      window.removeEventListener('hashchange', jumpToHash);
      window.clearTimeout(timer);
    };
  }, [isHome, pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const lenis = (window as LenisWindow).__lenis;
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = '';
      lenis?.start();
    };
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div
        className="pointer-events-auto mx-auto px-3 sm:px-4"
        style={{
          paddingTop: scrolled ? 10 : 16,
          transition: 'padding 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <nav
          aria-label="Blite"
          className="relative flex items-center gap-3 sm:gap-4 px-3 sm:px-4 h-14 sm:h-[58px]"
          style={{
            width: 'min(1180px, 100%)',
            marginInline: 'auto',
            background: scrolled ? 'rgba(11, 5, 22, 0.82)' : 'rgba(11, 5, 22, 0.42)',
            backdropFilter: 'blur(22px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(22px) saturate(1.5)',
            border: '1px solid rgba(255,255,255,0.08)',
            clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))',
            boxShadow: scrolled
              ? '0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(236,19,128,0.12)'
              : '0 6px 24px rgba(0,0,0,0.2)',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-blite-pink to-transparent opacity-80"
          />

          <a
            href="/#hero"
            onClick={(e) => {
              e.preventDefault();
              goToSection('hero');
            }}
            className="flex items-center gap-2.5 shrink-0"
          >
            <img
              src="/images/blite-logo.png"
              alt="Blite"
              className="h-7 sm:h-8 w-auto object-contain"
            />
            <span className="hidden sm:flex flex-col leading-none border-l border-white/15 pl-2.5">
              <span className="text-[11px] font-black tracking-[0.22em] uppercase text-white">Blite</span>
              <span className="text-[9px] tracking-[0.18em] uppercase text-blite-steel mt-0.5">Royapettah</span>
            </span>
          </a>

          <div className="hidden lg:flex flex-1 items-stretch justify-center min-w-0">
            <div className="flex items-stretch">
              {LINKS.map((item, index) => {
                const active = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToSection(item.id)}
                    className="relative px-2.5 xl:px-3 py-1 text-left group"
                    aria-current={active ? 'location' : undefined}
                  >
                    {index > 0 && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-5 bg-white/10" />
                    )}
                    <span
                      className={`block text-[9px] tracking-[0.22em] font-mono ${
                        active ? 'text-blite-pink' : 'text-blite-steel/70 group-hover:text-blite-pink/80'
                      }`}
                    >
                      {item.num}
                    </span>
                    <span
                      className={`block text-[11px] tracking-wide whitespace-nowrap ${
                        active ? 'text-white' : 'text-blite-silver/70 group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`absolute left-3 right-3 bottom-0 h-[2px] origin-left transition-transform duration-300 ${
                        active ? 'scale-x-100 bg-blite-pink' : 'scale-x-0 bg-blite-pink group-hover:scale-x-100'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">
            <SignedOut>
              <button
                type="button"
                onClick={() => goToSection('membership')}
                className="hidden sm:inline-flex items-center px-4 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase text-white"
                style={{
                  background: 'linear-gradient(135deg, #ec1380, #8b2fc9)',
                  clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                }}
              >
                Start here
              </button>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="hidden sm:inline-flex px-3 py-2 text-[10px] tracking-[0.16em] uppercase text-blite-silver/80 hover:text-white"
                >
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{ elements: { avatarBox: 'w-9 h-9' } }}
                afterSignOutUrl="/"
              />
            </SignedIn>

            <button
              type="button"
              className="lg:hidden relative z-[60] w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
              aria-expanded={open}
              aria-controls="blite-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              <span className={`block h-px w-5 bg-white transition-transform duration-300 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
              <span className={`block h-px w-3 bg-blite-pink transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-5 bg-white transition-transform duration-300 ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
            </button>
          </div>
        </nav>
      </div>

      <div
        id="blite-menu"
        hidden={!open}
        className={`lg:hidden fixed left-0 right-0 bottom-0 top-[72px] z-40 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          type="button"
          className="absolute inset-0 bg-[#07030e]/80 backdrop-blur-md"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute top-3 left-3 right-3 sm:left-4 sm:right-auto sm:w-[380px] p-6 sm:p-7`}
          style={{
            background: 'rgba(11, 5, 22, 0.94)',
            border: '1px solid rgba(236,19,128,0.22)',
            clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
          }}
        >
          <p className="text-[10px] tracking-[0.28em] uppercase text-blite-pink mb-5">Gym map</p>
          <ul className="space-y-1">
            {LINKS.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => goToSection(item.id)}
                    className="w-full flex items-start gap-4 py-3 text-left group"
                  >
                    <span className={`font-mono text-[11px] tracking-widest mt-1 ${active ? 'text-blite-pink' : 'text-blite-steel'}`}>
                      {item.num}
                    </span>
                    <span>
                      <span className={`block text-xl font-semibold tracking-tight ${active ? 'text-white' : 'text-blite-silver group-hover:text-white'}`}>
                        {item.label}
                      </span>
                      <span className="block text-sm text-blite-steel mt-0.5">{item.hint}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-3">
            <SignedOut>
              <button
                type="button"
                onClick={() => goToSection('membership')}
                className="w-full py-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-white"
                style={{ background: 'linear-gradient(135deg, #ec1380, #8b2fc9)' }}
              >
                Start here
              </button>
              <SignInButton mode="modal">
                <button type="button" className="w-full py-3 text-[11px] tracking-[0.18em] uppercase text-blite-silver border border-white/15">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>
            <p className="text-[11px] tracking-wide text-blite-steel">Women&apos;s gym · Besant Road, Royapettah</p>
          </div>
        </div>
      </div>
    </header>
  );
}

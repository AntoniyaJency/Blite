'use client';

import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimations() {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 35, opacity: 0, stagger: 0.1, duration: 1.1, ease: 'power3.out', delay: 0.15 });
      gsap.to('.hero-3d', { yPercent: 16, rotate: 5, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.hero-title', { xPercent: -8, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.from(element, { y: 70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%', once: true } });
      });
      gsap.utils.toArray<HTMLElement>('.method-card').forEach((card, index) => {
        gsap.from(card, { y: 100 + index * 20, rotate: index === 1 ? 3 : index === 2 ? -3 : 0, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 83%', once: true } });
      });
      gsap.utils.toArray<HTMLElement>('.class-row').forEach((row, index) => {
        gsap.from(row, { x: index % 2 ? 50 : -50, opacity: 0, duration: 0.8, delay: index * 0.08, scrollTrigger: { trigger: row, start: 'top 90%', once: true } });
      });
      gsap.to('.studio-disc', { rotation: 360, ease: 'none', scrollTrigger: { trigger: '.studio', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    return () => ctx.revert();
  }, []);
  return null;
}

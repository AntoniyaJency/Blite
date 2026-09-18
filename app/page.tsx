'use client';

import React from 'react';
import Hero from '../components/hero/Hero';
import WorkoutSection from '../components/workout/WorkoutSection';
import ProgramsSection from '../components/programs/ProgramsSection';
import TransformationSection from '../components/transformation/TransformationSection';
import TrainersSection from '../components/trainers/TrainersSection';
import PricingSection from '../components/pricing/PricingSection';
import ContactSection from '../components/contact/ContactSection';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-blite-black text-blite-platinum selection:bg-blite-pink/30 selection:text-white">
      {/* SECTION 01: HERO (100vh Pinned Scrubbed) */}
      <Hero />

      {/* SECTION 02: THE BLITE WORKOUT (350% virtual scroll, pinned) */}
      <WorkoutSection />

      {/* SECTION 03: FIND YOUR POWER — WORKOUT PROGRAMS (420% virtual scroll, pinned) */}
      <ProgramsSection />

      {/* SECTION 04: 3D ATHLETE TRANSFORMATION — DAY 01 TO DAY 90 (500% virtual scroll, pinned) */}
      <TransformationSection />

      {/* SECTION 05: TRAINERS */}
      <TrainersSection />

      {/* SECTION 06: MEMBERSHIP PRICING */}
      <PricingSection />

      {/* SECTION 07: CONTACT & LOCATION */}
      <ContactSection />
    </main>
  );
}



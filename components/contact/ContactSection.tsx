'use client';

import React from 'react';
import ContactForm from './ContactForm';

const GYM_ADDRESS =
  "BLITE WOMEN'S FITNESS, 2nd floor, 110/190, Dr Besant Rd, Mirsahibpet, Royapettah, Chennai, Tamil Nadu 600014";

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=BLITE%20WOMEN%27S%20FITNESS%20Royapettah';

export default function ContactSection() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 px-6 sm:px-10 bg-blite-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] max-w-[520px] bg-blite-pink/10 rounded-full blur-[140px]" />
        <div className="absolute top-0 left-0 w-[40vw] h-[40vw] max-w-[420px] bg-blite-purple/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12 lg:mb-16">
          <p className="text-[10px] tracking-[0.28em] uppercase text-blite-pink mb-4">Come by</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.05]">
            Write, or walk in.
          </h2>
          <p className="mt-5 text-base sm:text-lg font-light text-blite-silver/85 leading-relaxed">
            Second floor, Besant Road, Royapettah. Send a message, or come see the gym.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 lg:items-stretch">
          <ContactForm />

          <div
            className="relative h-full min-h-[480px] overflow-hidden border border-white/10"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%)',
            }}
          >
            <iframe
              title={GYM_ADDRESS}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.722112839631!2d80.2711768!3d13.0533448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267bd82451aa9%3A0xde4ab534ce802aab!2sBLITE%20WOMEN%27S%20FITNESS!5e0!3m2!1sen!2sin"
              className="absolute inset-0 h-full w-full"
              style={{
                border: 0,
                filter: 'grayscale(100%) invert(92%) contrast(83%)',
                pointerEvents: 'auto',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 pointer-events-none">
              <div className="pointer-events-auto bg-[#0b0516]/92 backdrop-blur-md border border-white/10 p-5 sm:p-6">
                <p className="text-[10px] tracking-[0.28em] uppercase text-blite-pink mb-3">Gym</p>
                <p className="text-white font-medium leading-snug">BLITE WOMEN&apos;S FITNESS</p>
                <p className="mt-1 text-sm text-blite-silver/85 leading-relaxed">
                  2nd floor, 110/190, Dr Besant Rd
                  <br />
                  Royapettah, Chennai 600014
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                  <a href="tel:+919876543210" className="text-white hover:text-blite-pink transition-colors">
                    +91 98765 43210
                  </a>
                  <a href="mailto:hello@blite.com" className="text-white hover:text-blite-pink transition-colors">
                    hello@blite.com
                  </a>
                  <span className="text-blite-steel">Mon–Sat · 6AM – 10PM</span>
                </div>

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex text-[10px] tracking-[0.2em] uppercase text-blite-pink hover:text-white transition-colors"
                >
                  Open in Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { emailjsConfig, isEmailjsConfigured } from '../../lib/emailjs';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const fieldClass =
  'w-full bg-white/[0.04] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-blite-steel/80 outline-none transition-colors focus:border-blite-pink/55 focus:bg-white/[0.06]';

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get('website') ?? '').trim()) {
      setStatus('success');
      form.reset();
      return;
    }

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    if (!name || !email || !message) {
      setStatus('error');
      setError('Please fill in your name, email, and message.');
      return;
    }

    if (!isEmailjsConfigured()) {
      setStatus('error');
      setError('The contact form is not connected yet. Email hello@blite.com instead.');
      return;
    }

    setStatus('sending');
    setError('');

    try {
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          title: 'Gym website',
          name,
          email,
          time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          message,
        },
        { publicKey: emailjsConfig.publicKey }
      );
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setError('Message could not be sent. Try again, or email hello@blite.com.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative h-full flex flex-col glass-panel p-7 sm:p-8"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
      }}
    >
      <div className="mb-7">
        <p className="text-[10px] tracking-[0.28em] uppercase text-blite-pink mb-2">Message</p>
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">Write to us</h3>
        <p className="mt-2 text-sm text-blite-silver/85 leading-relaxed">
          Classes, membership, or a visit. We read every message.
        </p>
      </div>

      <label className="sr-only" htmlFor="contact-website">
        Website
      </label>
      <input
        id="contact-website"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block space-y-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blite-steel">Name</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className={fieldClass}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blite-steel">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col space-y-2 flex-1 min-h-[160px]">
        <span className="text-[10px] font-mono tracking-widest uppercase text-blite-steel">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="How can we help?"
          className={`${fieldClass} resize-none flex-1 min-h-[140px]`}
        />
      </label>

      <div className="mt-6 space-y-3">
        {status === 'success' && (
          <p className="text-sm text-emerald-300" role="status">
            Message sent. We&apos;ll get back to you soon.
          </p>
        )}
        {status === 'error' && (
          <p className="text-sm text-rose-300" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0"
          style={{
            background: 'linear-gradient(135deg, #ec1380, #8b2fc9)',
            clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
          }}
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  );
}

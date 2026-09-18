'use client';

import React, { useEffect, useState } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import { pricingPlans, type PricingPlan } from '../../lib/pricing';

type CheckoutNotice = { type: 'success' | 'error'; text: string };

function loadRazorpay(): Promise<void> {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById('razorpay-checkout-js') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Could not load Razorpay.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Razorpay.'));
    document.body.appendChild(script);
  });
}

function PurchaseCta({
  plan,
  isSignedIn,
  pending,
  gradient,
  shadow,
  hoverShadow,
  onPurchase,
}: {
  plan: PricingPlan;
  isSignedIn: boolean;
  pending: boolean;
  gradient: string;
  shadow: string;
  hoverShadow: string;
  onPurchase: (plan: PricingPlan) => void;
}) {
  const buttonClass =
    'w-full py-3 px-6 rounded-full text-[10px] font-mono tracking-widest uppercase font-semibold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0';

  const applyHover = (event: React.MouseEvent<HTMLButtonElement>, nextShadow: string) => {
    event.currentTarget.style.boxShadow = nextShadow;
  };

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button
          className={buttonClass}
          style={{ background: gradient, boxShadow: shadow }}
          onMouseEnter={(event) => applyHover(event, hoverShadow)}
          onMouseLeave={(event) => applyHover(event, shadow)}
        >
          Sign In to Purchase
        </button>
      </SignInButton>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => onPurchase(plan)}
      className={buttonClass}
      style={{ background: gradient, boxShadow: shadow }}
      onMouseEnter={(event) => applyHover(event, hoverShadow)}
      onMouseLeave={(event) => applyHover(event, shadow)}
    >
      {pending ? 'Opening checkout...' : 'Purchase Now'}
    </button>
  );
}

export default function PricingSection() {
  const { isSignedIn } = useUser();
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [notice, setNotice] = useState<CheckoutNotice | null>(null);

  useEffect(() => {
    loadRazorpay().catch(() => {
      // Script can still load on first purchase click.
    });
  }, []);

  const handlePurchase = async (plan: PricingPlan) => {
    setNotice(null);
    setPendingPlanId(plan.id);

    try {
      await loadRazorpay();

      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      });
      const orderPayload = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderPayload.error || 'Could not start checkout.');
      }

      const checkout = new window.Razorpay({
        key: orderPayload.keyId,
        amount: orderPayload.amount,
        currency: orderPayload.currency,
        name: "Blite Women's Fitness",
        description: `${plan.name} · ${plan.duration}`,
        order_id: orderPayload.orderId,
        prefill: orderPayload.prefill,
        notes: { planId: plan.id },
        theme: { color: plan.category === 'zumba' ? '#f97316' : '#ec1380' },
        modal: {
          ondismiss: () => setPendingPlanId(null),
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const verifyPayload = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(verifyPayload.error || 'Payment could not be confirmed.');
            }

            setNotice({
              type: 'success',
              text: `Payment successful. ${plan.name} (${plan.duration}) is now active on your account.`,
            });
          } catch (error) {
            setNotice({
              type: 'error',
              text:
                error instanceof Error
                  ? error.message
                  : 'Payment went through, but confirmation failed. Contact the gym with your payment ID.',
            });
          } finally {
            setPendingPlanId(null);
          }
        },
      });

      checkout.on('payment.failed', (response) => {
        setPendingPlanId(null);
        setNotice({
          type: 'error',
          text: response.error.description || 'Payment failed. Try again or use another method.',
        });
      });

      checkout.open();
    } catch (error) {
      setPendingPlanId(null);
      setNotice({
        type: 'error',
        text: error instanceof Error ? error.message : 'Could not open checkout.',
      });
    }
  };

  const generalPlans = pricingPlans.filter((plan) => plan.category === 'general');
  const personalPlans = pricingPlans.filter((plan) => plan.category === 'personal');
  const zumbaPlans = pricingPlans.filter((plan) => plan.category === 'zumba');

  return (
    <section id="membership" className="relative min-h-screen py-24 px-6 sm:px-10 bg-blite-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blite-purple/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blite-pink/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(199, 125, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(199, 125, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 rounded-full glass-pill text-[10px] font-mono tracking-widest uppercase text-blite-silver">
            <span className="w-1.5 h-1.5 rounded-full bg-blite-pink animate-pulse" />
            <span>Membership Packages</span>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase text-white mb-6">
            Invest In Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blite-pink to-blite-violet"> Power</span>
          </h2>

          <p className="text-lg sm:text-xl text-blite-silver max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan to fuel your transformation. From gym memberships to personal training and energizing Zumba classes, every package is designed to help you build strength, confidence, and results.
          </p>
        </div>

        {notice && (
          <div
            className={`mb-10 mx-auto max-w-2xl rounded-2xl border px-5 py-4 text-sm ${
              notice.type === 'success'
                ? 'border-green-500/40 bg-green-500/10 text-green-200'
                : 'border-red-500/40 bg-red-500/10 text-red-200'
            }`}
          >
            {notice.text}
          </div>
        )}

        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blite-purple/50 to-transparent" />
            <h3 className="text-2xl font-bold tracking-widest uppercase text-white font-mono">
              General Membership
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blite-purple/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {generalPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative group p-8 rounded-2xl transition-all duration-500 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-blite-purple/20 to-blite-pink/10 border-2 border-blite-pink/40 shadow-[0_0_40px_rgba(236,19,128,0.15)]'
                    : 'glass-panel border border-blite-border/30 hover:border-blite-purple/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blite-pink to-blite-purple rounded-full text-[10px] font-mono tracking-widest uppercase text-white font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold tracking-tight text-white mb-2">{plan.name}</h4>
                  <p className="text-xs font-mono tracking-widest uppercase text-blite-steel mb-4">{plan.duration}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black text-white">₹{plan.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-blite-silver mt-3 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-blite-steel">
                      <span className="w-1 h-1 rounded-full bg-blite-pink mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <PurchaseCta
                  plan={plan}
                  isSignedIn={!!isSignedIn}
                  pending={pendingPlanId === plan.id}
                  onPurchase={handlePurchase}
                  gradient={
                    plan.popular
                      ? 'linear-gradient(135deg, #ec1380, #8b2fc9)'
                      : 'linear-gradient(135deg, #8b2fc9, #9d4edd)'
                  }
                  shadow={
                    plan.popular
                      ? '0 0 20px rgba(236, 19, 128, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
                      : '0 0 15px rgba(139, 47, 201, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }
                  hoverShadow={
                    plan.popular
                      ? '0 0 30px rgba(236, 19, 128, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                      : '0 0 25px rgba(139, 47, 201, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blite-pink/50 to-transparent" />
            <h3 className="text-2xl font-bold tracking-widest uppercase text-white font-mono">
              Personal Training
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-blite-pink/50 to-transparent" />
          </div>

          <div className="max-w-md mx-auto">
            {personalPlans.map((plan) => (
              <div
                key={plan.id}
                className="relative group p-8 rounded-2xl glass-panel border-2 border-blite-pink/40 shadow-[0_0_40px_rgba(236,19,128,0.15)] transition-all duration-500 hover:border-blite-pink/60"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2.5 px-3 py-1 mb-4 rounded-full bg-blite-pink/20 text-[10px] font-mono tracking-widest uppercase text-blite-pink">
                    <span className="w-1.5 h-1.5 rounded-full bg-blite-pink animate-pulse" />
                    <span>Premium</span>
                  </div>
                  <h4 className="text-2xl font-bold tracking-tight text-white mb-2">{plan.name}</h4>
                  <p className="text-xs font-mono tracking-widest uppercase text-blite-steel mb-4">{plan.duration}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black text-white">₹{plan.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-blite-silver mt-3 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-blite-steel">
                      <span className="w-1 h-1 rounded-full bg-blite-pink mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <PurchaseCta
                  plan={plan}
                  isSignedIn={!!isSignedIn}
                  pending={pendingPlanId === plan.id}
                  onPurchase={handlePurchase}
                  gradient="linear-gradient(135deg, #ec1380, #8b2fc9)"
                  shadow="0 0 20px rgba(236, 19, 128, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
                  hoverShadow="0 0 30px rgba(236, 19, 128, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
            <h3 className="text-2xl font-bold tracking-widest uppercase text-white font-mono">
              Zumba Classes
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
          </div>

          <div className="max-w-md mx-auto">
            {zumbaPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative group p-8 rounded-2xl transition-all duration-500 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-orange-500/20 to-yellow-500/10 border-2 border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.15)]'
                    : 'glass-panel border border-orange-500/30 hover:border-orange-500/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full text-[10px] font-mono tracking-widest uppercase text-white font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2.5 px-3 py-1 mb-4 rounded-full bg-orange-500/20 text-[10px] font-mono tracking-widest uppercase text-orange-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <span>Dance Fitness</span>
                  </div>
                  <h4 className="text-2xl font-bold tracking-tight text-white mb-2">{plan.name}</h4>
                  <p className="text-xs font-mono tracking-widest uppercase text-blite-steel mb-4">{plan.duration}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black text-white">₹{plan.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-blite-silver mt-3 leading-relaxed">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-blite-steel">
                      <span className="w-1 h-1 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <PurchaseCta
                  plan={plan}
                  isSignedIn={!!isSignedIn}
                  pending={pendingPlanId === plan.id}
                  onPurchase={handlePurchase}
                  gradient={
                    plan.popular
                      ? 'linear-gradient(135deg, #f97316, #eab308)'
                      : 'linear-gradient(135deg, #ea580c, #f97316)'
                  }
                  shadow={
                    plan.popular
                      ? '0 0 20px rgba(249, 115, 22, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
                      : '0 0 15px rgba(234, 88, 12, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }
                  hoverShadow={
                    plan.popular
                      ? '0 0 30px rgba(249, 115, 22, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
                      : '0 0 25px rgba(234, 88, 12, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)'
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-blite-steel/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blite-pink" />
              <span>Instant Activation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blite-purple" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getPlanById, rupeesToPaise } from '../../../../lib/pricing';
import { getRazorpayKeyId, razorpayRequest, type RazorpayOrder } from '../../../../lib/razorpay';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to purchase a plan.' }, { status: 401 });
  }

  let body: { planId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const plan = body.planId ? getPlanById(body.planId) : undefined;
  if (!plan) {
    return NextResponse.json({ error: 'Unknown membership plan.' }, { status: 400 });
  }

  const user = await currentUser();
  const receipt = `blite_${plan.id}_${Date.now()}`.slice(0, 40);

  try {
    const order = await razorpayRequest<RazorpayOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        amount: rupeesToPaise(plan.price),
        currency: 'INR',
        receipt,
        notes: {
          planId: plan.id,
          planName: plan.name,
          userId,
        },
      }),
    });

    return NextResponse.json({
      keyId: getRazorpayKeyId(),
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: {
        id: plan.id,
        name: plan.name,
        duration: plan.duration,
      },
      prefill: {
        name: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not start checkout.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

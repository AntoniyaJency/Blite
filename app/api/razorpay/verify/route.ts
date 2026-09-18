import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getPlanById } from '../../../../lib/pricing';
import { razorpayRequest, verifyRazorpaySignature, type RazorpayOrder } from '../../../../lib/razorpay';

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to confirm a purchase.' }, { status: 401 });
  }

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const orderId = body.razorpay_order_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: 'Missing payment details.' }, { status: 400 });
  }

  const isValid = verifyRazorpaySignature({ orderId, paymentId, signature });
  if (!isValid) {
    return NextResponse.json({ error: 'Payment signature could not be verified.' }, { status: 400 });
  }

  try {
    const order = await razorpayRequest<RazorpayOrder>(`/orders/${orderId}`);
    if (order.notes?.userId && order.notes.userId !== userId) {
      return NextResponse.json({ error: 'This payment belongs to another account.' }, { status: 403 });
    }

    const planId = order.notes?.planId;
    const plan = planId ? getPlanById(planId) : undefined;
    if (!plan) {
      return NextResponse.json({ error: 'Paid plan could not be matched.' }, { status: 400 });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        membership: {
          planId: plan.id,
          planName: plan.name,
          duration: plan.duration,
          amount: plan.price,
          currency: 'INR',
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          purchasedAt: new Date().toISOString(),
          status: 'active',
        },
      },
    });

    return NextResponse.json({
      success: true,
      plan: { id: plan.id, name: plan.name, duration: plan.duration },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not confirm payment.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

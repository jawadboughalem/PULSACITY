import { NextResponse, type NextRequest } from 'next/server';
import type Stripe from 'stripe';

import {
  insertOrder,
  isDatabaseConfigured,
  markSiteSold,
  recordStripeEvent,
  releaseStripeEvent,
} from '@pulsacity/db';

import { notifyOwnerOfSale, sendBuyerConfirmation } from '@/lib/email';
import { stripeWebhookSecret } from '@/lib/server-env';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import type { VatMode } from '@/lib/vat';

// Signature verification needs the raw body, and the Stripe SDK needs Node.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function customFieldValue(session: Stripe.Checkout.Session, key: string): string | undefined {
  const field = session.custom_fields?.find((candidate) => candidate.key === key);
  return field?.text?.value?.trim() || undefined;
}

function idOf(value: string | { id: string } | null | undefined): string | undefined {
  if (!value) return undefined;
  return typeof value === 'string' ? value : value.id;
}

function vatModeOf(session: Stripe.Checkout.Session): VatMode {
  return session.metadata?.vat_mode === 'standard' ? 'standard' : 'franchise';
}

/** Records a paid Checkout Session, then notifies. */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  if (session.payment_status !== 'paid') {
    console.info(`Session ${session.id} ignorée : payment_status=${session.payment_status}.`);
    return;
  }

  const businessName = customFieldValue(session, 'businessName');
  const city = customFieldValue(session, 'city');
  const siteId = session.metadata?.site_id;
  const demoSlug = session.metadata?.demo_slug;
  const email = session.customer_details?.email ?? null;
  const phone = session.customer_details?.phone ?? null;
  const vatMode = vatModeOf(session);

  const order = await insertOrder({
    stripeSessionId: session.id,
    paymentIntentId: idOf(session.payment_intent) ?? null,
    amountTotalCents: session.amount_total ?? 0,
    currency: session.currency ?? 'eur',
    customerEmail: email,
    customerPhone: phone,
    businessName: businessName ?? null,
    city: city ?? null,
    siteId: siteId ?? null,
    vatMode,
    status: 'paid',
  });

  if (!order) {
    console.info(`Commande déjà enregistrée pour la session ${session.id}.`);
    return;
  }

  if (siteId) {
    // Going live stays a manual step until S2.
    await markSiteSold(siteId, order.createdAt);
  }

  await notifyOwnerOfSale({
    businessName: businessName ?? null,
    city: city ?? null,
    phone,
    email,
    amountCents: order.amountTotalCents,
    vatMode,
    demoSlug: demoSlug ?? null,
  });

  if (email) await sendBuyerConfirmation({ email, businessName: businessName ?? null });
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  const secret = stripeWebhookSecret();

  if (!signature || !secret || !isStripeConfigured()) {
    console.error('Webhook refusé : signature absente ou Stripe non configuré.');
    return NextResponse.json({ error: 'not_configured' }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error('Signature Stripe invalide.', error);
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  if (!isDatabaseConfigured()) {
    // Answering 500 makes Stripe retry once the database is back.
    console.error('Webhook non traité : DATABASE_URL absente.');
    return NextResponse.json({ error: 'database_unavailable' }, { status: 500 });
  }

  // Claim the event id. Stripe delivers at least once; this makes handling run once.
  let claimed: boolean;
  try {
    claimed = await recordStripeEvent(event.id, event.type);
  } catch (error) {
    console.error(`Enregistrement de l'événement ${event.id} impossible.`, error);
    return NextResponse.json({ error: 'database_unavailable' }, { status: 500 });
  }
  if (!claimed) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object);
    }
  } catch (error) {
    console.error(`Traitement de l'événement ${event.id} impossible.`, error);
    // Give the claim back so Stripe's retry is not swallowed as a duplicate.
    try {
      await releaseStripeEvent(event.id);
    } catch (releaseError) {
      console.error(`Libération de l'événement ${event.id} impossible.`, releaseError);
    }
    return NextResponse.json({ error: 'processing_failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

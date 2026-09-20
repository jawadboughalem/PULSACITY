import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';

import { buildCheckoutSessionParams } from '@/lib/checkout';
import { findOffer } from '@/lib/lines';
import { corporateOrigin, demoUrl } from '@/lib/env';
import { SLUG_PATTERN } from '@/lib/host-routing';
import { rateLimit } from '@/lib/rate-limit';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { stripeTaxRateId, vatMode } from '@/lib/server-env';

// Stripe's SDK needs the Node runtime.
export const runtime = 'nodejs';

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));

const bodySchema = z.object({
  /** Which offer line is being bought. Its price is read from that line's file. */
  offer: z
    .string()
    .trim()
    .regex(/^[a-z0-9][a-z0-9-]{0,60}$/),
  source: z.enum(['page', 'demo']).default('page'),
  demo_slug: z
    .string()
    .trim()
    .regex(SLUG_PATTERN)
    .optional()
    .or(z.literal('').transform(() => undefined)),
  site_id: z
    .string()
    .trim()
    .uuid()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  lead_id: z
    .string()
    .trim()
    .uuid()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  business_name: optionalText(200),
  city: optionalText(120),
});

async function readBody(request: NextRequest): Promise<Record<string, unknown>> {
  if ((request.headers.get('content-type') ?? '').includes('application/json')) {
    return (await request.json()) as Record<string, unknown>;
  }
  return Object.fromEntries(await request.formData());
}

function wantsJson(request: NextRequest): boolean {
  const contentType = request.headers.get('content-type') ?? '';
  const accept = request.headers.get('accept') ?? '';
  return contentType.includes('application/json') || accept.includes('application/json');
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Creates a Stripe Checkout Session and sends the buyer to it. */
export async function POST(request: NextRequest) {
  const json = wantsJson(request);

  const limit = rateLimit(`checkout:${clientIp(request)}`, { limit: 10, windowMs: 60_000 });
  if (!limit.ok) {
    return json
      ? NextResponse.json({ error: 'too_many_requests' }, { status: 429 })
      : NextResponse.redirect(`${corporateOrigin()}/commande-indisponible`, 303);
  }

  let parsed;
  try {
    parsed = bodySchema.safeParse(await readBody(request));
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  if (!parsed.success) {
    return json
      ? NextResponse.json({ error: 'invalid_body', issues: parsed.error.issues }, { status: 400 })
      : NextResponse.redirect(`${corporateOrigin()}/commande-indisponible`, 303);
  }
  const body = parsed.data;

  // The price never comes from the browser: it is read from the line's content file.
  const offer = findOffer(body.offer);
  if (!offer) {
    console.error(`Commande refusée : offre inconnue « ${body.offer} ».`);
    return json
      ? NextResponse.json({ error: 'unknown_offer' }, { status: 400 })
      : NextResponse.redirect(`${corporateOrigin()}/commande-indisponible`, 303);
  }

  if (!isStripeConfigured()) {
    console.error('Commande impossible : STRIPE_SECRET_KEY absente ou incomplète.');
    return json
      ? NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 })
      : NextResponse.redirect(`${corporateOrigin()}/commande-indisponible`, 303);
  }

  // Built from the request's own fields, never from a caller-supplied URL: an order
  // can only ever send the buyer back to one of our two hosts.
  const cancelUrl =
    body.source === 'demo' && body.demo_slug ? demoUrl(body.demo_slug) : `${corporateOrigin()}/`;

  try {
    const params = buildCheckoutSessionParams(
      {
        offerSlug: body.offer,
        source: body.source,
        demoSlug: body.demo_slug,
        siteId: body.site_id,
        leadId: body.lead_id,
        businessName: body.business_name,
        city: body.city,
      },
      {
        offer,
        vatMode: vatMode(),
        taxRateId: stripeTaxRateId(),
        // Left unencoded on purpose: Stripe substitutes the session id itself.
        successUrl: `${corporateOrigin()}/merci?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl,
      },
    );

    const session = await getStripe().checkout.sessions.create(params);
    if (!session.url) throw new Error('Stripe n’a pas renvoyé d’URL de paiement.');

    return json ? NextResponse.json({ url: session.url }) : NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error('Création de la session de paiement impossible.', error);
    return json
      ? NextResponse.json({ error: 'checkout_failed' }, { status: 502 })
      : NextResponse.redirect(`${corporateOrigin()}/commande-indisponible`, 303);
  }
}

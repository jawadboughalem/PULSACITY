import * as Sentry from "@sentry/nextjs";
import { after } from "next/server";
import type Stripe from "stripe";
import { getDb } from "@/db";
import { revalidateShownPrices } from "@/lib/billing/revalidate-shown-prices";
import { getStripe } from "@/lib/billing/stripe-client";
import { processStripeEvent, recordStripeEvent } from "@/lib/billing/stripe-events";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";

const NO_CACHE = { "Cache-Control": "no-store" };

/**
 * Stripe's events on PULSACITY's own subscriptions. The signature is checked on the bytes received, the event is kept
 * whole, Stripe gets its answer at once, and the event is processed after it; the cron task replays one left behind.
 */
export const POST = async (request: Request): Promise<Response> => {
  const signature = request.headers.get("stripe-signature");
  if (signature === null) return new Response(null, { status: 400, headers: NO_CACHE });
  const body = await request.text();
  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, readRequiredEnvironmentVariable("STRIPE_WEBHOOK_SECRET"));
  } catch {
    return new Response(null, { status: 400, headers: NO_CACHE });
  }

  const database = getDb();
  try {
    await recordStripeEvent(database, event);
  } catch (error) {
    Sentry.captureException(error);
    return new Response(null, { status: 503, headers: { ...NO_CACHE, "Retry-After": "60" } });
  }

  after(async () => {
    try {
      const outcome = await processStripeEvent(database, stripe, event.id);
      if (outcome.status === "processed" && outcome.subscription?.status === "applied") {
        if (outcome.subscription.closedFounderPrice) revalidateShownPrices();
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  });
  return Response.json({ received: true }, { headers: NO_CACHE });
};

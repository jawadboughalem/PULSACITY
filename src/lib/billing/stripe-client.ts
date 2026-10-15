import Stripe from "stripe";
import { readRequiredEnvironmentVariable } from "@/lib/environment/read-required-environment-variable";

/**
 * The API version pinned by the stripe package: the webhook endpoint must be created with the same one, so that the
 * events read here have the shape the code expects (docs-internes/recette/lot-4-5-abonnement.md, prompt 6).
 */
export const STRIPE_API_VERSION = "2026-09-30.endive";

const globalForStripe = globalThis as typeof globalThis & { pulsacityStripe?: Stripe };

/** PULSACITY's own Stripe account (subscriptions of the creators), from STRIPE_SECRET_KEY. */
export const getStripe = (): Stripe => {
  globalForStripe.pulsacityStripe ??= new Stripe(readRequiredEnvironmentVariable("STRIPE_SECRET_KEY"), {
    apiVersion: STRIPE_API_VERSION,
    maxNetworkRetries: 2,
    appInfo: { name: "PULSACITY", url: "https://pulsacity.com" },
  });
  return globalForStripe.pulsacityStripe;
};

export const isStripeConfigured = (): boolean => Boolean(process.env.STRIPE_SECRET_KEY);

/**
 * On a preview with a test key, every new customer gets its own Stripe test clock: the recette moves time forward in
 * the Dashboard (end of the beta, renewal, failed payment) instead of waiting. Never in production, never in live mode.
 */
export const usesStripeTestClocks = (): boolean => {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  return process.env.VERCEL_ENV === "preview" && (key.startsWith("sk_test_") || key.startsWith("rk_test_"));
};

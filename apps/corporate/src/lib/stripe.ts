/**
 * Stripe client. Created lazily so the app builds and renders without a key.
 */
import Stripe from 'stripe';

import { stripeSecretKey } from './server-env';

let client: Stripe | undefined;

export function isStripeConfigured(): boolean {
  const key = stripeSecretKey();
  // `.env.example` ships the bare `sk_test_` prefix as a placeholder.
  return Boolean(key && key !== 'sk_test_' && key !== 'sk_live_');
}

export function getStripe(): Stripe {
  if (client) return client;

  const key = stripeSecretKey();
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY est absente. Voir .env.example.');
  }
  client = new Stripe(key, { typescript: true });
  return client;
}

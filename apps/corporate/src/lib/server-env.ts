/**
 * Server-side environment access.
 *
 * Only ever imported from server components, server actions and route handlers.
 * An empty variable reads as `undefined`, and callers omit what they cannot fill —
 * they never substitute a made-up value.
 */
import type { VatMode } from './vat';

function read(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

export interface LegalIdentity {
  name?: string;
  status?: string;
  siret?: string;
  address?: string;
  email?: string;
  publisher?: string;
  /** Postal address of the host (Vercel Inc.), copied from its legal page. */
  hostAddress?: string;
}

export function legalIdentity(): LegalIdentity {
  return {
    name: read('LEGAL_NAME'),
    status: read('LEGAL_STATUS'),
    siret: read('LEGAL_SIRET'),
    address: read('LEGAL_ADDRESS'),
    email: read('LEGAL_EMAIL'),
    publisher: read('LEGAL_PUBLISHER'),
    hostAddress: read('LEGAL_HOST_ADDRESS'),
  };
}

export function ownerEmail(): string | undefined {
  return read('OWNER_EMAIL');
}

export function emailSender(): string | undefined {
  return read('EMAIL_FROM');
}

export function resendApiKey(): string | undefined {
  return read('RESEND_API_KEY');
}

export function stripeSecretKey(): string | undefined {
  return read('STRIPE_SECRET_KEY');
}

export function stripeWebhookSecret(): string | undefined {
  return read('STRIPE_WEBHOOK_SECRET');
}

export function stripeTaxRateId(): string | undefined {
  return read('STRIPE_TAX_RATE_ID');
}

/** Lifetime of a demo, in days. */
export function demoTtlDays(): number {
  const parsed = Number(read('DEMO_TTL_DAYS') ?? 30);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
}

/**
 * Reads VAT_MODE. Unset means `franchise` (micro-entreprise); an unrecognised value
 * throws rather than silently under-charging VAT.
 */
export function vatMode(): VatMode {
  const raw = read('VAT_MODE');
  if (!raw) return 'franchise';
  if (raw === 'franchise' || raw === 'standard') return raw;
  throw new Error(`VAT_MODE invalide : « ${raw} ». Valeurs acceptées : franchise, standard.`);
}

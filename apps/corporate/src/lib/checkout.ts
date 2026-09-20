/**
 * Stripe Checkout Session parameters.
 *
 * A pure builder: the offer is handed in, already read from its content file, so both
 * VAT modes are unit-tested without touching the network. Quantity is always 1 and
 * promotion codes are always off — a line has one price.
 */
import type Stripe from 'stripe';

import type { Offer } from './lines';
import { CURRENCY, VAT_FRANCHISE_NOTICE } from './pricing';
import type { VatMode } from './vat';

export interface CheckoutInput {
  /** The offer line being bought, e.g. `creation-de-sites`. */
  offerSlug: string;
  /** Where the order started: a page of the site, or a prepared demo. */
  source: 'page' | 'demo';
  demoSlug?: string | undefined;
  siteId?: string | undefined;
  /** The brief this order follows, when the buyer filled one. */
  leadId?: string | undefined;
  businessName?: string | undefined;
  city?: string | undefined;
}

export interface CheckoutConfig {
  offer: Offer;
  vatMode: VatMode;
  /** Required when `vatMode` is `standard`: the 20 % exclusive Stripe tax rate. */
  taxRateId?: string | undefined;
  successUrl: string;
  cancelUrl: string;
}

/** Stripe rejects an empty default value, and truncates long ones. */
function defaultValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, 200) : undefined;
}

function customField(
  key: string,
  label: string,
  value: string | undefined,
  optional: boolean,
): Stripe.Checkout.SessionCreateParams.CustomField {
  const prefill = defaultValue(value);
  return {
    key,
    label: { type: 'custom', custom: label },
    type: 'text',
    optional,
    ...(prefill ? { text: { default_value: prefill } } : {}),
  };
}

export function buildCheckoutSessionParams(
  input: CheckoutInput,
  config: CheckoutConfig,
): Stripe.Checkout.SessionCreateParams {
  if (config.vatMode === 'standard' && !config.taxRateId) {
    throw new Error(
      'VAT_MODE=standard exige STRIPE_TAX_RATE_ID (taux de TVA 20 % exclusif). Voir .env.example.',
    );
  }

  const taxRates = config.vatMode === 'standard' ? [config.taxRateId as string] : undefined;

  const metadata: Record<string, string> = {
    offer_slug: input.offerSlug,
    source: input.source,
    vat_mode: config.vatMode,
  };
  if (input.demoSlug) metadata.demo_slug = input.demoSlug;
  if (input.siteId) metadata.site_id = input.siteId;
  if (input.leadId) metadata.lead_id = input.leadId;

  return {
    mode: 'payment',
    locale: 'fr',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: config.offer.priceHtCents,
          product_data: { name: config.offer.productLabel },
        },
        ...(taxRates ? { tax_rates: taxRates } : {}),
      },
    ],
    // One price per line: promotion codes stay off.
    allow_promotion_codes: false,
    phone_number_collection: { enabled: true },
    custom_fields: [
      customField('businessName', "Nom de l'entreprise", input.businessName, false),
      customField('city', 'Ville', input.city, true),
    ],
    invoice_creation: {
      enabled: true,
      ...(config.vatMode === 'franchise' ? { invoice_data: { footer: VAT_FRANCHISE_NOTICE } } : {}),
    },
    metadata,
    success_url: config.successUrl,
    cancel_url: config.cancelUrl,
  };
}

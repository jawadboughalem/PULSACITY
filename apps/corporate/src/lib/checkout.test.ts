import { describe, expect, it } from 'vitest';

import { buildCheckoutSessionParams } from './checkout';
import { findOffer, liveLines } from './lines';
import { VAT_FRANCHISE_NOTICE } from './pricing';

const urls = {
  successUrl: 'https://pulsacity.com/merci?session_id={CHECKOUT_SESSION_ID}',
  cancelUrl: 'https://pulsacity.com/',
};

const offer = { priceHtCents: 50_000, productLabel: 'Site vitrine — 500 € HT tout compris' };
const input = { offerSlug: 'creation-de-sites', source: 'page' as const };

describe('le prix vient du fichier de la ligne', () => {
  it('reads the amount from the content file, not from a constant', () => {
    const line = liveLines()[0];
    expect(line).toBeDefined();

    const fromContent = findOffer(line!.slug);
    expect(fromContent).toBeDefined();

    const params = buildCheckoutSessionParams(
      { offerSlug: line!.slug, source: 'page' },
      { offer: fromContent!, vatMode: 'franchise', ...urls },
    );
    expect(params.line_items?.[0]?.price_data?.unit_amount).toBe(fromContent!.priceHtCents);
    expect(params.line_items?.[0]?.price_data?.product_data?.name).toBe(fromContent!.productLabel);
  });

  it('refuses a slug that sells nothing', () => {
    expect(findOffer('pulsa-store')).toBeUndefined();
    expect(findOffer('slug-inconnu')).toBeUndefined();
  });
});

describe('buildCheckoutSessionParams — régime franchise (micro-entreprise)', () => {
  const params = buildCheckoutSessionParams(input, { offer, vatMode: 'franchise', ...urls });

  it('charges the line price once, in euros', () => {
    const item = params.line_items?.[0];
    expect(item?.quantity).toBe(1);
    expect(item?.price_data?.unit_amount).toBe(50_000);
    expect(item?.price_data?.currency).toBe('eur');
  });

  it('applies no tax rate: nothing is added on top', () => {
    expect(params.line_items?.[0]).not.toHaveProperty('tax_rates');
  });

  it('prints the art. 293 B notice on the invoice', () => {
    expect(params.invoice_creation?.enabled).toBe(true);
    expect(params.invoice_creation?.invoice_data?.footer).toBe(VAT_FRANCHISE_NOTICE);
    expect(VAT_FRANCHISE_NOTICE).toBe('TVA non applicable, art. 293 B du CGI');
  });

  it('records the line and the mode in the session metadata', () => {
    expect(params.metadata).toMatchObject({
      offer_slug: 'creation-de-sites',
      source: 'page',
      vat_mode: 'franchise',
    });
  });
});

describe('buildCheckoutSessionParams — régime standard (SASU)', () => {
  const params = buildCheckoutSessionParams(
    {
      ...input,
      source: 'demo',
      demoSlug: 'as-du-2-roues',
      siteId: 'e5d0f2a4-0000-4000-8000-000000000000',
      leadId: 'aa11bb22-0000-4000-8000-000000000000',
    },
    { offer, vatMode: 'standard', taxRateId: 'txr_123', ...urls },
  );

  it('attaches the 20 % exclusive tax rate to the line item', () => {
    expect(params.line_items?.[0]).toMatchObject({ tax_rates: ['txr_123'] });
    // The unit amount stays the amount excluding tax.
    expect(params.line_items?.[0]?.price_data?.unit_amount).toBe(50_000);
  });

  it('drops the franchise footer', () => {
    expect(params.invoice_creation?.invoice_data?.footer).toBeUndefined();
  });

  it('carries the demo and the brief it came from', () => {
    expect(params.metadata).toMatchObject({
      demo_slug: 'as-du-2-roues',
      site_id: 'e5d0f2a4-0000-4000-8000-000000000000',
      lead_id: 'aa11bb22-0000-4000-8000-000000000000',
    });
  });

  it('refuses to build a session without a tax rate id', () => {
    expect(() =>
      buildCheckoutSessionParams(input, { offer, vatMode: 'standard', ...urls }),
    ).toThrowError(/STRIPE_TAX_RATE_ID/);
  });
});

describe('buildCheckoutSessionParams — règles communes', () => {
  it('never allows a promotion code', () => {
    for (const vatMode of ['franchise', 'standard'] as const) {
      const params = buildCheckoutSessionParams(input, {
        offer,
        vatMode,
        taxRateId: 'txr_123',
        ...urls,
      });
      expect(params.allow_promotion_codes).toBe(false);
      expect(params.mode).toBe('payment');
      expect(params.locale).toBe('fr');
      expect(params.line_items).toHaveLength(1);
    }
  });

  it('collects a phone number and asks for the business name', () => {
    const params = buildCheckoutSessionParams(input, { offer, vatMode: 'franchise', ...urls });
    expect(params.phone_number_collection).toEqual({ enabled: true });

    const [business, city] = params.custom_fields ?? [];
    expect(business?.key).toBe('businessName');
    expect(business?.optional).toBe(false);
    expect(city?.key).toBe('city');
    expect(city?.optional).toBe(true);
  });

  it('prefills the custom fields, and omits empty prefills', () => {
    const params = buildCheckoutSessionParams(
      { ...input, businessName: "L'As du 2 Roues", city: '   ' },
      { offer, vatMode: 'franchise', ...urls },
    );
    const [business, city] = params.custom_fields ?? [];
    expect(business?.text?.default_value).toBe("L'As du 2 Roues");
    expect(city?.text).toBeUndefined();
  });
});

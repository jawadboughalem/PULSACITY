import { describe, expect, it } from 'vitest';

import { buildCheckoutSessionParams } from './checkout';
import { PRICE_HT_CENTS, PRODUCT_NAME, VAT_FRANCHISE_NOTICE } from './pricing';

const urls = {
  successUrl: 'https://pulsacity.com/merci?session_id={CHECKOUT_SESSION_ID}',
  cancelUrl: 'https://pulsacity.com/',
};

describe('buildCheckoutSessionParams — régime franchise (micro-entreprise)', () => {
  const params = buildCheckoutSessionParams({ source: 'page' }, { vatMode: 'franchise', ...urls });

  it('charges 500 € once, in euros', () => {
    const item = params.line_items?.[0];
    expect(item?.quantity).toBe(1);
    expect(item?.price_data?.unit_amount).toBe(PRICE_HT_CENTS);
    expect(PRICE_HT_CENTS).toBe(50_000);
    expect(item?.price_data?.currency).toBe('eur');
    expect(item?.price_data?.product_data?.name).toBe(PRODUCT_NAME);
  });

  it('applies no tax rate: nothing is added on top of the 500 €', () => {
    expect(params.line_items?.[0]).not.toHaveProperty('tax_rates');
  });

  it('prints the art. 293 B notice on the invoice', () => {
    expect(params.invoice_creation?.enabled).toBe(true);
    expect(params.invoice_creation?.invoice_data?.footer).toBe(VAT_FRANCHISE_NOTICE);
    expect(VAT_FRANCHISE_NOTICE).toBe('TVA non applicable, art. 293 B du CGI');
  });

  it('records the mode in the session metadata', () => {
    expect(params.metadata).toMatchObject({ source: 'page', vat_mode: 'franchise' });
  });
});

describe('buildCheckoutSessionParams — régime standard (SASU)', () => {
  const params = buildCheckoutSessionParams(
    { source: 'demo', demoSlug: 'as-du-2-roues', siteId: 'e5d0f2a4-0000-4000-8000-000000000000' },
    { vatMode: 'standard', taxRateId: 'txr_123', ...urls },
  );

  it('attaches the 20 % exclusive tax rate to the line item', () => {
    expect(params.line_items?.[0]).toMatchObject({ tax_rates: ['txr_123'] });
    // The unit amount stays the amount excluding tax: 500 € HT → 600 € TTC.
    expect(params.line_items?.[0]?.price_data?.unit_amount).toBe(50_000);
  });

  it('drops the franchise footer', () => {
    expect(params.invoice_creation?.invoice_data?.footer).toBeUndefined();
  });

  it('carries the demo it was ordered from', () => {
    expect(params.metadata).toMatchObject({
      source: 'demo',
      vat_mode: 'standard',
      demo_slug: 'as-du-2-roues',
      site_id: 'e5d0f2a4-0000-4000-8000-000000000000',
    });
  });

  it('refuses to build a session without a tax rate id', () => {
    expect(() =>
      buildCheckoutSessionParams({ source: 'page' }, { vatMode: 'standard', ...urls }),
    ).toThrowError(/STRIPE_TAX_RATE_ID/);
  });
});

describe('buildCheckoutSessionParams — règles communes', () => {
  it('never allows a promotion code', () => {
    for (const vatMode of ['franchise', 'standard'] as const) {
      const params = buildCheckoutSessionParams(
        { source: 'page' },
        { vatMode, taxRateId: 'txr_123', ...urls },
      );
      expect(params.allow_promotion_codes).toBe(false);
      expect(params.mode).toBe('payment');
      expect(params.locale).toBe('fr');
      expect(params.line_items).toHaveLength(1);
    }
  });

  it('collects a phone number and asks for the business name', () => {
    const params = buildCheckoutSessionParams(
      { source: 'page' },
      { vatMode: 'franchise', ...urls },
    );
    expect(params.phone_number_collection).toEqual({ enabled: true });

    const [business, city] = params.custom_fields ?? [];
    expect(business?.key).toBe('businessName');
    expect(business?.optional).toBe(false);
    expect(city?.key).toBe('city');
    expect(city?.optional).toBe(true);
  });

  it('prefills the custom fields from the demo, and omits empty prefills', () => {
    const params = buildCheckoutSessionParams(
      { source: 'demo', businessName: "L'As du 2 Roues", city: '   ' },
      { vatMode: 'franchise', ...urls },
    );
    const [business, city] = params.custom_fields ?? [];
    expect(business?.text?.default_value).toBe("L'As du 2 Roues");
    expect(city?.text).toBeUndefined();
  });

  it('sends the buyer back where they came from on cancel', () => {
    const params = buildCheckoutSessionParams(
      { source: 'demo', demoSlug: 'as-du-2-roues' },
      {
        vatMode: 'franchise',
        successUrl: urls.successUrl,
        cancelUrl: 'https://demo.pulsacity.com/as-du-2-roues',
      },
    );
    expect(params.cancel_url).toBe('https://demo.pulsacity.com/as-du-2-roues');
    expect(params.success_url).toContain('{CHECKOUT_SESSION_ID}');
  });
});

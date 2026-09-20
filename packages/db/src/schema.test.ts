import { getTableConfig } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';

import {
  domainTypeEnum,
  domains,
  leadKindEnum,
  leadStatusEnum,
  leads,
  orderStatusEnum,
  orders,
  siteStatusEnum,
  sites,
  stripeEvents,
  vatModeEnum,
} from './schema';

describe('enums', () => {
  it('keeps the documented status values', () => {
    expect(siteStatusEnum.enumValues).toEqual(['demo', 'sold', 'live', 'archived']);
    expect(leadStatusEnum.enumValues).toEqual(['new', 'contacted', 'converted', 'rejected']);
    expect(leadKindEnum.enumValues).toEqual(['order_brief', 'notify', 'contact']);
    expect(orderStatusEnum.enumValues).toEqual(['paid']);
    expect(vatModeEnum.enumValues).toEqual(['franchise', 'standard']);
    expect(domainTypeEnum.enumValues).toEqual(['corporate', 'demo', 'client']);
  });
});

describe('tables', () => {
  it('routes hosts through a unique `domains.host`', () => {
    const config = getTableConfig(domains);
    expect(config.name).toBe('domains');
    expect(config.columns.find((column) => column.name === 'host')?.primary).toBe(true);
  });

  it('keeps one demo per slug', () => {
    const config = getTableConfig(sites);
    const unique = config.indexes.find((index) => index.config.name === 'sites_slug_key');
    expect(unique?.config.unique).toBe(true);
  });

  it('stores money in cents and never as a float', () => {
    const column = getTableConfig(orders).columns.find(
      (candidate) => candidate.name === 'amount_total_cents',
    );
    expect(column?.getSQLType()).toBe('integer');
  });

  // The webhook relies on this uniqueness for idempotence.
  it('records a Checkout Session at most once', () => {
    const unique = getTableConfig(orders).indexes.find(
      (index) => index.config.name === 'orders_stripe_session_id_key',
    );
    expect(unique?.config.unique).toBe(true);
  });

  it('keys the Stripe event ledger by the event id', () => {
    const config = getTableConfig(stripeEvents);
    expect(config.columns.find((column) => column.name === 'id')?.primary).toBe(true);
  });

  // A « prévenez-moi » carries an e-mail and nothing else, so the brief-only fields
  // must be optional; what each form asks lives in `payload` instead.
  it('lets every request kind share one table', () => {
    const columns = getTableConfig(leads).columns;
    const by = (name: string) => columns.find((column) => column.name === name);

    expect(by('kind')?.notNull).toBe(true);
    expect(by('phone_e164')?.notNull).toBe(false);
    expect(by('business_name')?.notNull).toBe(false);
    expect(by('payload')?.getSQLType()).toBe('jsonb');
    expect(by('payload')?.notNull).toBe(true);
    expect(by('line_slug')).toBeDefined();
    expect(by('converted_order_id')).toBeDefined();
  });

  it('records which line each order bought', () => {
    const columns = getTableConfig(orders).columns;
    expect(columns.find((column) => column.name === 'offer_slug')?.notNull).toBe(true);
    expect(columns.find((column) => column.name === 'lead_id')).toBeDefined();
  });

  it('stores every timestamp with its time zone', () => {
    for (const table of [sites, leads, orders, stripeEvents, domains]) {
      for (const column of getTableConfig(table).columns) {
        if (column.getSQLType().startsWith('timestamp')) {
          expect(column.getSQLType()).toContain('with time zone');
        }
      }
    }
  });
});

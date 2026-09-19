import { getTableConfig } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';

import {
  domainTypeEnum,
  domains,
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

  it('normalises lead phone numbers into a dedicated column', () => {
    const column = getTableConfig(leads).columns.find(
      (candidate) => candidate.name === 'phone_e164',
    );
    expect(column?.notNull).toBe(true);
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

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { ShowcaseSchema, parseShowcase } from './showcase';
import { slugify } from './utils';

const showcasePath = join(process.cwd(), 'content', 'showcase.json');

describe('content/showcase.json', () => {
  const raw: unknown = JSON.parse(readFileSync(showcasePath, 'utf8'));

  it('matches the showcase schema', () => {
    expect(() => parseShowcase(raw)).not.toThrow();
  });

  it('holds at most three entries', () => {
    expect(Array.isArray(raw)).toBe(true);
    expect((raw as unknown[]).length).toBeLessThanOrEqual(3);
  });
});

describe('ShowcaseSchema', () => {
  const entry = {
    name: "L'As du 2 Roues",
    sector: 'Garage 2-roues',
    city: 'Paris',
    url: 'https://example.com',
  };

  it('accepts a complete entry', () => {
    expect(ShowcaseSchema.parse([entry])).toHaveLength(1);
  });

  // « jamais de carte fictive ; si l'URL manque, pas d'entrée »
  it.each([
    ['a missing url', { ...entry, url: undefined }],
    ['an empty url', { ...entry, url: '' }],
    ['a url that is not one', { ...entry, url: 'pas-une-url' }],
    ['a missing name', { ...entry, name: '' }],
    ['a missing sector', { ...entry, sector: '' }],
  ])('rejects an entry with %s', (_label, candidate) => {
    expect(ShowcaseSchema.safeParse([candidate]).success).toBe(false);
  });

  it('refuses more than three entries', () => {
    expect(ShowcaseSchema.safeParse([entry, entry, entry, entry]).success).toBe(false);
  });

  it('derives a stable screenshot slug from the name', () => {
    expect(slugify("L'As du 2 Roues")).toBe('l-as-du-2-roues');
  });
});

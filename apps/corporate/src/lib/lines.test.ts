import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { contentDir } from './content-paths';
import { LineSchema, comingLines, findLine, findOffer, liveLines, loadLines } from './lines';
import { loadSite } from './site-content';

const validLive = {
  slug: 'une-ligne',
  order: 1,
  status: 'live',
  title: 'Une ligne',
  tagline: 'Une phrase.',
  offer: { priceHtCents: 50_000, productLabel: 'Une offre' },
  journey: {
    brief: { title: 'Demander', text: 'Trois minutes.' },
    sent: {
      title: 'Merci.',
      text: 'On se parle bientôt.',
      payNowTitle: 'Régler maintenant ?',
      payNowText: 'Ce n’est pas nécessaire.',
    },
    paid: { title: 'Reçu.', text: 'Voici la suite.', steps: ['Une étape.'] },
  },
  sections: [
    {
      type: 'hero',
      title: 'Un titre',
      text: 'Un texte.',
      primary: { label: 'Agir', href: '/commander' },
    },
  ],
};

describe('LineSchema', () => {
  it('accepts a live line with an offer and sections', () => {
    expect(LineSchema.parse(validLive).slug).toBe('une-ligne');
  });

  it('accepts a line still in preparation, reduced to its sentence', () => {
    const parsed = LineSchema.parse({
      slug: 'a-venir',
      order: 2,
      status: 'coming',
      title: 'À venir',
      tagline: 'Une phrase, et rien de plus.',
    });
    expect(parsed.sections).toEqual([]);
  });

  it('refuses a live line without sections', () => {
    expect(LineSchema.safeParse({ ...validLive, sections: [] }).success).toBe(false);
  });

  it('refuses a live line that does not describe its order journey', () => {
    // The three journey pages say what is being sold; leaving that to the
    // components is what rule 1 forbids.
    const { journey: _journey, ...withoutJourney } = validLive;
    expect(LineSchema.safeParse(withoutJourney).success).toBe(false);
  });

  it('asks a line in preparation for no journey at all', () => {
    const parsed = LineSchema.parse({
      slug: 'a-venir',
      order: 2,
      status: 'coming',
      title: 'À venir',
      tagline: 'Une phrase.',
    });
    expect(parsed.journey).toBeUndefined();
  });

  it('refuses a live line that declares no offer', () => {
    const { offer: _offer, ...withoutOffer } = validLive;
    expect(LineSchema.safeParse(withoutOffer).success).toBe(false);
  });

  // « pour une ligne coming, une seule phrase »
  it('refuses a coming line that promises sections', () => {
    expect(LineSchema.safeParse({ ...validLive, status: 'coming' }).success).toBe(false);
  });

  it('refuses an unknown section type', () => {
    const wrong = { ...validLive, sections: [{ type: 'carousel', title: 'Non' }] };
    expect(LineSchema.safeParse(wrong).success).toBe(false);
  });

  it('refuses an action pointing off the site', () => {
    const wrong = {
      ...validLive,
      sections: [
        { ...validLive.sections[0], primary: { label: 'Ailleurs', href: 'https://example.com' } },
      ],
    };
    expect(LineSchema.safeParse(wrong).success).toBe(false);
  });

  it('refuses an unreplaced placeholder', () => {
    expect(LineSchema.safeParse({ ...validLive, tagline: 'Bonjour {{NAME}}' }).success).toBe(false);
  });
});

describe('content/lines', () => {
  it('every file parses', () => {
    expect(() => loadLines()).not.toThrow();
    expect(loadLines().length).toBeGreaterThan(0);
  });

  it('splits live lines from the ones still in preparation', () => {
    const all = loadLines();
    expect([...liveLines(), ...comingLines()]).toHaveLength(all.length);
    expect(liveLines().every((line) => line.status === 'live')).toBe(true);
    expect(comingLines().every((line) => line.status === 'coming')).toBe(true);
  });

  it('keeps the declared order', () => {
    const orders = loadLines().map((line) => line.order);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
  });

  it('exposes an offer for a live line only', () => {
    const live = liveLines()[0];
    expect(live).toBeDefined();
    expect(findOffer(live!.slug)?.priceHtCents).toBeGreaterThan(0);

    for (const line of comingLines()) {
      expect(findOffer(line.slug)).toBeUndefined();
    }
  });

  it('does not resolve an unknown slug', () => {
    expect(findLine('ligne-qui-nexiste-pas')).toBeUndefined();
    expect(findOffer('ligne-qui-nexiste-pas')).toBeUndefined();
  });
});

/*
 * CLAUDE.md rule 9 — content/ must never ship an unreplaced marker.
 *
 * `content/legal/` is excluded on purpose: those files ARE templates, and the test
 * that matters for them checks the rendered page instead (see legal.test.ts).
 */
describe('aucun texte non remplacé dans content/', () => {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name === 'legal') continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else files.push(path);
    }
  };
  walk(contentDir());

  it.each(files)('%s', (file) => {
    expect(readFileSync(file, 'utf8')).not.toMatch(/\{\{/);
  });
});

describe('content/site.json', () => {
  it('parses and carries the callback delay the forms quote', () => {
    const site = loadSite();
    expect(site.brand.length).toBeGreaterThan(0);
    expect(site.callbackDelay.length).toBeGreaterThan(0);
  });
});

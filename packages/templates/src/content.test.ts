import { describe, expect, it } from 'vitest';

import { SiteContentSchema, safeParseSiteContent } from './content';
import { findPlaceholdersDeep, hasPlaceholder } from './placeholders';
import { telHref } from './render';

const validContent = {
  headline: 'Réparation et entretien de deux-roues',
  intro: 'Atelier ouvert du lundi au samedi. Devis avant toute intervention.',
  services: [
    { name: 'Révision', description: 'Vidange, freins, pneus.', price: 'à partir de 89 €' },
  ],
  faq: [{ question: 'Faut-il prendre rendez-vous ?', answer: 'Oui, par téléphone.' }],
  openingHours: [{ day: 'Lundi', hours: '09h00 – 18h00' }],
  phone: '01 23 45 67 89',
  address: '12 rue de Paris, 75011 Paris',
  mapsUrl: 'https://maps.google.com/?cid=1234',
  reviews: [{ author: 'Karim B.', rating: 5, text: 'Travail soigné.', date: '2025-04-12' }],
  photos: [{ url: 'https://example.com/atelier.webp', alt: "Façade de l'atelier" }],
};

describe('SiteContentSchema', () => {
  it('accepts a complete, filled content', () => {
    const parsed = SiteContentSchema.parse(validContent);
    expect(parsed.headline).toBe(validContent.headline);
    expect(parsed.services).toHaveLength(1);
  });

  it('applies empty-array defaults for the optional collections', () => {
    const parsed = SiteContentSchema.parse({
      headline: 'Titre',
      intro: 'Texte de présentation.',
    });
    expect(parsed.services).toEqual([]);
    expect(parsed.reviews).toEqual([]);
    expect(parsed.photos).toEqual([]);
  });

  // CLAUDE.md rule 9: a template must never ship an unreplaced {{...}} marker.
  it.each([
    ['headline', { ...validContent, headline: 'Bienvenue chez {{BUSINESS_NAME}}' }],
    ['intro', { ...validContent, intro: 'Atelier situé à {{ CITY }}.' }],
    ['a service name', { ...validContent, services: [{ name: '{{SERVICE}}' }] }],
    [
      'a review',
      { ...validContent, reviews: [{ author: '{{AUTHOR}}', rating: 5, text: 'Parfait.' }] },
    ],
    [
      'an faq answer',
      { ...validContent, faq: [{ question: 'Tarifs ?', answer: '{{PRICE}} euros' }] },
    ],
  ])('rejects an unreplaced placeholder in %s', (_label, content) => {
    const result = safeParseSiteContent(content);
    expect(result.success).toBe(false);
  });

  it('rejects a rating outside 1–5', () => {
    const result = safeParseSiteContent({
      ...validContent,
      reviews: [{ author: 'Karim B.', rating: 6, text: 'Parfait.' }],
    });
    expect(result.success).toBe(false);
  });
});

describe('placeholder detection', () => {
  it('finds markers with and without inner spaces', () => {
    expect(hasPlaceholder('Bonjour {{NAME}}')).toBe(true);
    expect(hasPlaceholder('Bonjour {{ NAME }}')).toBe(true);
    expect(hasPlaceholder('Bonjour Karim')).toBe(false);
  });

  it('reports the path of a nested marker', () => {
    const found = findPlaceholdersDeep({ services: [{ name: '{{SERVICE}}' }] });
    expect(found).toEqual(['services.0.name: {{SERVICE}}']);
  });

  it('ignores single braces used as ordinary text', () => {
    expect(hasPlaceholder('Un accolade { seule } ne déclenche rien')).toBe(false);
  });
});

describe('telHref', () => {
  it('strips spacing so the number stays dialable', () => {
    expect(telHref('01 23 45 67 89')).toBe('tel:0123456789');
    expect(telHref('+33 1 23 45 67 89')).toBe('tel:+33123456789');
  });
});

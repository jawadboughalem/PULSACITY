/**
 * Development fixture.
 *
 * CLAUDE.md rule 6: a demo only ever comes from real data. This single, obviously
 * fictional row is the one exception, and it must never reach production.
 */
import { eq } from 'drizzle-orm';

import { closeDb, getDb } from './client';
import { sites } from './schema';
import { SiteContentSchema } from '@pulsacity/templates/content';

if (process.env.VERCEL_ENV === 'production') {
  console.error(
    '`db:seed` est refusé en production : une démo ne provient que de données réelles.',
  );
  process.exit(1);
}

const FIXTURE_SLUG = 'garage-exemple-fixture';

const content = SiteContentSchema.parse({
  headline: 'Fixture de développement — ce garage n’existe pas',
  intro:
    'Cette démo est une fixture destinée au développement local. Elle ne correspond à aucune entreprise réelle et ne doit jamais être publiée.',
  services: [
    { name: 'Révision (fixture)', description: 'Donnée de test.' },
    { name: 'Changement de pneus (fixture)', description: 'Donnée de test.' },
  ],
  faq: [
    { question: 'Est-ce un vrai garage ?', answer: 'Non. Cette page est une fixture de test.' },
  ],
  openingHours: [
    { day: 'Lundi', hours: '09h00 – 18h00' },
    { day: 'Samedi', hours: 'Fermé' },
  ],
  phone: '01 00 00 00 00',
  address: '1 rue de la Fixture, 75000 Paris',
  mapsUrl: 'https://www.google.com/maps',
  reviews: [],
  photos: [],
});

const ttlDays = Number(process.env.DEMO_TTL_DAYS ?? 30);
const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

try {
  const db = getDb();
  await db.delete(sites).where(eq(sites.slug, FIXTURE_SLUG));
  await db.insert(sites).values({
    slug: FIXTURE_SLUG,
    name: 'Garage Exemple (fixture)',
    city: 'Paris',
    status: 'demo',
    content,
    expiresAt,
  });
  console.info(`Fixture insérée : /${FIXTURE_SLUG} (expire le ${expiresAt.toISOString()}).`);
} finally {
  await closeDb();
}

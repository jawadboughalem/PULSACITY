import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { findDomain, isDatabaseConfigured } from '@pulsacity/db';

import { normalizeHost } from '@/lib/host-routing';

export const dynamic = 'force-dynamic';

/**
 * A host that is neither the corporate nor the demo domain.
 *
 * The `domains` table is consulted here rather than in the middleware, which runs on
 * the edge and cannot reach Postgres. V0 serves no client domain, so every lookup ends
 * in a sober 404; per-domain client sites arrive in S2.
 */
export default async function UnknownHostPage(): Promise<never> {
  const host = normalizeHost((await headers()).get('host'));

  if (host && isDatabaseConfigured()) {
    try {
      const domain = await findDomain(host);
      if (domain) {
        // Known host, but V0 has nothing to serve for it yet.
        console.info(`Hôte connu sans cible en V0 : ${host} (type ${domain.type}).`);
      }
    } catch (error) {
      console.error(`Recherche du domaine « ${host} » impossible.`, error);
    }
  }

  notFound();
}

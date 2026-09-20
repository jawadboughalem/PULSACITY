import type { Metadata } from 'next';

import { SectionBand } from '@/components/sections/section-band';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SectionTitle } from '@/components/ui/section-title';
import { TextLink } from '@/components/ui/text-link';
import { loadSite } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Commande indisponible',
  robots: { index: false, follow: false },
};

/**
 * Shown when the payment link cannot be created.
 *
 * System copy, not offer copy: it says what happened and what to do, and holds
 * true whatever is being sold. It stays in the page rather than in `content/`.
 */
export default function CommandeIndisponiblePage() {
  const site = loadSite();

  return (
    <>
      <SiteHeader />
      <main>
        <SectionBand tone="ground" divided={false} width="narrow">
          <div className="flex flex-col gap-6">
            <SectionTitle as="h1" className="text-display max-w-[18ch]">
              La commande est momentanément indisponible
            </SectionTitle>
            <p className="text-lead text-ink-muted">
              Rien n’a été débité. Réessayez dans quelques instants.
            </p>
            {site.contact.email ? (
              <p className="text-ink-muted text-body">
                Vous pouvez aussi m’écrire à{' '}
                <TextLink href={`mailto:${site.contact.email}`}>{site.contact.email}</TextLink>.
              </p>
            ) : null}
            <TextLink href="/" className="text-body-sm mt-2">
              ← Retour à l’accueil
            </TextLink>
          </div>
        </SectionBand>
      </main>
      <SiteFooter />
    </>
  );
}

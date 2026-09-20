import { SectionBand } from '@/components/sections/section-band';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Prose } from '@/components/ui/prose';
import { TextLink } from '@/components/ui/text-link';
import { renderLegalDocument, type LegalSlug } from '@/lib/legal';

/**
 * Shared shell for /mentions-legales, /confidentialite and /cgv.
 *
 * Set on `measure`, the narrowest column: these are the only pages read line
 * after line rather than scanned. They carry the header and the footer like
 * every other page — a legal page reached from a search result used to be a
 * dead end with no way back into the site.
 *
 * The arrow is a character, not an icon: the charter's list of icon uses is
 * closed, and a back link does not need one.
 */
export function LegalPage({ slug }: { slug: LegalSlug }) {
  const { html } = renderLegalDocument(slug);

  return (
    <>
      <SiteHeader />
      <main>
        <SectionBand tone="ground" divided={false} width="measure">
          <div className="flex flex-col gap-8">
            <TextLink href="/" className="text-body-sm">
              ← Retour à l’accueil
            </TextLink>
            {/* The Markdown is repository content, rendered at build time. */}
            <Prose html={html} />
          </div>
        </SectionBand>
      </main>
      <SiteFooter />
    </>
  );
}

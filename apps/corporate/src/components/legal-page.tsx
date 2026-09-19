import Link from 'next/link';

import { renderLegalDocument, type LegalSlug } from '@/lib/legal';

/** Shared shell for /mentions-legales, /confidentialite and /cgv. */
export function LegalPage({ slug }: { slug: LegalSlug }) {
  const { html } = renderLegalDocument(slug);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14">
      <Link href="/" className="text-accent text-sm underline underline-offset-2">
        ← Retour à l&apos;accueil
      </Link>
      <article
        className="legal-prose mt-8"
        // The Markdown is repository content, rendered at build time.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}

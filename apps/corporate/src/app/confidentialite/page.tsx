import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal-page';
import { renderLegalDocument } from '@/lib/legal';

export function generateMetadata(): Metadata {
  const { title } = renderLegalDocument('confidentialite');
  return { title, alternates: { canonical: '/confidentialite' } };
}

export default function Page() {
  return <LegalPage slug="confidentialite" />;
}

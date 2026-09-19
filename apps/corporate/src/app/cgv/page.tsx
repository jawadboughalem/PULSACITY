import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal-page';
import { renderLegalDocument } from '@/lib/legal';

export function generateMetadata(): Metadata {
  const { title } = renderLegalDocument('cgv');
  return { title, alternates: { canonical: '/cgv' } };
}

export default function Page() {
  return <LegalPage slug="cgv" />;
}

import { Plus } from 'lucide-react';

import type { Section } from '@/lib/lines';

import { SectionShell } from './section-shell';

type Faq = Extract<Section, { type: 'faq' }>;

export function FaqSection({ section }: { section: Faq }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: section.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <SectionShell id="faq" title={section.title} width="narrow">
      <ul className="divide-line border-line divide-y border-y">
        {section.items.map((item) => (
          <li key={item.question}>
            <details className="group py-5">
              <summary className="text-ink flex cursor-pointer list-none items-start justify-between gap-6 font-medium marker:content-none">
                {item.question}
                <Plus
                  aria-hidden="true"
                  className="text-ink-faint mt-1 size-4 shrink-0 transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="text-ink-muted mt-3 pr-10">{item.answer}</p>
            </details>
          </li>
        ))}
      </ul>

      <script
        type="application/ld+json"
        // Built from the same list the page renders, so the two cannot drift.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </SectionShell>
  );
}

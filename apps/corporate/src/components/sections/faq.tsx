import { Disclosure } from '@/components/ui/disclosure';
import { SectionTitle } from '@/components/ui/section-title';
import type { Section } from '@/lib/lines';

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
    <div className="gap-title flex flex-col">
      <SectionTitle>{section.title}</SectionTitle>
      <ul className="divide-line border-line divide-y border-y">
        {section.items.map((item) => (
          <li key={item.question}>
            <Disclosure summary={item.question}>{item.answer}</Disclosure>
          </li>
        ))}
      </ul>

      <script
        type="application/ld+json"
        // Built from the same list the page renders, so the two cannot drift.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

import type { Section } from '@/lib/lines';

import { SectionShell } from './section-shell';

type Features = Extract<Section, { type: 'features' }>;

export function FeaturesSection({ section }: { section: Features }) {
  // Without a section title there is no h2 above, so the items take that level:
  // the heading order stays sequential whatever the content declares.
  const ItemHeading = section.title ? 'h3' : 'h2';

  return (
    <SectionShell id="inclus" title={section.title} tinted>
      <ul className="grid gap-10 sm:grid-cols-2">
        {section.items.map((item) => (
          <li key={item.title} className="reveal">
            <ItemHeading className="text-ink text-lg font-semibold">{item.title}</ItemHeading>
            <p className="text-ink-muted mt-2">{item.text}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

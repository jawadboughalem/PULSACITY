import { SectionTitle } from '@/components/ui/section-title';
import type { Section } from '@/lib/lines';

type Features = Extract<Section, { type: 'features' }>;

export function FeaturesSection({ section }: { section: Features }) {
  return (
    <div className="gap-title flex flex-col">
      {section.title ? <SectionTitle>{section.title}</SectionTitle> : null}
      <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {section.items.map((item) => (
          <li key={item.title} className="flex flex-col gap-2">
            <h3 className="text-subtitle text-ink text-balance font-semibold">{item.title}</h3>
            <p className="text-ink-muted text-body">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

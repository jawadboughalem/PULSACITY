import { join } from 'node:path';

import showcaseJson from '../../../content/showcase.json';
import { PhoneFrame } from '@/components/phone-frame';
import { DotList } from '@/components/ui/dot-list';
import { SectionTitle } from '@/components/ui/section-title';
import { TextLink } from '@/components/ui/text-link';
import type { Section } from '@/lib/lines';
import { parseShowcase, toCards } from '@/lib/showcase';

type Showcase = Extract<Section, { type: 'showcase' }>;

/**
 * Real deliveries only.
 *
 * With nothing delivered yet the section does not vanish — that would cost the
 * page its main argument and leave two hairlines touching. It becomes a title
 * page instead, and the sentence it shows comes from the line's content, never
 * from here. A line that declares no `empty` block still renders nothing.
 */
export function ShowcaseSection({ section }: { section: Showcase }) {
  const cards = toCards(parseShowcase(showcaseJson), join(process.cwd(), 'public'));

  if (cards.length === 0) {
    if (!section.empty) return null;

    return (
      <div className="flex flex-col gap-6">
        <SectionTitle className="text-display max-w-[14ch]">{section.title}</SectionTitle>
        <p className="text-lead text-ink-muted max-w-narrow">{section.empty.text}</p>
        <DotList items={section.empty.items} className="mt-2 sm:flex-row sm:flex-wrap sm:gap-x-8" />
      </div>
    );
  }

  return (
    <div className="gap-title flex flex-col">
      <SectionTitle>{section.title}</SectionTitle>
      <ul className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.slug}>
            {card.mobileShot ? (
              <div className="mx-auto w-44 sm:w-full sm:max-w-[15rem]">
                <PhoneFrame src={card.mobileShot} alt={`Le site de ${card.name}, sur téléphone`} />
              </div>
            ) : null}

            <p className="text-ink text-subtitle mt-5 font-semibold">{card.name}</p>
            <p className="text-ink-faint text-caption mt-1">
              {card.sector} · {card.city}
            </p>
            <TextLink href={card.url} external className="text-body-sm mt-2">
              Voir le site
            </TextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

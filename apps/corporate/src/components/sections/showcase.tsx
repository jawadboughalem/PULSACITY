import { join } from 'node:path';

import Image from 'next/image';

import showcaseJson from '../../../content/showcase.json';
import { PhoneFrame } from '@/components/phone-frame';
import type { Section } from '@/lib/lines';
import { parseShowcase, toCards } from '@/lib/showcase';

import { SectionShell } from './section-shell';

type Showcase = Extract<Section, { type: 'showcase' }>;

/** Real deliveries only: with no entry, the section renders nothing at all. */
export function ShowcaseSection({ section }: { section: Showcase }) {
  const cards = toCards(parseShowcase(showcaseJson), join(process.cwd(), 'public'));
  if (cards.length === 0) return null;

  return (
    <SectionShell id="realisations" title={section.title}>
      <ul className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.slug} className="reveal">
            {card.mobileShot ? (
              <div className="mx-auto w-44 sm:w-full sm:max-w-[15rem]">
                <PhoneFrame src={card.mobileShot} alt={`Le site de ${card.name}, sur téléphone`} />
              </div>
            ) : card.desktopShot ? (
              <Image
                src={card.desktopShot}
                alt={`Le site de ${card.name}`}
                width={1280}
                height={800}
                className="border-line h-auto w-full rounded-md border"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            ) : null}

            <p className="text-ink mt-5 font-semibold">{card.name}</p>
            <p className="text-ink-muted mt-0.5 text-sm">
              {card.sector} · {card.city}
            </p>
            <a
              href={card.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-accent-ink mt-2 inline-block text-sm underline underline-offset-4"
            >
              Voir le site
            </a>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

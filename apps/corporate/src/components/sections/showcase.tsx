import { join } from 'node:path';

import Image from 'next/image';

import showcaseJson from '../../../content/showcase.json';
import { parseShowcase, toCards } from '@/lib/showcase';

/**
 * « Sites livrés » — real deliveries only.
 *
 * With no entry in `content/showcase.json`, the section renders nothing at all: an
 * invented reference is worse than an absent section.
 */
export function Showcase() {
  const cards = toCards(parseShowcase(showcaseJson), join(process.cwd(), 'public'));
  if (cards.length === 0) return null;

  return (
    <section id="realisations" className="border-t border-neutral-200">
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Sites livrés
        </h2>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <li
              key={card.slug}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
            >
              {card.desktopShot ? (
                <div className="relative border-b border-neutral-200 bg-neutral-50">
                  <Image
                    src={card.desktopShot}
                    alt={`Page d'accueil du site de ${card.name}, sur ordinateur`}
                    width={1280}
                    height={800}
                    className="h-auto w-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {card.mobileShot ? (
                    <Image
                      src={card.mobileShot}
                      alt={`Le même site sur téléphone`}
                      width={390}
                      height={844}
                      className="absolute bottom-0 right-3 w-[22%] rounded-t-sm border border-neutral-300 shadow-sm"
                      sizes="120px"
                    />
                  ) : null}
                </div>
              ) : null}

              <div className="p-5">
                <p className="font-medium text-neutral-900">{card.name}</p>
                <p className="mt-0.5 text-sm text-neutral-600">
                  {card.sector} · {card.city}
                </p>
                <a
                  href={card.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-accent mt-3 inline-block text-sm underline underline-offset-2"
                >
                  Voir le site
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

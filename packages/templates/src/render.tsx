/**
 * Generic minimal site template.
 *
 * V0 renders every demo with this one template. Trade-specific templates arrive in
 * S2 and will replace this function without changing the `SiteContent` contract.
 */
import type { ReactElement } from 'react';

import type { SiteContent } from './content';

export interface RenderableSite {
  name: string;
  city?: string | null;
  content: SiteContent;
}

/** Builds a `tel:` href from a displayed phone number. */
export function telHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}

function Stars({ rating }: { rating: number }): ReactElement {
  return (
    <span aria-label={`${rating} sur 5`} className="text-sm tracking-widest text-amber-600">
      {'★'.repeat(rating)}
      <span className="text-neutral-300">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }): ReactElement {
  return (
    <section className="border-t border-neutral-200 py-10">
      <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function renderSite(site: RenderableSite): ReactElement {
  const { name, city, content } = site;
  const hasContact = Boolean(content.phone ?? content.address ?? content.mapsUrl);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-20">
      <header className="py-12">
        <p className="text-sm font-medium text-neutral-500">{city ?? null}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          {name}
        </h1>
        <p className="mt-4 text-lg text-neutral-700">{content.headline}</p>
        <p className="mt-3 whitespace-pre-line text-neutral-600">{content.intro}</p>
        {content.phone ? (
          <a
            href={telHref(content.phone)}
            className="mt-6 inline-flex items-center rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white"
          >
            Appeler le {content.phone}
          </a>
        ) : null}
      </header>

      {content.services.length > 0 ? (
        <Section title="Prestations">
          <ul className="grid gap-3 sm:grid-cols-2">
            {content.services.map((service) => (
              <li key={service.name} className="rounded-lg border border-neutral-200 p-4">
                <p className="font-medium text-neutral-900">{service.name}</p>
                {service.description ? (
                  <p className="mt-1 text-sm text-neutral-600">{service.description}</p>
                ) : null}
                {service.price ? (
                  <p className="mt-2 text-sm font-medium text-neutral-900">{service.price}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {content.openingHours.length > 0 ? (
        <Section title="Horaires">
          <dl className="divide-y divide-neutral-100 text-sm">
            {content.openingHours.map((entry) => (
              <div key={entry.day} className="flex justify-between py-2">
                <dt className="text-neutral-600">{entry.day}</dt>
                <dd className="font-medium text-neutral-900">{entry.hours}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {hasContact ? (
        <Section title="Contact et accès">
          <div className="space-y-2 text-sm text-neutral-700">
            {content.phone ? (
              <p>
                Téléphone :{' '}
                <a className="font-medium text-neutral-900 underline" href={telHref(content.phone)}>
                  {content.phone}
                </a>
              </p>
            ) : null}
            {content.address ? <p>{content.address}</p> : null}
            {content.mapsUrl ? (
              <p>
                <a
                  className="font-medium text-neutral-900 underline"
                  href={content.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Voir sur Google Maps
                </a>
              </p>
            ) : null}
          </div>
        </Section>
      ) : null}

      {content.reviews.length > 0 ? (
        <Section title="Avis">
          <ul className="space-y-4">
            {content.reviews.map((review, index) => (
              <li
                key={`${review.author}-${index}`}
                className="rounded-lg border border-neutral-200 p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-medium text-neutral-900">{review.author}</p>
                  <Stars rating={review.rating} />
                </div>
                <p className="mt-2 text-sm text-neutral-600">{review.text}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {content.faq.length > 0 ? (
        <Section title="Questions fréquentes">
          <ul className="space-y-3">
            {content.faq.map((entry) => (
              <li key={entry.question}>
                <details className="rounded-lg border border-neutral-200 p-4">
                  <summary className="cursor-pointer font-medium text-neutral-900">
                    {entry.question}
                  </summary>
                  <p className="mt-2 text-sm text-neutral-600">{entry.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </article>
  );
}

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
    <span aria-label={`${rating} sur 5`} className="text-accent text-sm tracking-widest">
      {'★'.repeat(rating)}
      <span className="text-line-strong">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }): ReactElement {
  return (
    <section className="border-line border-t py-10">
      <h2 className="text-ink text-xl font-semibold">{title}</h2>
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
        <p className="text-ink-faint text-sm font-medium">{city ?? null}</p>
        <h1 className="text-ink mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{name}</h1>
        <p className="text-ink-muted mt-4 text-lg">{content.headline}</p>
        <p className="text-ink-muted mt-3 whitespace-pre-line">{content.intro}</p>
        {content.phone ? (
          <a
            href={telHref(content.phone)}
            className="bg-ink text-ground mt-6 inline-flex items-center rounded-md px-4 py-2.5 text-sm font-medium"
          >
            Appeler le {content.phone}
          </a>
        ) : null}
      </header>

      {content.services.length > 0 ? (
        <Section title="Prestations">
          <ul className="grid gap-3 sm:grid-cols-2">
            {content.services.map((service) => (
              <li key={service.name} className="border-line rounded-lg border p-4">
                <p className="text-ink font-medium">{service.name}</p>
                {service.description ? (
                  <p className="text-ink-muted mt-1 text-sm">{service.description}</p>
                ) : null}
                {service.price ? (
                  <p className="text-ink mt-2 text-sm font-medium">{service.price}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {content.openingHours.length > 0 ? (
        <Section title="Horaires">
          <dl className="divide-line divide-y text-sm">
            {content.openingHours.map((entry) => (
              <div key={entry.day} className="flex justify-between py-2">
                <dt className="text-ink-muted">{entry.day}</dt>
                <dd className="text-ink font-medium">{entry.hours}</dd>
              </div>
            ))}
          </dl>
        </Section>
      ) : null}

      {hasContact ? (
        <Section title="Contact et accès">
          <div className="text-ink-muted space-y-2 text-sm">
            {content.phone ? (
              <p>
                Téléphone :{' '}
                <a className="text-ink font-medium underline" href={telHref(content.phone)}>
                  {content.phone}
                </a>
              </p>
            ) : null}
            {content.address ? <p>{content.address}</p> : null}
            {content.mapsUrl ? (
              <p>
                <a
                  className="text-ink font-medium underline"
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
              <li key={`${review.author}-${index}`} className="border-line rounded-lg border p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-ink font-medium">{review.author}</p>
                  <Stars rating={review.rating} />
                </div>
                <p className="text-ink-muted mt-2 text-sm">{review.text}</p>
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
                <details className="border-line rounded-lg border p-4">
                  <summary className="text-ink cursor-pointer font-medium">
                    {entry.question}
                  </summary>
                  <p className="text-ink-muted mt-2 text-sm">{entry.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </article>
  );
}

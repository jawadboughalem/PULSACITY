import Link from 'next/link';

import { Wordmark } from '@/components/wordmark';
import { VAT_FRANCHISE_NOTICE } from '@/lib/pricing';
import { legalIdentity, vatMode } from '@/lib/server-env';
import { loadSite } from '@/lib/site-content';

/** Contact and footer. Anything the content file leaves empty is simply absent. */
export function SiteFooter() {
  const site = loadSite();
  const identity = legalIdentity();
  const showVatNotice = vatMode() === 'franchise';

  return (
    <footer id="contact" className="border-line bg-surface border-t">
      <div className="mx-auto w-full max-w-5xl px-4 py-16">
        <h2 className="text-title text-ink font-semibold">Contact</h2>

        {site.founderFirstName ? (
          <p className="text-ink-muted mt-3">
            {site.founderFirstName}, derrière {site.brand}.
          </p>
        ) : null}

        {site.contact.email || site.contact.phone ? (
          <ul className="mt-4 space-y-1.5">
            {site.contact.email ? (
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-accent-ink underline underline-offset-4"
                >
                  {site.contact.email}
                </a>
              </li>
            ) : null}
            {site.contact.phone ? (
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/[^\d+]/g, '')}`}
                  className="text-accent-ink underline underline-offset-4"
                >
                  {site.contact.phone}
                </a>
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="border-line text-ink-muted mt-12 flex flex-col gap-4 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <Wordmark className="text-sm" />
            {identity.name ? <p>{identity.name}</p> : null}
            {showVatNotice ? <p>{VAT_FRANCHISE_NOTICE}</p> : null}
          </div>

          {site.legalLinks.length > 0 ? (
            <nav aria-label="Informations légales">
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {site.legalLinks.map((link, index) => (
                  <li key={link.href} className="flex items-center gap-3">
                    {index > 0 ? <span aria-hidden="true">·</span> : null}
                    <Link href={link.href} className="hover:text-ink hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

import { Logo } from '@/components/wordmark';
import { Container } from '@/components/ui/container';
import { Divider } from '@/components/ui/divider';
import { SectionTitle } from '@/components/ui/section-title';
import { Surface } from '@/components/ui/surface';
import { TextLink } from '@/components/ui/text-link';
import { VAT_FRANCHISE_NOTICE } from '@/lib/pricing';
import { legalIdentity, vatMode } from '@/lib/server-env';
import { loadSite } from '@/lib/site-content';

/**
 * Contact and footer. Anything the content file leaves empty is simply absent.
 *
 * On the paper, not on a raised surface: the inked call to action just above has
 * to stay the last strong note, and the footer has to recede behind it. The
 * wordmark here does not pulse — one pulse per screen.
 */
export function SiteFooter() {
  const site = loadSite();
  const identity = legalIdentity();
  const showVatNotice = vatMode() === 'franchise';

  return (
    <Surface as="footer" id="contact" tone="ground">
      <Container>
        <Divider />
        <div className="py-section-tight gap-title flex flex-col">
          <SectionTitle>Contact</SectionTitle>

          <div className="flex flex-col gap-4">
            {site.founderFirstName ? (
              <p className="text-ink-muted text-body">
                {site.founderFirstName}, derrière {site.brand}.
              </p>
            ) : null}

            {site.contact.email || site.contact.phone ? (
              <ul className="flex flex-col gap-2">
                {site.contact.email ? (
                  <li className="flex items-center gap-2.5">
                    <Mail aria-hidden="true" className="text-ink-faint size-5 shrink-0" />
                    <TextLink href={`mailto:${site.contact.email}`}>{site.contact.email}</TextLink>
                  </li>
                ) : null}
                {site.contact.phone ? (
                  <li className="flex items-center gap-2.5">
                    <Phone aria-hidden="true" className="text-ink-faint size-5 shrink-0" />
                    <TextLink href={`tel:${site.contact.phone.replace(/[^\d+]/g, '')}`}>
                      {site.contact.phone}
                    </TextLink>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            <Divider />
            <div className="text-ink-faint text-caption flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <Logo
                  className="text-ink-muted"
                  markClassName="size-5"
                  wordmarkClassName="text-caption"
                />
                {identity.name ? <p>{identity.name}</p> : null}
                {showVatNotice ? <p>{VAT_FRANCHISE_NOTICE}</p> : null}
              </div>

              {site.legalLinks.length > 0 ? (
                <nav aria-label="Informations légales">
                  <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {site.legalLinks.map((link, index) => (
                      <li key={link.href} className="flex items-center gap-3">
                        {index > 0 ? <span aria-hidden="true">·</span> : null}
                        <Link
                          href={link.href}
                          className="hover:text-ink transition-colors duration-[var(--duration-fast)] ease-out hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </Surface>
  );
}

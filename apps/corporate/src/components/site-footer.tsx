import Link from 'next/link';

import { VAT_FRANCHISE_NOTICE } from '@/lib/pricing';
import { contactDetails, legalIdentity, vatMode } from '@/lib/server-env';

const LEGAL_LINKS = [
  { href: '/mentions-legales', label: 'Mentions légales' },
  { href: '/confidentialite', label: 'Confidentialité' },
  { href: '/cgv', label: 'CGV' },
];

/** Contact block and footer. Anything not configured is simply absent. */
export function SiteFooter() {
  const contact = contactDetails();
  const identity = legalIdentity();
  const showVatNotice = vatMode() === 'franchise';

  return (
    <footer id="contact" className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-14">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">Contact</h2>

        {contact.email || contact.phone ? (
          <ul className="mt-4 space-y-1.5 text-neutral-700">
            {contact.email ? (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-accent underline underline-offset-2"
                >
                  {contact.email}
                </a>
              </li>
            ) : null}
            {contact.phone ? (
              <li>
                <a
                  href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`}
                  className="text-accent underline underline-offset-2"
                >
                  {contact.phone}
                </a>
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-6 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-semibold tracking-[0.18em] text-neutral-900">PULSACITY</p>
            {identity.name ? <p>{identity.name}</p> : null}
            {showVatNotice ? <p>{VAT_FRANCHISE_NOTICE}</p> : null}
          </div>

          <nav aria-label="Informations légales">
            <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {LEGAL_LINKS.map((link, index) => (
                <li key={link.href} className="flex items-center gap-3">
                  {index > 0 ? <span aria-hidden="true">·</span> : null}
                  <Link href={link.href} className="hover:text-neutral-900 hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

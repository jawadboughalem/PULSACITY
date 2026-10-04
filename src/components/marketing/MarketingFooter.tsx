import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { MARKETING_PATHS } from "./marketing-paths";

const FOOTER_LINKS = [
  { href: MARKETING_PATHS.legalNotice, label: "Mentions légales" },
  { href: MARKETING_PATHS.terms, label: "CGU" },
  { href: MARKETING_PATHS.salesTerms, label: "CGV" },
  { href: MARKETING_PATHS.privacy, label: "Confidentialité" },
  { href: MARKETING_PATHS.cookies, label: "Cookies" },
  { href: MARKETING_PATHS.contact, label: "Contact" },
] as const;

/** The year of the build: the site is rebuilt at every release. */
const COPYRIGHT_YEAR = new Date().getFullYear();

/** Maquette 7: Encre, the logo made for it, the legal links. One row on a computer, two columns on a phone. */
export const MarketingFooter = () => (
  <footer className="bg-ink-900 text-white">
    <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-page-gutter py-7 desktop:gap-3">
      <BrandLogo variant="regular" height={32} alt="Pulsacity" isOnInk isPriority={false} className="self-start" />
      <div className="flex flex-col gap-5 desktop:flex-row-reverse desktop:items-center desktop:justify-between">
        <nav aria-label="Informations légales">
          <ul className="grid grid-cols-2 gap-x-5 desktop:flex desktop:gap-6">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex min-h-[44px] items-center text-small text-white underline underline-offset-[3px] hover:text-hairline-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-small">{`© ${COPYRIGHT_YEAR} PULSACITY`}</p>
      </div>
    </div>
  </footer>
);

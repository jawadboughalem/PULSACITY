import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { FOCUS_RING_ON_INK } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
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

/**
 * Charte v2, Pied de page: Encre, padding 56 80 48 (40 20 32 on a phone), the dark logo at 32, the legal links in white
 * 15/22 underlined, in a 44 zone; one row on a computer, two columns on a phone.
 */
export const MarketingFooter = () => (
  <footer className="bg-ink px-page-gutter pt-9 pb-8 text-white desktop:pt-11 desktop:pb-10">
    <div className="mx-auto flex max-w-content flex-col gap-8 desktop:gap-9">
      <BrandLogo variant="regular" height={32} alt="Pulsacity" isOnInk isPriority={false} className="self-start" />
      <div className="flex flex-col gap-8 desktop:flex-row-reverse desktop:items-center desktop:justify-between">
        <nav aria-label="Informations légales">
          <ul className="grid grid-cols-2 gap-x-6 desktop:flex desktop:gap-7">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "pz-couleur inline-flex min-h-[44px] items-center text-small text-white underline decoration-1 underline-offset-4 hover:decoration-2",
                    FOCUS_RING_ON_INK,
                  )}
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

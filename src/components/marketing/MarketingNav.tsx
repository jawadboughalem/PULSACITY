"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { MARKETING_PATHS } from "./marketing-paths";

/** Maquettes 7, 8, 21 to 24 (4 October): the sections of the site, then the space. */
const NAV_LINKS = [
  { href: MARKETING_PATHS.integrations, label: "Intégrations" },
  { href: MARKETING_PATHS.pricing, label: "Tarifs" },
  { href: MARKETING_PATHS.guides, label: "Guides" },
  { href: MARKETING_PATHS.signIn, label: "Se connecter" },
] as const;

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

/** The section of the page is underlined and announced: « Intégrations » on /integrations/systeme-io too. */
const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

/** Four links and « Créer mon espace gratuit » on a computer; on a phone, a menu over a veil of Encre (m24). */
export const MarketingNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <nav aria-label="Site" className="hidden items-center gap-6 desktop:flex">
        <ul className="flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isPage = isCurrent(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isPage ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-[44px] items-center text-body font-medium text-ink-900 underline-offset-[6px] hover:underline",
                    isPage && "underline",
                    FOCUS_RING,
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href={MARKETING_PATHS.signUp} className={SECONDARY_BUTTON_CLASSES}>
          Créer mon espace gratuit
        </Link>
      </nav>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        className={cn("-mr-3 flex size-[44px] items-center justify-center text-ink-900 desktop:hidden", FOCUS_RING)}
      >
        <Icon name={isOpen ? "close" : "menu"} size={24} />
      </button>

      {isOpen ? (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
          className="fixed inset-x-[0] top-[60px] bottom-[0] z-10 bg-[rgba(22,33,62,0.48)] desktop:hidden"
        />
      ) : null}
      <nav
        id={menuId}
        aria-label="Site"
        hidden={!isOpen}
        className="absolute inset-x-[0] top-full z-20 bg-white px-page-gutter pt-2 pb-5 desktop:hidden"
      >
        <ul className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-hairline-200 last:border-b-[0]">
              <Link
                href={link.href}
                onClick={close}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-[56px] items-center font-serif text-quote text-ink-900 underline-offset-[6px] aria-[current=page]:font-medium aria-[current=page]:underline",
                  FOCUS_RING,
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={MARKETING_PATHS.signUp} onClick={close} className={cn(PRIMARY_BUTTON_CLASSES, "mt-5 h-[56px] w-full")}>
          Créer mon espace gratuit
        </Link>
      </nav>
    </>
  );
};

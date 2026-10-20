"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { SignUpLink } from "@/components/acquisition/SignUpLink";
import {
  FOCUS_RING,
  ICON_BUTTON_CLASSES,
  PRIMARY_BUTTON_CLASSES,
  SECONDARY_BUTTON_CLASSES,
} from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { FREE_MENTION } from "./CallToAction";
import { MARKETING_PATHS } from "./marketing-paths";

/** The sections of the site, then the space (charte v2, Navigation). */
const NAV_LINKS = [
  { href: MARKETING_PATHS.integrations, label: "Intégrations" },
  { href: MARKETING_PATHS.pricing, label: "Tarifs" },
  { href: MARKETING_PATHS.guides, label: "Guides" },
  { href: MARKETING_PATHS.signIn, label: "Se connecter" },
] as const;

/**
 * Liens d'une rubrique: Figtree 600 17 in a 44 zone. The current page is underlined 3 px (aria-current), a hovered one
 * turns Encre 800 and is underlined 2 px.
 */
const SECTION_LINK_CLASSES = `pz-couleur inline-flex min-h-[44px] items-center text-body font-semibold text-ink hover:text-ink-800 hover:shadow-[inset_0_-2px_0_var(--color-ink-800)] aria-[current=page]:shadow-[inset_0_-3px_0_var(--color-ink)] ${FOCUS_RING}`;

/**
 * A row of the phone's menu (maquettes 3.5, Menu du téléphone): Bricolage 22 on 56, 4 apart, its Ciel reaching 8 px
 * beyond the panel's text; the current page on Ciel.
 */
const MENU_ROW_CLASSES = `pz-couleur -mx-2 flex min-h-[56px] items-center justify-between gap-4 rounded-field px-4 font-display text-h3 text-ink hover:bg-sky aria-[current=page]:bg-sky ${FOCUS_RING}`;

/** The section of the page is underlined and announced: « Intégrations » on /integrations/systeme-io too. */
const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

/**
 * Four links and « Créer mon espace gratuit » on a computer; on a phone, a menu under the header, its bottom corners
 * of 28, over an Encre veil of 48 % (charte v2, ajouts 3.5, Menu du téléphone), its call followed by « Gratuit, sans
 * carte bancaire. » as everywhere on the site.
 */
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
      <nav aria-label="Site" className="hidden items-center gap-7 desktop:flex">
        <ul className="flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                className={SECTION_LINK_CLASSES}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <SignUpLink place="en-tete" className={SECONDARY_BUTTON_CLASSES}>
          Créer mon espace gratuit
        </SignUpLink>
      </nav>

      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setIsOpen((wasOpen) => !wasOpen)}
        className={cn(ICON_BUTTON_CLASSES, "-mr-3 desktop:hidden")}
      >
        <Icon name={isOpen ? "close" : "menu"} size={24} />
      </button>

      {isOpen ? (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
          className="fixed inset-x-[0] top-[64px] bottom-[0] z-10 cursor-default bg-[rgba(22,33,62,0.48)] desktop:hidden"
        />
      ) : null}
      <nav
        id={menuId}
        aria-label="Site"
        hidden={!isOpen}
        data-defilement-bloque={isOpen}
        className="absolute top-full -right-page-gutter -left-page-gutter z-20 rounded-b-[28px] bg-white px-5 pt-2 pb-6 desktop:hidden"
      >
        <ul className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={close}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                className={MENU_ROW_CLASSES}
              >
                {link.label}
                <Icon name="chevronRight" size={20} />
              </Link>
            </li>
          ))}
        </ul>
        <SignUpLink place="menu" onClick={close} className={cn(PRIMARY_BUTTON_CLASSES, "mt-4 w-full")}>
          Créer mon espace gratuit
        </SignUpLink>
        <p className="mt-2 text-center text-small text-gray">{FREE_MENTION}</p>
      </nav>
    </>
  );
};

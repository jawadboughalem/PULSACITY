"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { MARKETING_PATHS } from "./marketing-paths";

const NAV_LINKS = [
  { href: MARKETING_PATHS.howItWorks, label: "Fonctionnement" },
  { href: MARKETING_PATHS.pricing, label: "Tarifs" },
  { href: MARKETING_PATHS.questions, label: "Questions" },
  { href: MARKETING_PATHS.signIn, label: "Se connecter" },
] as const;

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

/** The page's own link is underlined and announced, like « Tarifs » on maquette 8. */
const isCurrent = (pathname: string, href: string) => !href.includes("#") && pathname === href;

/** Maquettes 7 and 8: four links and « Créer mon espace gratuit » on a computer; a menu behind one button on a phone. */
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

      <nav
        id={menuId}
        aria-label="Site"
        hidden={!isOpen}
        className="absolute inset-x-[0] top-full z-20 border-b border-hairline-200 bg-white px-page-gutter pt-2 pb-5 shadow-float desktop:hidden"
      >
        <ul className="flex flex-col">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="border-b border-hairline-200">
              <Link
                href={link.href}
                onClick={close}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "flex min-h-[48px] items-center text-body font-medium text-ink-900 aria-[current=page]:font-semibold",
                  FOCUS_RING,
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={MARKETING_PATHS.signUp} onClick={close} className={cn(PRIMARY_BUTTON_CLASSES, "mt-5 w-full")}>
          Créer mon espace gratuit
        </Link>
      </nav>
    </>
  );
};

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { DESKTOP_SECTIONS, TESTIMONIALS_SECTION_HREF, isSectionActive } from "./space-sections";

type SpaceNavigationLinksProps = {
  pendingTestimonials: number;
};

/**
 * Links of 48, a pill, the icon 24 at 12 px, Figtree 600 17. The current page on Soleil in 700, a hovered one on Ciel.
 * « Témoignages » carries the number waiting for validation: Corail, Encre text.
 */
export const SpaceNavigationLinks = ({ pendingTestimonials }: SpaceNavigationLinksProps) => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-1">
      {DESKTOP_SECTIONS.map((section) => {
        const isActive = isSectionActive(section, pathname);
        return (
          <li key={section.label}>
            <Link
              href={section.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "pz-couleur flex h-[48px] items-center gap-3 rounded-full px-4 text-body text-ink",
                isActive ? "bg-sun font-bold" : "font-semibold hover:bg-sky",
                FOCUS_RING,
              )}
            >
              <Icon name={section.icon} size={24} />
              {section.label}
              {section.href === TESTIMONIALS_SECTION_HREF && pendingTestimonials > 0 ? (
                <span
                  aria-label={`${pendingTestimonials} en attente`}
                  className="ml-auto flex h-[26px] min-w-[26px] items-center justify-center rounded-full bg-coral px-2 text-badge font-bold text-ink"
                >
                  {pendingTestimonials}
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

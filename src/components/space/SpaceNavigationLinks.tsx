"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { DESKTOP_SECTIONS, TESTIMONIALS_SECTION_HREF, isSectionActive } from "./space-sections";

type SpaceNavigationLinksProps = {
  pendingTestimonials: number;
};

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
                "flex h-[44px] items-center gap-3 rounded-sm px-3 text-small text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
                isActive ? "bg-paper-100 font-semibold" : "hover:bg-paper-100",
              )}
            >
              <Icon name={section.icon} size={20} />
              {section.label}
              {section.href === TESTIMONIALS_SECTION_HREF && pendingTestimonials > 0 ? (
                <span
                  aria-label={`${pendingTestimonials} en attente`}
                  className="ml-auto flex h-[24px] min-w-[24px] items-center justify-center rounded-full bg-attention-surface px-2 text-legal font-semibold text-attention"
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { MOBILE_SECTIONS, isSectionActive } from "./space-sections";

/**
 * Charte v2, the space on a phone: a fixed tab bar of 84 (24 of it for the safe zone), white with its soft shadow, no
 * rule. Four tabs of 56: the icon 24 in a 56 × 32 pill, Soleil for the current one; the label 13/18.
 */
export const SpaceTabBar = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-[0] bottom-[0] z-20 flex h-tab-bar bg-white px-2 pt-1 pb-6 shadow-tab-bar"
    >
      {MOBILE_SECTIONS.map((section) => {
        const isActive = isSectionActive(section, pathname);
        return (
          <Link
            key={section.label}
            href={section.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-field text-legal",
              isActive ? "font-bold text-ink" : "font-semibold text-gray",
              FOCUS_RING,
            )}
          >
            <span
              className={cn(
                "pz-couleur flex h-[32px] w-[56px] items-center justify-center rounded-full",
                isActive && "bg-sun text-ink",
              )}
            >
              <Icon name={section.icon} size={24} />
            </span>
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
};

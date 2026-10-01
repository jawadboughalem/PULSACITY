"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { MOBILE_SECTIONS, isSectionActive } from "./space-sections";

export const SpaceTabBar = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-[0] bottom-[0] flex h-[84px] border-t border-hairline-200 bg-white px-2 pt-1 pb-5"
    >
      {MOBILE_SECTIONS.map((section) => {
        const isActive = isSectionActive(section, pathname);
        return (
          <Link
            key={section.label}
            href={section.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-legal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900",
              isActive ? "font-semibold text-ink-900" : "text-slate-600",
            )}
          >
            <Icon name={section.icon} size={24} />
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
};

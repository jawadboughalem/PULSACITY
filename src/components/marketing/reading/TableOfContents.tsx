"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { pickCurrentHeading } from "@/lib/content/pick-current-heading";
import type { TextHeading } from "@/lib/content/text-headings";
import { cn } from "@/lib/cn";

const useCurrentHeading = (headings: TextHeading[]): string | null => {
  const [currentId, setCurrentId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const positions = headings.flatMap((heading) => {
        const element = document.getElementById(heading.id);
        return element ? [{ id: heading.id, top: element.getBoundingClientRect().top }] : [];
      });
      setCurrentId(
        pickCurrentHeading(positions, {
          height: window.innerHeight,
          isAtEnd: window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2,
          hash: decodeURIComponent(window.location.hash),
        }),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  return currentId;
};

type TableOfContentsProps = {
  /** « Dans ce guide », « Sur cette page » */
  title: string;
  headings: TextHeading[];
  /**
   * Charte v2, ajouts 3.5, Lecture: on a white plate, the title being read on a Ciel pill (« À propos de ces avis »).
   * The guides and the legal texts keep the v1 look until lot 4.7.
   */
  isPlate?: boolean;
};

const LINK_CLASSES = cn("pz-couleur block py-1 text-small decoration-2 underline-offset-4 hover:underline", FOCUS_RING);

/**
 * m22 and m23 on a computer: the titles of the text beside it, the one being read marked on its left by 3 px of Encre,
 * like the current page of the navigation (charte v2). Stays in view below the sticky header (88) while the text scrolls.
 * Links of Next, not plain anchors: Back from another page then brings this one back, at its title.
 */
export const TableOfContents = ({ title, headings, isPlate = false }: TableOfContentsProps) => {
  const currentId = useCurrentHeading(headings);
  return (
    <nav
      aria-label={title}
      className={cn("sticky top-[112px] flex flex-col gap-4", isPlate && "gap-3 rounded-panel bg-white p-6")}
    >
      <p className="text-small font-bold">{title}</p>
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => {
          const isCurrent = heading.id === currentId;
          return (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                aria-current={isCurrent ? "location" : undefined}
                className={cn(
                  LINK_CLASSES,
                  isPlate ? "rounded-field px-3 py-2" : "pl-4",
                  isCurrent && !isPlate && "font-bold shadow-[inset_3px_0_0_var(--color-ink)]",
                  isCurrent && isPlate && "bg-sky font-bold",
                )}
              >
                {heading.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

/** m22 and m23 on a phone: the same titles, folded under the introduction, in a card on Nuage (charte v2: no rules). */
export const FoldedTableOfContents = ({ title, headings, isPlate = false }: TableOfContentsProps) => (
  <details className={cn("group rounded-card px-4", isPlate ? "bg-white" : "bg-cloud")}>
    <summary
      className={cn(
        "flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 text-body font-bold [&::-webkit-details-marker]:hidden",
        FOCUS_RING,
      )}
    >
      {title}
      <Icon name="chevronDown" size={20} className="shrink-0 group-open:rotate-180" />
    </summary>
    <nav aria-label={title} className="pb-4">
      <ul className="flex flex-col">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link href={`#${heading.id}`} className={cn(LINK_CLASSES, "flex min-h-[44px] items-center")}>
              {heading.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </details>
);

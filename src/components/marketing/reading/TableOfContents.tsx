"use client";

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
};

const LINK_CLASSES = cn("pz-couleur block py-1 text-small decoration-2 underline-offset-4 hover:underline", FOCUS_RING);

/**
 * m22 and m23 on a computer: the titles of the text beside it, the one being read marked on its left by 3 px of Encre,
 * like the current page of the navigation (charte v2). Stays in view below the sticky header (88) while the text scrolls.
 */
export const TableOfContents = ({ title, headings }: TableOfContentsProps) => {
  const currentId = useCurrentHeading(headings);
  return (
    <nav aria-label={title} className="sticky top-[112px] flex flex-col gap-4">
      <p className="text-small font-bold">{title}</p>
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => {
          const isCurrent = heading.id === currentId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isCurrent ? "location" : undefined}
                className={cn(
                  LINK_CLASSES,
                  "pl-4",
                  isCurrent && "font-bold shadow-[inset_3px_0_0_var(--color-ink)]",
                )}
              >
                {heading.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

/** m22 and m23 on a phone: the same titles, folded under the introduction, in a card on Nuage (charte v2: no rules). */
export const FoldedTableOfContents = ({ title, headings }: TableOfContentsProps) => (
  <details className="group rounded-card bg-cloud px-4">
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
            <a href={`#${heading.id}`} className={cn(LINK_CLASSES, "flex min-h-[44px] items-center")}>
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </details>
);

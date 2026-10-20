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
};

const LINK_CLASSES = cn("pz-couleur block py-1 text-small decoration-2 underline-offset-4 hover:underline", FOCUS_RING);

/**
 * Charte v2, ajouts 3.5, Lecture, on a computer: the titles of the text beside it on a white plate, the one being read
 * on a Ciel pill, in 700. Stays in view below the sticky header (88) while the text scrolls. Links of Next, not plain
 * anchors: Back from another page then brings this one back, at its title.
 */
export const TableOfContents = ({ title, headings }: TableOfContentsProps) => {
  const currentId = useCurrentHeading(headings);
  return (
    <nav aria-label={title} className="sticky top-[112px] flex flex-col gap-3 rounded-panel bg-white p-6">
      <p className="text-small font-bold">{title}</p>
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => {
          const isCurrent = heading.id === currentId;
          return (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                aria-current={isCurrent ? "location" : undefined}
                className={cn(LINK_CLASSES, "rounded-field px-3 py-2", isCurrent && "bg-sky font-bold")}
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

/** On a phone (charte v2, ajouts 3.5, Lecture): the same titles, folded in 56 px under the page's heading, without the title being read. */
export const FoldedTableOfContents = ({ title, headings }: TableOfContentsProps) => (
  <details className="group rounded-card bg-white px-4">
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

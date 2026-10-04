"use client";

import { useEffect, useState } from "react";
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

const LINK_CLASSES =
  "block py-1 text-small hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

/**
 * m22 and m23 on a computer: the titles of the text beside it, the one being read marked by a rule of Encre. Stays in
 * view while the text scrolls.
 */
export const TableOfContents = ({ title, headings }: TableOfContentsProps) => {
  const currentId = useCurrentHeading(headings);
  return (
    <nav aria-label={title} className="sticky top-5 flex flex-col gap-4">
      <p className="text-small font-semibold">{title}</p>
      <ul className="flex flex-col gap-1 border-l border-hairline-200">
        {headings.map((heading) => {
          const isCurrent = heading.id === currentId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isCurrent ? "location" : undefined}
                className={cn(
                  LINK_CLASSES,
                  "-ml-px border-l-2 pl-4",
                  isCurrent ? "border-ink-900 font-semibold" : "border-transparent",
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

/** m22 and m23 on a phone: the same titles, folded under the introduction. */
export const FoldedTableOfContents = ({ title, headings }: TableOfContentsProps) => (
  <details className="group border-y border-hairline-200 border-t-ink-900">
    <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 text-body font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 [&::-webkit-details-marker]:hidden">
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

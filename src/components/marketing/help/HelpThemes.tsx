import Link from "next/link";
import { DISCREET_BUTTON_CLASSES, FOCUS_RING } from "@/components/ui/button-styles";
import { FILTER_CHIP_CLASSES } from "@/components/ui/chip-styles";
import { Icon } from "@/components/ui/Icon";
import type { FaqEntry } from "@/content/faq";
import { findGuide } from "@/content/guides";
import type { HelpTheme } from "@/content/help";
import { cn } from "@/lib/cn";
import { guidePath } from "../marketing-paths";

/** Charte v2, Question dépliable: a white card of 56 at least, the question 17/26 700, the answer under it. */
const HelpQuestion = ({ entry, isOpen }: { entry: FaqEntry; isOpen: boolean }) => (
  <details open={isOpen} className="group rounded-card bg-white">
    <summary
      className={cn(
        "flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 rounded-card px-4 py-3 group-open:min-h-[0] group-open:pt-4 group-open:pb-[0] desktop:px-6 desktop:group-open:pb-4 [&::-webkit-details-marker]:hidden",
        FOCUS_RING,
      )}
    >
      <span className="text-body font-bold">{entry.question}</span>
      <Icon name="chevronDown" size={20} className="group-open:rotate-180" />
    </summary>
    <p className="max-w-text px-4 pb-6 text-body desktop:px-6">{entry.answer}</p>
  </details>
);

/** « Lien de guide sous chaque thème »: the file icon, then the guide's title as a discreet link. */
const GuideLink = ({ slug }: { slug: string }) => {
  const guide = findGuide(slug);
  if (!guide) return null;
  return (
    <p className="flex items-center gap-2">
      <Icon name="file" size={20} />
      <Link href={guidePath(guide.slug)} className={cn(DISCREET_BUTTON_CLASSES, "px-[0]")}>
        {`Guide : ${guide.title}`}
      </Link>
    </p>
  );
};

/**
 * Maquette 8.4: the themes as links at the top, then each theme with its questions and its guide. Only the first answer
 * of the page is open; the others open on demand, without script.
 */
export const HelpThemes = ({ themes }: { themes: HelpTheme[] }) => (
  <div className="flex flex-col gap-8">
    <nav aria-label="Thèmes de l'aide">
      <ul className="flex flex-wrap gap-x-2 gap-y-3">
        {themes.map((theme) => (
          <li key={theme.id}>
            {/* A Link, not a plain anchor: its history entry keeps Next's state, so Back from a guide brings /aide back. */}
            <Link href={`#${theme.id}`} className={FILTER_CHIP_CLASSES}>
              {theme.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
    {themes.map((theme, themeIndex) => (
      <section key={theme.id} id={theme.id} aria-labelledby={`${theme.id}-title`} className="flex scroll-mt-6 flex-col">
        <h2 id={`${theme.id}-title`} className="font-display text-h2">
          {theme.title}
        </h2>
        <div className="mt-3 flex flex-col gap-3">
          {theme.entries.map((entry, entryIndex) => (
            <HelpQuestion key={entry.question} entry={entry} isOpen={themeIndex === 0 && entryIndex === 0} />
          ))}
        </div>
        {theme.guideSlug ? (
          <div className="mt-2">
            <GuideLink slug={theme.guideSlug} />
          </div>
        ) : null}
      </section>
    ))}
  </div>
);

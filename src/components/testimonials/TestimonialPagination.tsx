import Link from "next/link";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

type TestimonialPaginationProps = {
  page: number;
  pageSize: number;
  shownCount: number;
  total: number;
  previousHref: string | null;
  nextHref: string | null;
  /** What is counted: témoignages unless said otherwise. */
  noun?: { singular: string; plural: string };
};

const TESTIMONIAL_NOUN = { singular: "témoignage", plural: "témoignages" };

const DISABLED_BUTTON_CLASSES =
  "inline-flex h-[48px] items-center justify-center rounded-sm border border-hairline-200 bg-paper-100 px-5 text-body font-semibold text-slate-600";

export const TestimonialPagination = ({
  page,
  pageSize,
  shownCount,
  total,
  previousHref,
  nextHref,
  noun = TESTIMONIAL_NOUN,
}: TestimonialPaginationProps) => {
  const first = (page - 1) * pageSize + 1;
  const summary = `${first} à ${first + shownCount - 1} sur ${total} ${total > 1 ? noun.plural : noun.singular}`;

  return (
    <nav aria-label={`Pages de ${noun.plural}`} className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-small text-slate-600">
        <span className="desktop:hidden">{nextHref ? `${summary}. ` : summary}</span>
        <span className="hidden desktop:inline">{summary}</span>
        {nextHref ? (
          <Link
            href={nextHref}
            className="text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 desktop:hidden"
          >
            Afficher les suivants
          </Link>
        ) : null}
      </p>
      {previousHref || nextHref ? (
        <div className="hidden gap-3 desktop:flex">
          {previousHref ? (
            <Link href={previousHref} className={SECONDARY_BUTTON_CLASSES}>
              Précédents
            </Link>
          ) : (
            <span aria-disabled="true" className={DISABLED_BUTTON_CLASSES}>
              Précédents
            </span>
          )}
          {nextHref ? (
            <Link href={nextHref} className={SECONDARY_BUTTON_CLASSES}>
              Suivants
            </Link>
          ) : (
            <span aria-disabled="true" className={cn(DISABLED_BUTTON_CLASSES)}>
              Suivants
            </span>
          )}
        </div>
      ) : null}
    </nav>
  );
};

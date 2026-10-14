import Link from "next/link";
import { INLINE_LINK_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

type TestimonialPaginationProps = {
  page: number;
  pageSize: number;
  shownCount: number;
  total: number;
  previousHref: string | null;
  nextHref: string | null;
};

export const TestimonialPagination = ({
  page,
  pageSize,
  shownCount,
  total,
  previousHref,
  nextHref,
}: TestimonialPaginationProps) => {
  const first = (page - 1) * pageSize + 1;
  const summary = `${first} à ${first + shownCount - 1} sur ${total} ${total > 1 ? "témoignages" : "témoignage"}`;

  return (
    <nav aria-label="Pages de témoignages" className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-small text-gray">
        <span className="desktop:hidden">{nextHref ? `${summary}. ` : summary}</span>
        <span className="hidden desktop:inline">{summary}</span>
        {nextHref ? (
          <Link
            href={nextHref}
            className={cn(INLINE_LINK_CLASSES, "desktop:hidden")}
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
            <span aria-disabled="true" className={SECONDARY_BUTTON_CLASSES}>
              Précédents
            </span>
          )}
          {nextHref ? (
            <Link href={nextHref} className={SECONDARY_BUTTON_CLASSES}>
              Suivants
            </Link>
          ) : (
            <span aria-disabled="true" className={SECONDARY_BUTTON_CLASSES}>
              Suivants
            </span>
          )}
        </div>
      ) : null}
    </nav>
  );
};

import Link from "next/link";
import { FOCUS_RING, INLINE_LINK_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type BackBarProps = {
  href: string;
  label: string;
};

/** Mobile top bar of a page reached from a list: the way back. Charte v2: a white header of 64, no rule under it. */
export const BackBar = ({ href, label }: BackBarProps) => (
  <header className="flex h-[64px] shrink-0 items-center bg-white px-5 desktop:hidden">
    <Link
      href={href}
      className={cn(
        "pz-couleur -ml-1 flex min-h-[44px] items-center gap-2 rounded-full px-1 text-body font-semibold text-ink hover:text-ink-800",
        FOCUS_RING,
      )}
    >
      <Icon name="chevronLeft" size={20} />
      {label}
    </Link>
  </header>
);

type BreadcrumbProps = {
  parentHref: string;
  parentLabel: string;
  current: string;
};

export const Breadcrumb = ({ parentHref, parentLabel, current }: BreadcrumbProps) => (
  <nav aria-label="Fil d'Ariane" className="hidden items-center gap-3 text-small desktop:flex">
    <Link href={parentHref} className={INLINE_LINK_CLASSES}>
      {parentLabel}
    </Link>
    <Icon name="chevronRight" size={16} className="text-gray" />
    <span aria-current="page" className="text-gray">
      {current}
    </span>
  </nav>
);

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

type BackBarProps = {
  href: string;
  label: string;
};

/** Mobile top bar of a page reached from a list: the way back. */
export const BackBar = ({ href, label }: BackBarProps) => (
  <header className="flex h-[60px] shrink-0 items-center border-b border-hairline-200 px-5 desktop:hidden">
    <Link
      href={href}
      className="-ml-1 flex min-h-[44px] items-center gap-2 px-1 text-body font-medium text-carmine hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
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
    <Link
      href={parentHref}
      className="text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
    >
      {parentLabel}
    </Link>
    <Icon name="chevronRight" size={16} className="text-slate-600" />
    <span aria-current="page" className="text-slate-600">
      {current}
    </span>
  </nav>
);

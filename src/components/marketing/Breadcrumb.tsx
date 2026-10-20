import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { buildBreadcrumbData } from "@/lib/seo/structured-data";
import { readSiteUrl } from "@/lib/site-url";
import { JsonLd } from "./JsonLd";
import { MARKETING_PATHS } from "./marketing-paths";
import { BREADCRUMB_LINK_CLASSES } from "./marketing-styles";

type BreadcrumbProps = {
  /** The page above this one: « Intégrations », « Guides ». */
  parent: { href: string; label: string };
  current: string;
};

/**
 * Maquettes 3.5: « Intégrations › Systeme.io », above the title of a tool's page, of a guide. Search engines get the
 * same trail, from the home.
 */
export const Breadcrumb = ({ parent, current }: BreadcrumbProps) => {
  const trail = [
    ...(parent.href === MARKETING_PATHS.home ? [] : [{ name: "Accueil", path: MARKETING_PATHS.home }]),
    { name: parent.label, path: parent.href },
    { name: current },
  ];
  return (
    <nav aria-label="Fil d'Ariane" className="text-small">
      <JsonLd data={buildBreadcrumbData(readSiteUrl(), trail)} />
      <ol className="flex items-center gap-3">
        <li className="shrink-0">
          <Link href={parent.href} className={BREADCRUMB_LINK_CLASSES}>
            {parent.label}
          </Link>
        </li>
        <li aria-hidden="true" className="flex shrink-0 text-gray">
          <Icon name="chevronRight" size={16} />
        </li>
        <li aria-current="page" className="min-w-[0] text-gray">
          {current}
        </li>
      </ol>
    </nav>
  );
};

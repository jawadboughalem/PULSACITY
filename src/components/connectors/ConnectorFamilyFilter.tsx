import Link from "next/link";
import { FILTER_CHIP_CHOSEN_CLASSES, FILTER_CHIP_CLASSES } from "@/components/ui/chip-styles";
import { Icon } from "@/components/ui/Icon";
import { INTEGRATION_FAMILIES, type IntegrationFamilyId } from "@/content/integrations";
import { cn } from "@/lib/cn";

/** The address word of the family filter: /app/connecteurs?famille=rendez-vous. */
export const FAMILY_SEARCH_PARAM = "famille";

export const readFamilyFilter = (value: string | string[] | undefined): IntegrationFamilyId | null =>
  INTEGRATION_FAMILIES.find((family) => family.searchValue === value)?.id ?? null;

const CHIPS = [
  { id: null, label: "Toutes", search: "" },
  ...INTEGRATION_FAMILIES.map((family) => ({
    id: family.id,
    label: family.filterLabel,
    search: `?${FAMILY_SEARCH_PARAM}=${family.searchValue}`,
  })),
];

type ConnectorFamilyFilterProps = {
  href: string;
  current: IntegrationFamilyId | null;
};

/** Maquettes 3.4, Connecteurs: a filter chip per family, « Toutes » first; they wrap on a phone. */
export const ConnectorFamilyFilter = ({ href, current }: ConnectorFamilyFilterProps) => (
  <nav aria-label="Familles d'outils">
    <ul className="flex flex-wrap gap-x-2 gap-y-1">
      {CHIPS.map((chip) => {
        const isCurrent = chip.id === current;
        return (
          <li key={chip.label} className="flex h-[44px] items-center">
            <Link
              href={`${href}${chip.search}`}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(FILTER_CHIP_CLASSES, isCurrent && FILTER_CHIP_CHOSEN_CLASSES)}
            >
              {isCurrent ? <Icon name="check" size={16} /> : null}
              {chip.label}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);

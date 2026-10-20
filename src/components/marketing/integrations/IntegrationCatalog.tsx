"use client";

import { type ReactNode, useState } from "react";
import { FILTER_CHIP_CHOSEN_CLASSES, FILTER_CHIP_CLASSES } from "@/components/ui/chip-styles";
import { INLINE_LINK_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { INTEGRATIONS, INTEGRATION_FAMILIES, type IntegrationFamilyId } from "@/content/integrations";
import { cn } from "@/lib/cn";
import { SITE_GROUP_TITLE_CLASSES } from "../marketing-styles";
import { ToolCard } from "./ToolCard";

const CHIPS: Array<{ id: IntegrationFamilyId | null; label: string }> = [
  { id: null, label: "Toutes" },
  ...INTEGRATION_FAMILIES.map((family) => ({ id: family.id, label: family.filterLabel })),
];

type IntegrationCatalogProps = {
  /** What follows the catalog on /integrations: shown with every family, hidden while one is chosen. */
  after: ReactNode;
};

/**
 * Maquettes 3.5, Intégrations: a filter chip per family, « Toutes » first (charte v2, Pastille de filtre, one choice per
 * group), then the families of connecteurs.md, each with its sentence and its tools in a grid of four. Once a family is
 * chosen, the page shows it alone, with the way back to all of them.
 */
export const IntegrationCatalog = ({ after }: IntegrationCatalogProps) => {
  const [chosen, setChosen] = useState<IntegrationFamilyId | null>(null);
  const families = INTEGRATION_FAMILIES.filter((family) => chosen === null || family.id === chosen);
  return (
    <div className="flex flex-col gap-10 desktop:gap-12">
      <div className="flex flex-col gap-10 desktop:gap-12">
        <div role="group" aria-label="Familles d'outils" className="flex flex-wrap gap-x-2 gap-y-2">
          {CHIPS.map((chip) => {
            const isChosen = chip.id === chosen;
            return (
              <span key={chip.label} className="flex h-[44px] items-center">
                <button
                  type="button"
                  aria-pressed={isChosen}
                  onClick={() => setChosen(chip.id)}
                  className={cn(FILTER_CHIP_CLASSES, isChosen && FILTER_CHIP_CHOSEN_CLASSES)}
                >
                  {isChosen ? <Icon name="check" size={16} /> : null}
                  {chip.label}
                </button>
              </span>
            );
          })}
        </div>
        {families.map((family) => (
          <section key={family.id} aria-labelledby={`family-${family.id}`} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h2 id={`family-${family.id}`} className={SITE_GROUP_TITLE_CLASSES}>
                {family.title}
              </h2>
              <p className="text-body text-gray">{family.text}</p>
            </div>
            <ul className="grid grid-cols-[minmax(0,1fr)] gap-[14px] desktop:grid-cols-4">
              {INTEGRATIONS.filter((integration) => integration.family === family.id).map((integration) => (
                <ToolCard key={integration.slug} integration={integration} />
              ))}
            </ul>
          </section>
        ))}
        <p role="status" className={cn("text-small text-gray", chosen === null && "sr-only")}>
          {chosen === null ? null : (
            <>
              {`1 famille sur ${INTEGRATION_FAMILIES.length} affichée. `}
              <button type="button" onClick={() => setChosen(null)} className={cn(INLINE_LINK_CLASSES, "cursor-pointer font-bold")}>
                Voir toutes les familles
              </button>
            </>
          )}
        </p>
      </div>
      <div hidden={chosen !== null} className="flex flex-col gap-10 desktop:gap-12">
        {after}
      </div>
    </div>
  );
};

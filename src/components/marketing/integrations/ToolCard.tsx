import Link from "next/link";
import { MeanwhileLine } from "@/components/connectors/MeanwhileLine";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { Monogram } from "@/components/ui/Monogram";
import type { Integration } from "@/content/integrations";
import { cn } from "@/lib/cn";
import { integrationPath } from "../marketing-paths";
import { IntegrationBadge } from "./IntegrationBadge";

/**
 * Charte v2, Carte d'outil: white, radius-card, padding 20; the monogram, the name in a link with its chevron, the
 * state, the sentence of connecteurs.md, then « En attendant » for a tool to come. The whole card opens the tool's page;
 * the links of « En attendant » stay above it.
 */
export const ToolCard = ({ integration }: { integration: Integration }) => (
  <li className="group relative flex flex-col gap-4 rounded-card bg-white p-5">
    <div className="flex items-center gap-3">
      <Monogram name={integration.name} />
      <Link
        href={integrationPath(integration.slug)}
        className={cn(
          "pz-couleur min-w-[0] flex-1 text-body font-bold decoration-2 underline-offset-4 group-hover:underline after:absolute after:inset-[0] after:rounded-card after:content-['']",
          FOCUS_RING,
        )}
      >
        {integration.name}
      </Link>
      <Icon name="chevronRight" size={20} className="shrink-0" />
    </div>
    <div className="flex">
      <IntegrationBadge integration={integration} />
    </div>
    <p className="text-small">{integration.summary}</p>
    {integration.status === "soon" ? <MeanwhileLine integration={integration} className="relative" /> : null}
  </li>
);

import Link from "next/link";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { Monogram } from "@/components/ui/Monogram";
import type { Integration } from "@/content/integrations";
import { cn } from "@/lib/cn";
import { integrationPath } from "../marketing-paths";
import { IntegrationBadge } from "./IntegrationBadge";

type ToolPillProps = {
  integration: Integration;
  /** White on the Ciel band of the home's top, Nuage inside the white card of a family. */
  surface: "white" | "cloud";
};

/**
 * Maquettes 3.5, Accueil (sections 2 and 7): a tool in a pill, its monogram in a circle, its name and its state. It
 * opens the tool's page.
 */
export const ToolPill = ({ integration, surface }: ToolPillProps) => (
  <Link
    href={integrationPath(integration.slug)}
    className={cn(
      "pz-couleur group inline-flex min-h-[48px] max-w-full items-center gap-3 rounded-full py-1 pr-3 pl-2",
      surface === "white" ? "bg-white hover:bg-cloud" : "bg-cloud hover:bg-sky",
      FOCUS_RING,
    )}
  >
    <Monogram name={integration.name} className="size-[36px] rounded-full text-[14px]" />
    <span className="min-w-[0] text-body font-bold decoration-2 underline-offset-4 group-hover:underline">
      {integration.name}
    </span>
    <IntegrationBadge integration={integration} />
  </Link>
);

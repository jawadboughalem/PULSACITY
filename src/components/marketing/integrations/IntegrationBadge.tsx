import { ToneBadge } from "@/components/ui/ToneBadge";
import type { Integration } from "@/content/integrations";

/** Charte v2, Badge de statut: « Disponible » in Pousse with its tick, « Bientôt » in Encre on Ciel, without a date. */
export const IntegrationBadge = ({ integration }: { integration: Integration }) =>
  integration.status === "available" ? (
    <ToneBadge tone="success" icon="check" label="Disponible" />
  ) : (
    <ToneBadge tone="soon" label="Bientôt" />
  );

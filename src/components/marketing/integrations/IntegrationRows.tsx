import Link from "next/link";
import { ConnectorLogo } from "@/components/connectors/ConnectorLogo";
import { Icon } from "@/components/ui/Icon";
import { FOCUS_RING } from "@/components/ui/button-styles";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { INTEGRATIONS, type Integration, describeMeanwhile } from "@/content/integrations";
import { cn } from "@/lib/cn";
import { integrationPath } from "../marketing-paths";

export const IntegrationBadge = ({ integration }: { integration: Integration }) =>
  integration.status === "available" ? (
    <ToneBadge tone="success" icon="valid" label="Disponible" />
  ) : (
    <ToneBadge tone="soon" label="Bientôt" />
  );

type IntegrationRowsProps = {
  /** /integrations says what each connector does, with a chevron (m21); the home page names them only (m7). */
  isDetailed?: boolean;
  /** The whole catalog by default; the home page names a few. */
  integrations?: Integration[];
};

/** /integrations (m21): the summary under the name; on a phone, the state beside the name and the chevron at the top. */
const DetailedRow = ({ integration }: { integration: Integration }) => (
  <>
    <ConnectorLogo name={integration.name} />
    <span className="flex min-w-[0] flex-1 flex-col gap-2 desktop:gap-1">
      <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-display text-h3">{integration.name}</span>
        <span className="desktop:hidden">
          <IntegrationBadge integration={integration} />
        </span>
      </span>
      <span className="text-small text-gray desktop:text-body">{integration.summary}</span>
      {integration.status === "soon" ? (
        <span className="text-small text-gray">{describeMeanwhile(integration).line}</span>
      ) : null}
    </span>
    <span className="hidden shrink-0 desktop:block">
      <IntegrationBadge integration={integration} />
    </span>
    <Icon name="chevronRight" size={20} className="mt-1 shrink-0 desktop:mt-[0]" />
  </>
);

/**
 * « Connecteurs » of maquette 7: one card per tool on Nuage, its state on the right (charte v2: no rule between the
 * rows). Each card opens its page.
 */
export const IntegrationRows = ({ isDetailed = false, integrations = INTEGRATIONS }: IntegrationRowsProps) => (
  <ul className="flex flex-col gap-3">
    {integrations.map((integration) => (
      <li key={integration.slug}>
        <Link
          href={integrationPath(integration.slug)}
          className={cn(
            "pz-couleur flex gap-4 rounded-card bg-cloud p-5 hover:bg-sky desktop:gap-6 desktop:p-6",
            FOCUS_RING,
            isDetailed ? "items-start desktop:items-center" : "items-center",
          )}
        >
          {isDetailed ? (
            <DetailedRow integration={integration} />
          ) : (
            <>
              <ConnectorLogo name={integration.name} />
              {/* On a narrow phone, the state goes under the name rather than out of the card. */}
              <span className="flex min-w-[0] flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <span className="min-w-[0] font-display text-h3">{integration.name}</span>
                <IntegrationBadge integration={integration} />
              </span>
            </>
          )}
        </Link>
      </li>
    ))}
  </ul>
);

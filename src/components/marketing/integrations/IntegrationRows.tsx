import Link from "next/link";
import { ConnectorLogo } from "@/components/connectors/ConnectorLogo";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { INTEGRATIONS, type Integration } from "@/content/integrations";
import { integrationPath } from "../marketing-paths";

export const IntegrationBadge = ({ integration }: { integration: Integration }) =>
  integration.status === "available" ? (
    <ToneBadge tone="success" icon="valid" label="Disponible" />
  ) : (
    <ToneBadge tone="neutral" label="Bientôt" />
  );

type IntegrationRowsProps = {
  /** /integrations says what each connector does; the home page names them only (m7). */
  showsSummary?: boolean;
};

/** « Connecteurs » of maquette 7: a rule of Encre, one row per tool, its state on the right. Each row opens its page. */
export const IntegrationRows = ({ showsSummary = false }: IntegrationRowsProps) => (
  <ul className="border-t border-ink-900">
    {INTEGRATIONS.map((integration) => (
      <li key={integration.slug} className="border-b border-hairline-200">
        <Link
          href={integrationPath(integration.slug)}
          className="flex items-center gap-4 py-5 hover:bg-paper-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 desktop:gap-5"
        >
          <ConnectorLogo name={integration.name} />
          <span className="flex min-w-[0] flex-1 flex-col gap-1">
            <span className="font-serif text-quote">{integration.name}</span>
            {showsSummary ? <span className="text-small text-slate-600">{integration.summary}</span> : null}
          </span>
          <IntegrationBadge integration={integration} />
        </Link>
      </li>
    ))}
  </ul>
);

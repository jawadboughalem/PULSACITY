import Link from "next/link";
import { ConnectorLogo } from "@/components/connectors/ConnectorLogo";
import { Icon } from "@/components/ui/Icon";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { INTEGRATIONS, type Integration } from "@/content/integrations";
import { cn } from "@/lib/cn";
import { integrationPath } from "../marketing-paths";

export const IntegrationBadge = ({ integration }: { integration: Integration }) =>
  integration.status === "available" ? (
    <ToneBadge tone="success" icon="valid" label="Disponible" />
  ) : (
    <ToneBadge tone="neutral" label="Bientôt" />
  );

type IntegrationRowsProps = {
  /** /integrations says what each connector does, with a chevron (m21); the home page names them only (m7). */
  isDetailed?: boolean;
};

/** /integrations (m21): the summary under the name; on a phone, the state beside the name and the chevron at the top. */
const DetailedRow = ({ integration }: { integration: Integration }) => (
  <>
    <ConnectorLogo name={integration.name} />
    <span className="flex min-w-[0] flex-1 flex-col gap-2 desktop:gap-1">
      <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-serif text-quote">{integration.name}</span>
        <span className="desktop:hidden">
          <IntegrationBadge integration={integration} />
        </span>
      </span>
      <span className="text-small text-slate-600 desktop:text-body">{integration.summary}</span>
    </span>
    <span className="hidden shrink-0 desktop:block">
      <IntegrationBadge integration={integration} />
    </span>
    <Icon name="chevronRight" size={20} className="mt-1 shrink-0 desktop:mt-[0]" />
  </>
);

/** « Connecteurs » of maquette 7: a rule of Encre, one row per tool, its state on the right. Each row opens its page. */
export const IntegrationRows = ({ isDetailed = false }: IntegrationRowsProps) => (
  <ul className="border-t border-ink-900">
    {INTEGRATIONS.map((integration) => (
      <li key={integration.slug} className="border-b border-hairline-200">
        <Link
          href={integrationPath(integration.slug)}
          className={cn(
            "flex gap-4 py-5 hover:bg-paper-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 desktop:gap-5",
            isDetailed ? "items-start desktop:items-center desktop:py-6" : "items-center",
          )}
        >
          {isDetailed ? (
            <DetailedRow integration={integration} />
          ) : (
            <>
              <ConnectorLogo name={integration.name} />
              <span className="min-w-[0] flex-1 font-serif text-quote">{integration.name}</span>
              <IntegrationBadge integration={integration} />
            </>
          )}
        </Link>
      </li>
    ))}
  </ul>
);

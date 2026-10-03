import type { Metadata } from "next";
import Link from "next/link";
import { CONNECTION_BADGES, COMING_SOON_BADGE } from "@/components/connectors/connection-badges";
import { ConnectorLogo } from "@/components/connectors/ConnectorLogo";
import { SuggestTool } from "@/components/connectors/SuggestTool";
import { WaitlistButton } from "@/components/connectors/WaitlistButton";
import { BackBar } from "@/components/space/BackBar";
import { MORE_SECTION_HREF, connectorHref } from "@/components/space/space-sections";
import { SpacePage } from "@/components/space/SpacePage";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { getDb } from "@/db";
import { findConnection } from "@/lib/connectors/connections";
import { loadConnectionOverview } from "@/lib/connectors/load-connection-overview";
import { listWaitlistedConnectors } from "@/lib/connectors/manage-connection";
import { listConnectors } from "@/lib/connectors/registry";
import { UPCOMING_CONNECTORS } from "@/lib/connectors/upcoming-connectors";
import { cn } from "@/lib/cn";
import { formatSince } from "@/lib/dates/format-relative-time";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

export const metadata: Metadata = {
  title: "Connecteurs · PULSACITY",
};

const ROW_CLASSES =
  "flex flex-col gap-4 border-b border-hairline-200 py-5 desktop:flex-row desktop:items-center desktop:gap-6 desktop:py-6";

const describeProducts = (count: number) => (count > 1 ? `${count} produits à associer` : `${count} produit à associer`);

const ConnectorsPage = async () => {
  const { space } = await getCurrentSpace();
  const database = getDb();
  const now = new Date();
  const [available, waitlisted] = await Promise.all([
    Promise.all(
      listConnectors().map(async (connector) => {
        const connection = await findConnection(database, space.id, connector.id);
        return { connector, overview: connection ? await loadConnectionOverview(database, connection) : null };
      }),
    ),
    listWaitlistedConnectors(database, space.id),
  ]);

  return (
    <>
      <BackBar href={MORE_SECTION_HREF} label="Plus" />
      <SpacePage className="desktop:max-w-[1128px]">
        <div className="flex flex-col">
          <div className="flex flex-col gap-2 border-b border-ink-900 pb-5 desktop:pb-6">
            <h1 className="font-serif text-h1 font-medium">Connecteurs</h1>
            <p className="max-w-text text-body text-slate-600">
              Reliez l&apos;outil où vous vendez : chaque achat déclenche une demande d&apos;avis.
            </p>
          </div>
          <ul className="flex flex-col">
            {available.map(({ connector, overview }) => {
              const details = [
                connector.description,
                overview?.lastEventAt ? `dernière vente reçue ${formatSince(overview.lastEventAt, now)}` : null,
                overview?.awaitingProductCount ? describeProducts(overview.awaitingProductCount) : null,
              ].filter(Boolean);
              return (
                <li key={connector.id} className={ROW_CLASSES}>
                  <div className="flex flex-1 items-start gap-4 desktop:items-center desktop:gap-5">
                    <ConnectorLogo name={connector.name} />
                    <div className="flex min-w-[0] flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-serif text-quote font-medium">{connector.name}</h2>
                        {overview ? <ToneBadge {...CONNECTION_BADGES[overview.status]} /> : null}
                      </div>
                      <p className="text-small text-slate-600">{details.join(" · ")}</p>
                    </div>
                  </div>
                  <Link href={connectorHref(connector.slug)} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
                    {overview ? "Gérer" : `Connecter ${connector.name}`}
                  </Link>
                </li>
              );
            })}
            {UPCOMING_CONNECTORS.map((connector) => (
              <li key={connector.id} className={ROW_CLASSES}>
                <div className="flex flex-1 items-start gap-4 desktop:items-center desktop:gap-5">
                  <ConnectorLogo name={connector.name} />
                  <div className="flex min-w-[0] flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-serif text-quote font-medium">{connector.name}</h2>
                      <ToneBadge {...COMING_SOON_BADGE} />
                    </div>
                    <p className="text-small text-slate-600">{connector.description}</p>
                  </div>
                </div>
                <WaitlistButton
                  connector={connector.id}
                  connectorName={connector.name}
                  isWaiting={waitlisted.includes(connector.id)}
                />
              </li>
            ))}
          </ul>
        </div>
        <SuggestTool />
      </SpacePage>
    </>
  );
};

export default ConnectorsPage;

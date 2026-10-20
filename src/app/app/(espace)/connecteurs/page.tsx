import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CONNECTION_BADGES, COMING_SOON_BADGE } from "@/components/connectors/connection-badges";
import {
  ConnectorFamilyFilter,
  FAMILY_SEARCH_PARAM,
  readFamilyFilter,
} from "@/components/connectors/ConnectorFamilyFilter";
import { SuggestTool } from "@/components/connectors/SuggestTool";
import { WaitlistButton } from "@/components/connectors/WaitlistButton";
import { buildSpaceAccount } from "@/components/space/build-space-account";
import { MobileBackLink } from "@/components/space/MobileBackLink";
import { CONNECTORS_SECTION_HREF, connectorHref } from "@/components/space/space-sections";
import { SpaceMobileHeader } from "@/components/space/SpaceMobileHeader";
import { SpacePage } from "@/components/space/SpacePage";
import { INLINE_LINK_CLASSES, SECONDARY_COMPACT_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Monogram } from "@/components/ui/Monogram";
import { ToneBadge } from "@/components/ui/ToneBadge";
import {
  INTEGRATIONS,
  INTEGRATION_FAMILIES,
  type Integration,
  type UpcomingIntegration,
  readMeanwhileLinks,
} from "@/content/integrations";
import { getDb } from "@/db";
import { findConnection } from "@/lib/connectors/connections";
import { type ConnectionOverview, loadConnectionOverview } from "@/lib/connectors/load-connection-overview";
import { listWaitlistedConnectors } from "@/lib/connectors/manage-connection";
import { getConnectorBySlug } from "@/lib/connectors/registry";
import { cn } from "@/lib/cn";
import { formatSince } from "@/lib/dates/format-relative-time";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

export const metadata: Metadata = {
  title: "Connecteurs · PULSACITY",
};

const AVAILABLE_BADGE = { tone: "success", label: "Disponible", icon: "check" } as const;

const MEANWHILE_LINK_CLASSES = cn(INLINE_LINK_CLASSES, "font-bold");

const describeProducts = (count: number) => (count > 1 ? `${count} produits à associer` : `${count} produit à associer`);

/** Charte v2, Carte d'outil: « En attendant : avec Zapier ou Make », or the guide that already does it. */
const MeanwhileLine = ({ integration }: { integration: UpcomingIntegration }) => {
  const links = readMeanwhileLinks(integration);
  return (
    <p className="text-badge text-gray">
      {"guideHref" in links ? (
        <>
          {"Déjà possible avec le connecteur universel : "}
          <Link href={links.guideHref} className={MEANWHILE_LINK_CLASSES}>
            voir le guide
          </Link>
        </>
      ) : (
        <>
          {"En attendant : avec "}
          <Link href={links.zapierHref} className={MEANWHILE_LINK_CLASSES}>
            Zapier
          </Link>
          {" ou "}
          <Link href={links.makeHref} className={MEANWHILE_LINK_CLASSES}>
            Make
          </Link>
        </>
      )}
    </p>
  );
};

type CatalogRowProps = {
  name: string;
  badge: ReactNode;
  children: ReactNode;
  action: ReactNode;
};

/** Maquettes 3.4: a white row per tool, its monogram, name, state and sentence, its action at the right. */
const CatalogRow = ({ name, badge, children, action }: CatalogRowProps) => (
  <li className="flex flex-col gap-4 rounded-card bg-white p-4 desktop:flex-row desktop:items-center desktop:gap-6 desktop:px-6 desktop:py-5">
    <div className="flex min-w-[0] flex-1 items-start gap-4">
      <Monogram name={name} />
      <div className="flex min-w-[0] flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-body font-bold">{name}</h3>
          {badge}
        </div>
        {children}
      </div>
    </div>
    <div className="flex shrink-0 flex-col">{action}</div>
  </li>
);

type IntegrationRowProps = {
  integration: Integration;
  overviews: Map<string, ConnectionOverview | null>;
  waitlisted: string[];
  now: Date;
};

const IntegrationRow = ({ integration, overviews, waitlisted, now }: IntegrationRowProps) => {
  if (integration.status === "soon") {
    return (
      <CatalogRow name={integration.name} badge={<ToneBadge {...COMING_SOON_BADGE} />} action={
        <WaitlistButton
          connector={integration.connector}
          connectorName={integration.name}
          isWaiting={waitlisted.includes(integration.connector)}
        />
      }>
        <p className="text-small text-gray">{integration.summary}</p>
        <MeanwhileLine integration={integration} />
      </CatalogRow>
    );
  }
  const connector = getConnectorBySlug(integration.slug);
  if (!connector) return null;
  const overview = overviews.get(connector.id) ?? null;
  const details = [
    integration.summary,
    overview?.lastEventAt ? `dernière vente reçue ${formatSince(overview.lastEventAt, now)}` : null,
    overview?.awaitingProductCount ? describeProducts(overview.awaitingProductCount) : null,
  ].filter(Boolean);
  return (
    <CatalogRow
      name={integration.name}
      badge={<ToneBadge {...(overview ? CONNECTION_BADGES[overview.status] : AVAILABLE_BADGE)} />}
      action={
        <Link
          href={connectorHref(connector.slug)}
          aria-label={overview ? `Gérer ${connector.name}` : `Connecter ${connector.name}`}
          className={cn(SECONDARY_COMPACT_BUTTON_CLASSES, "w-full desktop:w-auto")}
        >
          {overview ? "Gérer" : "Connecter"}
        </Link>
      }
    >
      <p className="text-small text-gray">{details.join(" · ")}</p>
    </CatalogRow>
  );
};

/** Maquettes 3.4, Connecteurs: the catalog in its six families, a filter chip each, then « Dites-nous quel outil ». */
const ConnectorsPage = async ({ searchParams }: PageProps<"/app/connecteurs">) => {
  const { signedInUser, space } = await getCurrentSpace();
  const familyFilter = readFamilyFilter((await searchParams)[FAMILY_SEARCH_PARAM]);
  const database = getDb();
  const now = new Date();
  const available = INTEGRATIONS.flatMap((integration) => {
    const connector = integration.status === "available" ? getConnectorBySlug(integration.slug) : null;
    return connector ? [connector] : [];
  });
  const [overviewEntries, waitlisted] = await Promise.all([
    Promise.all(
      available.map(async (connector) => {
        const connection = await findConnection(database, space.id, connector.id);
        return [connector.id, connection ? await loadConnectionOverview(database, connection) : null] as const;
      }),
    ),
    listWaitlistedConnectors(database, space.id),
  ]);
  const overviews = new Map(overviewEntries);
  const families = INTEGRATION_FAMILIES.filter((family) => familyFilter === null || family.id === familyFilter);

  return (
    <>
      <SpaceMobileHeader account={buildSpaceAccount(signedInUser, space)} />
      <SpacePage className="gap-4">
        <MobileBackLink />
        <div className="flex flex-col gap-6 desktop:gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-h1">Connecteurs</h1>
            <p className="max-w-text text-body">
              Reliez l&apos;outil où vous vendez : chaque achat déclenche une demande d&apos;avis.
            </p>
          </div>
          <ConnectorFamilyFilter href={CONNECTORS_SECTION_HREF} current={familyFilter} />
          <div className="flex flex-col gap-8">
            {families.map((family) => (
              <section key={family.id} aria-labelledby={`family-${family.id}`} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 id={`family-${family.id}`} className="font-display text-h2">
                    {family.title}
                  </h2>
                  <p className="text-small text-gray">{family.text}</p>
                </div>
                <ul className="flex flex-col gap-3">
                  {INTEGRATIONS.filter((integration) => integration.family === family.id).map((integration) => (
                    <IntegrationRow
                      key={integration.slug}
                      integration={integration}
                      overviews={overviews}
                      waitlisted={waitlisted}
                      now={now}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
          {familyFilter ? (
            <p className="text-small text-gray">
              {`1 famille sur ${INTEGRATION_FAMILIES.length} affichée. `}
              <Link href={CONNECTORS_SECTION_HREF} className={MEANWHILE_LINK_CLASSES}>
                Voir toutes les familles
              </Link>
            </p>
          ) : null}
          <SuggestTool />
        </div>
      </SpacePage>
    </>
  );
};

export default ConnectorsPage;

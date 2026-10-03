import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConnectionEventList } from "@/components/connectors/ConnectionEventList";
import { BackBar, Breadcrumb } from "@/components/space/BackBar";
import { connectorHistoryHref, connectorHref } from "@/components/space/space-sections";
import { SpacePage } from "@/components/space/SpacePage";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { getDb } from "@/db";
import { findConnection } from "@/lib/connectors/connections";
import {
  HISTORY_PAGE_SIZE,
  listConnectionEvents,
  loadConnectionOverview,
} from "@/lib/connectors/load-connection-overview";
import { getConnectorBySlug } from "@/lib/connectors/registry";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";

export const metadata: Metadata = {
  title: "Historique des événements · PULSACITY",
};

const readPage = (value: string | string[] | undefined): number => {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(page) && page > 1 ? page : 1;
};

/** Every event received, fifty at a time, the latest first. */
const ConnectorHistoryPage = async ({ params, searchParams }: PageProps<"/app/connecteurs/[connector]/historique">) => {
  const { connector: slug } = await params;
  const connector = getConnectorBySlug(slug);
  if (!connector) notFound();
  const { space } = await getCurrentSpace();
  const database = getDb();
  const connection = await findConnection(database, space.id, connector.id);
  if (!connection) notFound();

  const page = readPage((await searchParams).page);
  const [overview, events] = await Promise.all([
    loadConnectionOverview(database, connection),
    listConnectionEvents(database, connection, { limit: HISTORY_PAGE_SIZE, offset: (page - 1) * HISTORY_PAGE_SIZE }),
  ]);
  const isLastPage = page * HISTORY_PAGE_SIZE >= overview.eventCount;
  const pageHref = (target: number) => `${connectorHistoryHref(connector.slug)}${target > 1 ? `?page=${target}` : ""}`;

  return (
    <>
      <BackBar href={connectorHref(connector.slug)} label={connector.name} />
      <SpacePage className="desktop:max-w-[1128px]">
        <Breadcrumb parentHref={connectorHref(connector.slug)} parentLabel={connector.name} current="Historique" />
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-h1 font-medium">Historique des événements</h1>
          <p className="max-w-text text-body text-slate-600">
            {`Tout ce que ${connector.name} nous a envoyé, du plus récent au plus ancien.`}
          </p>
        </div>
        {events.length > 0 ? (
          <ConnectionEventList
            events={events}
            connectorName={connector.name}
            firstEventAt={isLastPage ? overview.firstEventAt : null}
            now={new Date()}
          />
        ) : (
          <p className="border-t border-ink-900 pt-4 text-body">Aucun événement sur cette page.</p>
        )}
        {page > 1 || !isLastPage ? (
          <nav aria-label="Pages de l'historique" className="flex flex-col gap-3 desktop:flex-row">
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className={SECONDARY_BUTTON_CLASSES}>
                Voir les plus récents
              </Link>
            ) : null}
            {isLastPage ? null : (
              <Link href={pageHref(page + 1)} className={SECONDARY_BUTTON_CLASSES}>
                Voir les plus anciens
              </Link>
            )}
          </nav>
        ) : null}
      </SpacePage>
    </>
  );
};

export default ConnectorHistoryPage;

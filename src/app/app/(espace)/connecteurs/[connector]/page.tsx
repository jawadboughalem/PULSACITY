import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CheckConnectionButton } from "@/components/connectors/CheckConnectionButton";
import { ConnectionAddressFields } from "@/components/connectors/ConnectionAddressFields";
import { ConnectionEventList } from "@/components/connectors/ConnectionEventList";
import { ConnectionGuide, ConnectionOptionalStep } from "@/components/connectors/ConnectionGuide";
import { ConnectionStatusBanner } from "@/components/connectors/ConnectionStatusBanner";
import { ConnectorLogo } from "@/components/connectors/ConnectorLogo";
import { readConnectorWording } from "@/components/connectors/connector-wording";
import { ExternalProductsTable } from "@/components/connectors/ExternalProductsTable";
import { UniversalFieldList } from "@/components/connectors/UniversalFieldList";
import { describeExternalProduct } from "@/components/connectors/describe-external-product";
import { RichTextLine } from "@/components/marketing/RichTextLine";
import { BackBar, Breadcrumb } from "@/components/space/BackBar";
import { CONNECTORS_SECTION_HREF, connectorHistoryHref } from "@/components/space/space-sections";
import { SpacePage } from "@/components/space/SpacePage";
import { DISCREET_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { UNIVERSAL_GUIDE_LINKS } from "@/content/integrations";
import { getDb } from "@/db";
import { buildWebhookUrl, findOrCreateConnection } from "@/lib/connectors/connections";
import {
  OVERVIEW_EVENT_COUNT,
  listConnectionEvents,
  loadConnectionOverview,
} from "@/lib/connectors/load-connection-overview";
import { getConnectorBySlug } from "@/lib/connectors/registry";
import { cn } from "@/lib/cn";
import { formatMoment, formatSince } from "@/lib/dates/format-relative-time";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listAssociableProducts } from "@/lib/spaces/list-space-products";

export const generateMetadata = async ({ params }: PageProps<"/app/connecteurs/[connector]">): Promise<Metadata> => {
  const connector = getConnectorBySlug((await params).connector);
  return { title: `${connector ? readConnectorWording(connector).title : "Connecter un outil"} · PULSACITY` };
};

const STEP_TWO_ID = "etape-2";

type StepProps = {
  number: number;
  id?: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
};

const Step = ({ number, id, title, description, children }: StepProps) => (
  <li id={id} className="flex scroll-mt-6 gap-4 py-8 desktop:gap-6 desktop:py-10">
    <span
      aria-hidden="true"
      className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-ink text-body font-bold text-white desktop:size-[40px]"
    >
      {number}
    </span>
    <div className="flex min-w-[0] flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-h3">
          <span className="sr-only">{`Étape ${number} : `}</span>
          {title}
        </h3>
        <p className="max-w-text text-body text-gray">{description}</p>
      </div>
      {children}
    </div>
  </li>
);

/**
 * Maquette 5, « Connecter Systeme.io »: the light, the three steps, the products to associate, the latest events. The
 * universal connector follows it, its fields in place of the screens of a tool.
 */
const ConnectorPage = async ({ params }: PageProps<"/app/connecteurs/[connector]">) => {
  const { connector: slug } = await params;
  const connector = getConnectorBySlug(slug);
  if (!connector) notFound();
  const { space } = await getCurrentSpace();
  const database = getDb();
  const connection = await findOrCreateConnection(database, space.id, connector);
  const now = new Date();
  const [overview, latestEvents, setAsideEvents, offers] = await Promise.all([
    loadConnectionOverview(database, connection),
    listConnectionEvents(database, connection, { limit: OVERVIEW_EVENT_COUNT }),
    listConnectionEvents(database, connection, { limit: OVERVIEW_EVENT_COUNT, isSetAsideOnly: true }),
    listAssociableProducts(database, space.id),
  ]);
  // m5: the sales put aside stay on top of the latest events, until « Rejouer ».
  const events = [
    ...setAsideEvents,
    ...latestEvents.filter((event) => !setAsideEvents.some((setAside) => setAside.id === event.id)),
  ].slice(0, Math.max(OVERVIEW_EVENT_COUNT, setAsideEvents.length));
  const signingSecret = connection.config.signingSecret ?? null;
  const wording = readConnectorWording(connector);
  const showsFirstEvent = overview.eventCount <= OVERVIEW_EVENT_COUNT;

  return (
    <>
      <BackBar href={CONNECTORS_SECTION_HREF} label="Connecteurs" />
      <SpacePage className="desktop:max-w-[1128px]">
        <Breadcrumb parentHref={CONNECTORS_SECTION_HREF} parentLabel="Connecteurs" current={connector.name} />
        <div className="flex flex-col items-start gap-4 desktop:flex-row desktop:items-center desktop:gap-6">
          <ConnectorLogo name={connector.name} />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-h1">{wording.title}</h1>
            <p className="max-w-text text-body">{wording.intro}</p>
          </div>
        </div>

        <ConnectionStatusBanner
          status={overview.status}
          connectorName={wording.toolName}
          lastEventSince={overview.lastEventAt ? formatSince(overview.lastEventAt, now) : null}
          problemSince={overview.problemSince ? formatMoment(overview.problemSince, now) : null}
          signingSecret={signingSecret}
          stepTwoId={STEP_TWO_ID}
          setAsideCount={overview.setAsideCount}
        />

        <section aria-labelledby="connection-steps" className="flex flex-col">
          <h2 id="connection-steps" className="font-display text-h2">
            La connexion en 3 étapes
          </h2>
          <ol className="flex flex-col">
            <Step
              number={1}
              title="Copier votre adresse de connexion"
              description={wording.addressDescription}
            >
              <ConnectionAddressFields
                connectorSlug={connector.slug}
                connectorName={wording.toolName}
                connectionId={connection.id}
                webhookUrl={buildWebhookUrl(connector.id, connection.webhookToken)}
                signingSecret={signingSecret}
              />
            </Step>
            <Step
              number={2}
              id={STEP_TWO_ID}
              title={wording.pasteTitle}
              description={
                <>
                  <span className="desktop:hidden">{wording.pasteDescription.phone}</span>
                  <span className="hidden desktop:inline">{wording.pasteDescription.computer}</span>
                </>
              }
            >
              {connector.id === "universal" ? (
                <div className="flex flex-col gap-4">
                  <UniversalFieldList />
                  <p className="max-w-text text-small">
                    <RichTextLine parts={UNIVERSAL_GUIDE_LINKS} />
                  </p>
                </div>
              ) : (
                <ConnectionGuide connectorId={connector.id} connectorName={connector.name} />
              )}
            </Step>
            <Step
              number={3}
              title={wording.testTitle}
              description={wording.testDescription}
            >
              <CheckConnectionButton isWaiting={overview.status === "pending"} />
            </Step>
          </ol>
          <ConnectionOptionalStep connectorId={connector.id} />
        </section>

        <section id="offres-a-associer" aria-labelledby="external-products" className="flex scroll-mt-6 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="external-products" className="font-display text-h2">
              Offres à associer
            </h2>
            <p className="max-w-text text-body text-gray">
              Ces produits sont arrivés avec vos ventes. Dites-nous à quelle offre ils correspondent, et quand demander
              l&apos;avis.
            </p>
          </div>
          {overview.externalProducts.length > 0 ? (
            <ExternalProductsTable
              connectorName={wording.toolName}
              offers={offers}
              products={overview.externalProducts.map((product) => ({
                id: product.id,
                name: product.name,
                details: describeExternalProduct(product, now),
                productId: product.productId,
              }))}
            />
          ) : (
            <p className="text-body">
              Aucun produit reçu pour l&apos;instant. Ils apparaîtront ici avec votre première vente.
            </p>
          )}
        </section>

        <section aria-labelledby="latest-events" className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="latest-events" className="font-display text-h2">
              Derniers événements reçus
            </h2>
            {overview.eventCount > OVERVIEW_EVENT_COUNT ? (
              <Link href={connectorHistoryHref(connector.slug)} className={cn(DISCREET_BUTTON_CLASSES, "hidden shrink-0 desktop:inline-flex")}>
                Voir tout l&apos;historique
              </Link>
            ) : null}
          </div>
          {overview.eventCount > 0 ? (
            <ConnectionEventList
              events={events}
              connectorName={connector.name}
              firstEventAt={showsFirstEvent ? overview.firstEventAt : null}
              now={now}
            />
          ) : (
            <p className="text-body">
              {`Rien reçu pour l'instant. Chaque vente de ${wording.toolName} s'affichera ici.`}
            </p>
          )}
          {overview.eventCount > OVERVIEW_EVENT_COUNT ? (
            <Link href={connectorHistoryHref(connector.slug)} className={cn(DISCREET_BUTTON_CLASSES, "self-start desktop:hidden")}>
              Voir tout l&apos;historique
            </Link>
          ) : null}
        </section>
      </SpacePage>
    </>
  );
};

export default ConnectorPage;

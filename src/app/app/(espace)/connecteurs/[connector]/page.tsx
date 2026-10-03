import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CheckConnectionButton } from "@/components/connectors/CheckConnectionButton";
import { ConnectionAddressFields } from "@/components/connectors/ConnectionAddressFields";
import { ConnectionEventList } from "@/components/connectors/ConnectionEventList";
import { ConnectionGuide } from "@/components/connectors/ConnectionGuide";
import { ConnectionStatusBanner } from "@/components/connectors/ConnectionStatusBanner";
import { ConnectorLogo } from "@/components/connectors/ConnectorLogo";
import { ExternalProductsTable } from "@/components/connectors/ExternalProductsTable";
import { describeExternalProduct } from "@/components/connectors/describe-external-product";
import { BackBar, Breadcrumb } from "@/components/space/BackBar";
import { CONNECTORS_SECTION_HREF, connectorHistoryHref } from "@/components/space/space-sections";
import { SpacePage } from "@/components/space/SpacePage";
import { getDb } from "@/db";
import { buildWebhookUrl, findOrCreateConnection } from "@/lib/connectors/connections";
import {
  OVERVIEW_EVENT_COUNT,
  listConnectionEvents,
  loadConnectionOverview,
} from "@/lib/connectors/load-connection-overview";
import { getConnectorBySlug } from "@/lib/connectors/registry";
import { formatSince } from "@/lib/dates/format-relative-time";
import { getCurrentSpace } from "@/lib/spaces/get-current-space";
import { listAssociableProducts } from "@/lib/spaces/list-space-products";

export const generateMetadata = async ({ params }: PageProps<"/app/connecteurs/[connector]">): Promise<Metadata> => {
  const { connector } = await params;
  return { title: `Connecter ${getConnectorBySlug(connector)?.name ?? "un outil"} · PULSACITY` };
};

const STEP_TWO_ID = "etape-2";

const LINK_CLASSES =
  "text-small font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900";

type StepProps = {
  number: number;
  id?: string;
  title: string;
  description: string;
  children: ReactNode;
};

const Step = ({ number, id, title, description, children }: StepProps) => (
  <li id={id} className="flex scroll-mt-5 gap-4 border-b border-hairline-200 py-6 desktop:gap-5 desktop:py-7">
    <span
      aria-hidden="true"
      className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-ink-900 font-serif text-body font-semibold text-white desktop:size-[40px] desktop:text-quote"
    >
      {number}
    </span>
    <div className="flex min-w-[0] flex-1 flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-quote font-medium">
          <span className="sr-only">{`Étape ${number} : `}</span>
          {title}
        </h3>
        <p className="max-w-text text-body text-slate-600">{description}</p>
      </div>
      {children}
    </div>
  </li>
);

/** Maquette 5, « Connecter Systeme.io »: the light, the three steps, the products to associate, the latest events. */
const ConnectorPage = async ({ params }: PageProps<"/app/connecteurs/[connector]">) => {
  const { connector: slug } = await params;
  const connector = getConnectorBySlug(slug);
  if (!connector) notFound();
  const { space } = await getCurrentSpace();
  const database = getDb();
  const connection = await findOrCreateConnection(database, space.id, connector);
  const now = new Date();
  const [overview, events, offers] = await Promise.all([
    loadConnectionOverview(database, connection),
    listConnectionEvents(database, connection, { limit: OVERVIEW_EVENT_COUNT }),
    listAssociableProducts(database, space.id),
  ]);
  const signingSecret = connection.config.signingSecret ?? null;
  const showsFirstEvent = overview.eventCount <= OVERVIEW_EVENT_COUNT;

  return (
    <>
      <BackBar href={CONNECTORS_SECTION_HREF} label="Connecteurs" />
      <SpacePage className="desktop:max-w-[1128px]">
        <Breadcrumb parentHref={CONNECTORS_SECTION_HREF} parentLabel="Connecteurs" current={connector.name} />
        <div className="flex items-start gap-4 desktop:items-center desktop:gap-5">
          <ConnectorLogo name={connector.name} />
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-h1 font-medium">{`Connecter ${connector.name}`}</h1>
            <p className="max-w-text text-body text-slate-600">
              {`Chaque vente sur ${connector.name} déclenche une demande d'avis, au bon moment, sans rien faire de plus.`}
            </p>
          </div>
        </div>

        <ConnectionStatusBanner
          status={overview.status}
          connectorName={connector.name}
          lastEventSince={overview.lastEventAt ? formatSince(overview.lastEventAt, now) : null}
          problemSince={overview.problemSince ? formatSince(overview.problemSince, now) : null}
          signingSecret={signingSecret}
          stepTwoId={STEP_TWO_ID}
        />

        <section aria-labelledby="connection-steps" className="flex flex-col">
          <h2 id="connection-steps" className="border-b border-ink-900 pb-4 font-serif text-h2 font-medium">
            La connexion en 3 étapes
          </h2>
          <ol className="flex flex-col">
            <Step
              number={1}
              title="Copier votre adresse de connexion"
              description={`C'est par cette adresse que ${connector.name} nous prévient de chaque vente. Elle vous est propre : ne la partagez pas.`}
            >
              <ConnectionAddressFields
                connectorSlug={connector.slug}
                connectorName={connector.name}
                connectionId={connection.id}
                webhookUrl={buildWebhookUrl(connector.id, connection.webhookToken)}
                signingSecret={signingSecret}
              />
            </Step>
            <Step
              number={2}
              id={STEP_TWO_ID}
              title={`La coller dans ${connector.name}`}
              description={`Ouvrez ${connector.name} dans un autre onglet et suivez ces trois écrans.`}
            >
              <ConnectionGuide connectorId={connector.id} connectorName={connector.name} />
            </Step>
            <Step
              number={3}
              title="Faire une vente test, ou attendre la prochaine"
              description="Le voyant en haut de la page passe au vert dès la première vente reçue. Pour tester sans payer, achetez votre offre avec un code promo à 100 %."
            >
              <CheckConnectionButton isWaiting={overview.status === "pending"} />
            </Step>
          </ol>
        </section>

        <section id="offres-a-associer" aria-labelledby="external-products" className="flex scroll-mt-5 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 id="external-products" className="font-serif text-h2 font-medium">
              Offres à associer
            </h2>
            <p className="max-w-text text-body text-slate-600">
              Ces produits sont arrivés avec vos ventes. Dites-nous à quelle offre ils correspondent, et quand demander
              l&apos;avis.
            </p>
          </div>
          {overview.externalProducts.length > 0 ? (
            <ExternalProductsTable
              connectorName={connector.name}
              offers={offers}
              products={overview.externalProducts.map((product) => ({
                id: product.id,
                name: product.name,
                details: describeExternalProduct(product, now),
                productId: product.productId,
              }))}
            />
          ) : (
            <p className="border-t border-ink-900 pt-4 text-body">
              Aucun produit reçu pour l&apos;instant. Ils apparaîtront ici avec votre première vente.
            </p>
          )}
        </section>

        <section aria-labelledby="latest-events" className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="latest-events" className="font-serif text-h2 font-medium">
              Derniers événements reçus
            </h2>
            {overview.eventCount > OVERVIEW_EVENT_COUNT ? (
              <Link href={connectorHistoryHref(connector.slug)} className={`${LINK_CLASSES} shrink-0`}>
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
            <p className="border-t border-ink-900 pt-4 text-body">
              {`Rien reçu pour l'instant. Chaque vente de ${connector.name} s'affichera ici.`}
            </p>
          )}
        </section>
      </SpacePage>
    </>
  );
};

export default ConnectorPage;

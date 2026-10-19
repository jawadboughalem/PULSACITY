import { asc, eq } from "drizzle-orm";
import { getPlan } from "@/config/plans";
import type { Database } from "@/db/database";
import {
  connections,
  customers,
  products,
  purchases,
  reviewRequests,
  spaces,
  testimonialCorrections,
  testimonials,
  user,
  widgets,
} from "@/db/schema";
import { readConnectorName } from "@/lib/connectors/registry";
import { toParisIsoDay } from "@/lib/dates/paris-date";
import { describeHiddenReason } from "@/lib/testimonials/hidden-reasons";
import { readTestimonialProvenance } from "@/lib/testimonials/testimonial-provenance";

/** Raised when the format of the file changes, so that a program reading it knows which one it has. */
export const SPACE_EXPORT_VERSION = 1;

const TESTIMONIAL_STATUSES = { pending: "en_attente", approved: "valide", hidden: "masque" } as const;

const TESTIMONIAL_SOURCES = { form: "formulaire", manual: "ajout_manuel", csv: "import_csv" } as const;

const PROVENANCES = {
  sale: "vente_recue",
  request: "demande_manuelle",
  added: "ajout",
  import: "import",
  "public-link": "lien_public",
} as const;

const CORRECTION_OUTCOMES = { accepted: "acceptee", refused: "refusee", cancelled: "annulee" } as const;

const PURCHASE_SOURCES = { connector: "connecteur", manual: "saisie_manuelle", csv: "import_csv" } as const;

const REQUEST_STATUSES = {
  scheduled: "planifiee",
  sent: "envoyee",
  reminded: "relancee",
  completed: "completee",
  cancelled: "annulee",
  failed: "echec",
} as const;

const WIDGET_TYPES = { wall: "mur", carousel: "carrousel", badge: "badge" } as const;

const EVENT_TYPES: Record<string, string> = { sale: "vente", enrollment: "inscription" };

const toIso = (date: Date | null) => (date ? date.toISOString() : null);

type SpaceExportOptions = {
  now?: Date;
  /** The address of the collection page, built by the caller (it knows the site's address). */
  buildCollectionUrl: (spaceSlug: string, productSlug?: string) => string;
};

/**
 * « Exporter mes données »: one file with the account, the space, its offers, widgets, customers, sales, requests, and
 * testimonials with the proof of their consent. Only the space of this user. Secrets stay out: the addresses and keys
 * of the connections, and the links of the requests, which let anyone leave a review.
 */
export const buildSpaceExport = async (
  database: Database,
  userId: string,
  { now = new Date(), buildCollectionUrl }: SpaceExportOptions,
) => {
  const [owner] = await database
    .select({ email: user.email, name: user.name, createdAt: user.createdAt })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  const [space] = await database
    .select()
    .from(spaces)
    .where(eq(spaces.userId, userId))
    .orderBy(asc(spaces.createdAt))
    .limit(1);
  if (!owner || !space) return null;

  const [spaceProducts, spaceWidgets, spaceCustomers, spaceConnections, spacePurchases, spaceRequests, spaceTestimonials] =
    await Promise.all([
      database.select().from(products).where(eq(products.spaceId, space.id)).orderBy(asc(products.createdAt)),
      database.select().from(widgets).where(eq(widgets.spaceId, space.id)).orderBy(asc(widgets.createdAt)),
      database.select().from(customers).where(eq(customers.spaceId, space.id)).orderBy(asc(customers.createdAt)),
      database
        .select({ id: connections.id, connector: connections.connector })
        .from(connections)
        .where(eq(connections.spaceId, space.id)),
      database.select().from(purchases).where(eq(purchases.spaceId, space.id)).orderBy(asc(purchases.purchasedAt)),
      database
        .select({ request: reviewRequests, customerId: purchases.customerId, productId: purchases.productId })
        .from(reviewRequests)
        .innerJoin(purchases, eq(purchases.id, reviewRequests.purchaseId))
        .where(eq(purchases.spaceId, space.id))
        .orderBy(asc(reviewRequests.scheduledAt)),
      database
        .select()
        .from(testimonials)
        .where(eq(testimonials.spaceId, space.id))
        .orderBy(asc(testimonials.createdAt)),
    ]);
  const spaceCorrections = await database
    .select({
      testimonialId: testimonialCorrections.testimonialId,
      fromBody: testimonialCorrections.fromBody,
      body: testimonialCorrections.body,
      createdAt: testimonialCorrections.createdAt,
      answeredAt: testimonialCorrections.answeredAt,
      outcome: testimonialCorrections.outcome,
    })
    .from(testimonialCorrections)
    .innerJoin(testimonials, eq(testimonials.id, testimonialCorrections.testimonialId))
    .where(eq(testimonials.spaceId, space.id))
    .orderBy(asc(testimonialCorrections.createdAt));
  const correctionsOf = (testimonialId: string) =>
    spaceCorrections
      .filter((correction) => correction.testimonialId === testimonialId)
      .map((correction) => ({
        proposee_le: toIso(correction.createdAt),
        texte_avant: correction.fromBody,
        texte_propose: correction.body,
        reponse: correction.outcome ? CORRECTION_OUTCOMES[correction.outcome] : "en_attente",
        repondu_le: toIso(correction.answeredAt),
      }));

  const productNames = new Map(spaceProducts.map((product) => [product.id, product.name]));
  const customerEmails = new Map(spaceCustomers.map((customer) => [customer.id, customer.email]));
  const connectorNames = new Map(
    spaceConnections.map((connection) => [connection.id, readConnectorName(connection.connector)]),
  );
  const readProduct = (productId: string | null) => (productId ? (productNames.get(productId) ?? null) : null);
  const readCustomer = (customerId: string | null) => (customerId ? (customerEmails.get(customerId) ?? null) : null);

  const data = {
    fichier: {
      contenu: "Les données de votre espace PULSACITY",
      version: SPACE_EXPORT_VERSION,
      prepare_le: now.toISOString(),
    },
    compte: {
      adresse_de_connexion: owner.email,
      prenom: owner.name.trim() || null,
      cree_le: toIso(owner.createdAt),
    },
    espace: {
      nom: space.name,
      page_de_collecte: buildCollectionUrl(space.slug),
      logo: space.logoUrl,
      couleur_accent: space.accentColor,
      email_de_reponse: space.replyToEmail,
      adresse_postale_expediteur: space.senderPostalAddress,
      email_nouveau_temoignage: space.newTestimonialEmailEnabled,
      contrepartie_declaree_le: toIso(space.incentiveDeclaredAt),
      plan: getPlan(space.plan).name,
      cree_le: toIso(space.createdAt),
    },
    offres: spaceProducts.map((product) => ({
      nom: product.name,
      page_de_collecte: buildCollectionUrl(space.slug, product.slug),
      delai_de_demande_jours: product.requestDelayDays,
      demandes_automatiques: product.requestsEnabled,
      creee_le: toIso(product.createdAt),
    })),
    widgets: spaceWidgets.map((widget) => ({
      nom: widget.name,
      type: WIDGET_TYPES[widget.type],
      offre: readProduct(widget.productId),
      reglages: widget.settings,
      premier_affichage_le: toIso(widget.firstLoadedAt),
      cree_le: toIso(widget.createdAt),
    })),
    clients: spaceCustomers.map((customer) => ({
      email: customer.email,
      prenom: customer.firstName,
      nom: customer.lastName,
      desinscrit_le: toIso(customer.unsubscribedAt),
      cree_le: toIso(customer.createdAt),
    })),
    ventes: spacePurchases.map((purchase) => ({
      client: readCustomer(purchase.customerId),
      offre: readProduct(purchase.productId),
      source: PURCHASE_SOURCES[purchase.source],
      outil: purchase.connectionId ? (connectorNames.get(purchase.connectionId) ?? null) : null,
      type: purchase.eventType ? (EVENT_TYPES[purchase.eventType] ?? purchase.eventType) : null,
      reference: purchase.externalRef,
      achetee_le: toIso(purchase.purchasedAt),
      enregistree_le: toIso(purchase.createdAt),
    })),
    demandes: spaceRequests.map(({ request, customerId, productId }) => ({
      client: readCustomer(customerId),
      offre: readProduct(productId),
      statut: REQUEST_STATUSES[request.status],
      prevue_le: toIso(request.scheduledAt),
      envoyee_le: toIso(request.sentAt),
      relance_prevue_le: toIso(request.reminderScheduledAt),
      relance_envoyee_le: toIso(request.reminderSentAt),
      avis_recu_le: toIso(request.completedAt),
      annulee_le: toIso(request.cancelledAt),
      echec_le: toIso(request.failedAt),
    })),
    temoignages: spaceTestimonials.map((testimonial) => ({
      auteur: testimonial.authorName,
      titre: testimonial.authorTitle,
      photo: testimonial.authorPhotoUrl,
      note: testimonial.rating,
      texte_original: testimonial.body,
      texte_affiche: testimonial.displayBody,
      texte_affiche_modifie_le: toIso(testimonial.displayEditedAt),
      statut: TESTIMONIAL_STATUSES[testimonial.status],
      source: TESTIMONIAL_SOURCES[testimonial.source],
      provenance: PROVENANCES[readTestimonialProvenance(testimonial)],
      achat_le: toIso(testimonial.purchasedAt),
      offre: readProduct(testimonial.productId),
      client: readCustomer(testimonial.customerId),
      mis_en_avant: testimonial.featured,
      recu_le: toIso(testimonial.createdAt),
      consentement: testimonial.consentAt
        ? { donne_le: toIso(testimonial.consentAt), texte: testimonial.consentText }
        : null,
      masquage:
        testimonial.status === "hidden" && testimonial.hiddenReason
          ? {
              le: toIso(testimonial.hiddenAt),
              motif: describeHiddenReason(testimonial),
              motif_envoye_le: toIso(testimonial.hiddenReasonSentAt),
            }
          : null,
      corrections: correctionsOf(testimonial.id),
    })),
  };
  return { spaceSlug: space.slug, data };
};

/** « pulsacity-julie-nutrition-2026-10-14.json » */
export const buildSpaceExportFileName = (spaceSlug: string, now: Date) =>
  `pulsacity-${spaceSlug}-${toParisIsoDay(now)}.json`;

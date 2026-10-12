import { describe, expect, it } from "vitest";
import { getConnectorBySlug, listConnectors } from "@/lib/connectors/registry";
import { CATALOG_UPCOMING_CONNECTORS, UPCOMING_CONNECTOR_IDS } from "@/lib/connectors/upcoming-connectors";
import { INTEGRATIONS, INTEGRATION_CATALOG, INTEGRATION_FAMILIES, type Integration, findIntegration } from ".";

/** The texts as docs-internes/decisions/connecteurs.md writes them, without the no-break spaces of the site. */
const plain = (text: string) => text.replaceAll("\u00a0", " ").replaceAll("\u2060", "");

/** The families of connecteurs.md shown in V0: title and sentence. */
const DECIDED_FAMILIES = [
  ["Formations et tunnels de vente", "Vos élèves reçoivent une demande d'avis après leur achat ou leur inscription."],
  ["Rendez-vous et séances", "Vos clients reçoivent une demande d'avis après la séance, jamais avant."],
  ["Paiements en ligne", "Une demande d'avis part après chaque paiement réussi."],
  ["Événements et webinaires", "Les participants reçoivent une demande d'avis après l'événement."],
  ["Boutiques en ligne", "Vos acheteurs reçoivent une demande d'avis après leur commande."],
  ["Tous vos autres outils", "Votre outil n'est pas dans la liste ? Reliez-le avec Zapier, Make ou n8n."],
];

/** The tools of connecteurs.md shown in V0: name, family, state and sentence, in its order. */
const DECIDED_TOOLS = [
  ["Systeme.io", "courses", "available", "Une demande d'avis après chaque vente ou inscription à une formation."],
  ["Learnybox", "courses", "soon", "Une demande d'avis après chaque vente ou inscription."],
  ["Kajabi", "courses", "soon", "Une demande d'avis après chaque achat d'une offre."],
  ["SchoolMaker", "courses", "soon", "Une demande d'avis quand un membre rejoint une offre."],
  ["Podia", "courses", "soon", "Une demande d'avis après chaque vente, avec Zapier."],
  ["Calendly", "appointments", "soon", "Une demande d'avis après chaque rendez-vous passé."],
  ["Cal.com", "appointments", "soon", "Une demande d'avis après chaque séance terminée."],
  ["Stripe", "payments", "soon", "Une demande d'avis après chaque paiement réussi."],
  ["PayPal", "payments", "soon", "Une demande d'avis après chaque paiement reçu."],
  ["Livestorm", "events", "soon", "Une demande d'avis aux participants présents, après le webinaire."],
  ["HelloAsso", "events", "soon", "Une demande d'avis après chaque adhésion, billet ou paiement à votre association."],
  ["Weezevent", "events", "soon", "Une demande d'avis après l'événement, à chaque participant."],
  ["Eventbrite", "events", "soon", "Une demande d'avis après l'événement, à chaque participant."],
  ["WooCommerce", "shops", "soon", "Une demande d'avis après chaque commande payée."],
  ["Shopify", "shops", "soon", "Une demande d'avis après chaque commande payée."],
  [
    "Connecteur universel",
    "other-tools",
    "soon",
    "Envoyez vos ventes depuis n'importe quel outil : une demande d'avis part pour chacune.",
  ],
  ["Zapier", "other-tools", "soon", "Reliez des milliers d'outils : une demande d'avis après chaque vente que vous choisissez."],
  ["Make", "other-tools", "soon", "Reliez des milliers d'outils, même avec le plan gratuit de Make."],
  ["n8n", "other-tools", "soon", "Reliez n'importe quel outil avec n8n : une demande d'avis après chaque vente."],
];

const textsOf = (integration: Integration): string[] => [
  integration.summary,
  integration.seo.title,
  integration.seo.description,
  integration.heading,
  integration.intro,
  ...(integration.status === "soon" ? integration.willDo : []),
];

describe("INTEGRATIONS", () => {
  it("has one page per connector of the registry, at the same address as in the space", () => {
    for (const connector of listConnectors()) {
      const integration = findIntegration(connector.slug);
      expect(integration?.status).toBe("available");
      expect(integration?.name).toBe(connector.name);
    }
  });

  it("only calls available a connector the registry receives", () => {
    for (const integration of INTEGRATIONS.filter((page) => page.status === "available")) {
      expect(getConnectorBySlug(integration.slug)).not.toBeNull();
    }
  });

  it("puts a connector to come on the waiting list of the space", () => {
    for (const integration of INTEGRATIONS) {
      if (integration.status === "soon") expect(UPCOMING_CONNECTOR_IDS).toContain(integration.connector);
    }
  });

  it("keeps the addresses unique", () => {
    expect(new Set(INTEGRATIONS.map((integration) => integration.slug)).size).toBe(INTEGRATIONS.length);
  });

  it("copies the address in one step, the one the rule of the optional step sends back to", () => {
    for (const integration of INTEGRATIONS) {
      if (integration.status !== "available") continue;
      const addressSteps = integration.installSteps.filter((step) => step.illustration === "connection-address");
      expect(addressSteps).toHaveLength(1);
    }
  });

  it("titles the Systeme.io page as the lot asks", () => {
    expect(findIntegration("systeme-io")?.heading).toBe("Témoignages automatiques pour Systeme.io");
    expect(findIntegration("inconnu")).toBeNull();
  });
});

describe("INTEGRATION_CATALOG", () => {
  it("shows the six families of connecteurs.md, in their order", () => {
    expect(INTEGRATION_FAMILIES.map((family) => [family.title, plain(family.text)])).toEqual(DECIDED_FAMILIES);
  });

  it("lists the 19 tools of connecteurs.md, in its order, with their family, state and sentence", () => {
    expect(
      INTEGRATION_CATALOG.map((integration) => [integration.name, integration.family, integration.status, plain(integration.summary)]),
    ).toEqual(DECIDED_TOOLS);
  });

  it("puts the tools family by family, each family with at least one tool", () => {
    const familyIds = INTEGRATION_FAMILIES.map((family) => family.id);
    const positions = INTEGRATION_CATALOG.map((integration) => familyIds.indexOf(integration.family));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(new Set(positions)).toEqual(new Set(familyIds.map((_, index) => index)));
  });

  it("keeps the addresses and the waiting lists unique", () => {
    expect(new Set(INTEGRATION_CATALOG.map((integration) => integration.slug)).size).toBe(INTEGRATION_CATALOG.length);
    const connectors = INTEGRATION_CATALOG.flatMap((integration) => (integration.status === "soon" ? [integration.connector] : []));
    expect(new Set(connectors).size).toBe(connectors.length);
  });

  it("keeps every page already published, unchanged", () => {
    for (const integration of INTEGRATIONS) expect(INTEGRATION_CATALOG).toContain(integration);
  });

  it("gives each tool to come its row on the Connecteurs page, with the same name and sentence", () => {
    const soon = INTEGRATION_CATALOG.flatMap((integration) =>
      integration.status === "soon" ? [[integration.connector, integration.name, integration.summary]] : [],
    );
    expect(CATALOG_UPCOMING_CONNECTORS.map((connector) => [connector.id, connector.name, connector.description])).toEqual(soon);
  });

  it("promises no date, and no partnership (connecteurs.md, commercialisation.md)", () => {
    const dated = /\b(20\d\d|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|semaines?|trimestre)\b/i;
    for (const text of INTEGRATION_CATALOG.flatMap(textsOf)) {
      expect(text).not.toMatch(dated);
      expect(text).not.toMatch(/partenaire/i);
    }
  });

  it("keeps each description short enough for search results", () => {
    for (const integration of INTEGRATION_CATALOG) expect(integration.seo.description.length).toBeLessThanOrEqual(160);
  });
});

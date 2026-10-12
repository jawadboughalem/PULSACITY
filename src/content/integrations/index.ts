import { CALENDLY } from "./calendly";
import { CAL_COM } from "./cal-com";
import { EVENTBRITE } from "./eventbrite";
import { HELLOASSO } from "./helloasso";
import { KAJABI } from "./kajabi";
import { LEARNYBOX } from "./learnybox";
import { LIVESTORM } from "./livestorm";
import { MAKE } from "./make";
import { describeMeanwhile } from "./meanwhile";
import { N8N } from "./n8n";
import { PAYPAL } from "./paypal";
import { PODIA } from "./podia";
import { SCHOOLMAKER } from "./schoolmaker";
import { SHOPIFY } from "./shopify";
import { STRIPE } from "./stripe";
import { SYSTEME_IO } from "./systeme-io";
import type { Integration } from "./types";
import { UNIVERSAL } from "./universal";
import { WEEZEVENT } from "./weezevent";
import { WOOCOMMERCE } from "./woocommerce";
import { ZAPIER } from "./zapier";

/**
 * The catalog of docs-internes/decisions/connecteurs.md: the 19 tools shown in V0, one content file each, family by
 * family in its order. The grouping in families comes with the v2 mock-ups (lots 4.6 and 4.7).
 */
export const INTEGRATIONS: Integration[] = [
  SYSTEME_IO,
  LEARNYBOX,
  KAJABI,
  SCHOOLMAKER,
  PODIA,
  CALENDLY,
  CAL_COM,
  STRIPE,
  PAYPAL,
  LIVESTORM,
  HELLOASSO,
  WEEZEVENT,
  EVENTBRITE,
  WOOCOMMERCE,
  SHOPIFY,
  UNIVERSAL,
  ZAPIER,
  MAKE,
  N8N,
];

/** The home page names a few (m7): the tools available today, then the first to come. */
export const FEATURED_INTEGRATIONS: Integration[] = [SYSTEME_IO, UNIVERSAL, STRIPE, CALENDLY];

export const findIntegration = (slug: string): Integration | null =>
  INTEGRATIONS.find((integration) => integration.slug === slug) ?? null;

/** « En attendant : avec Zapier ou Make », for the row of a tool to come in the space (m5). */
export const readMeanwhileLine = (connectorId: string): string | null => {
  const integration = INTEGRATIONS.find((page) => page.status === "soon" && page.connector === connectorId);
  return integration?.status === "soon" ? describeMeanwhile(integration).line : null;
};

export { describeMeanwhile } from "./meanwhile";
export { INTEGRATION_FAMILIES, type IntegrationFamilyId } from "./families";
export type { AvailableIntegration, InstallStep, Integration, MeanwhileItem, RichText, UpcomingIntegration } from "./types";

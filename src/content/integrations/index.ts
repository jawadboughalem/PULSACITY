import { CALENDLY } from "./calendly";
import { CAL_COM } from "./cal-com";
import { EVENTBRITE } from "./eventbrite";
import { HELLOASSO } from "./helloasso";
import { KAJABI } from "./kajabi";
import { LEARNYBOX } from "./learnybox";
import { LIVESTORM } from "./livestorm";
import { MAKE } from "./make";
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

/** One content file per connector: the order of the lists, the available ones first. */
export const INTEGRATIONS: Integration[] = [SYSTEME_IO, UNIVERSAL, STRIPE, CALENDLY];

/**
 * The catalog of docs-internes/decisions/connecteurs.md: the 19 tools shown in V0, family by family, in its order.
 * Ready, not published: it takes the place of INTEGRATIONS with the universal connector (lot 4.1 b).
 */
export const INTEGRATION_CATALOG: Integration[] = [
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

export const findIntegration = (slug: string): Integration | null =>
  INTEGRATIONS.find((integration) => integration.slug === slug) ?? null;

export { INTEGRATION_FAMILIES, type IntegrationFamilyId } from "./families";
export type { AvailableIntegration, InstallStep, Integration, MeanwhileItem, RichText, UpcomingIntegration } from "./types";

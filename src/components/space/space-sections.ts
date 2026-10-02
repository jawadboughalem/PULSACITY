import type { IconName } from "@/components/ui/icon-paths";

export type SpaceSection = {
  label: string;
  href: string;
  icon: IconName;
};

const HOME: SpaceSection = { label: "Accueil", href: "/app", icon: "home" };
const TESTIMONIALS: SpaceSection = { label: "Témoignages", href: "/app/temoignages", icon: "quote" };
const OFFERS: SpaceSection = { label: "Offres", href: "/app/offres", icon: "tag" };
const WIDGETS: SpaceSection = { label: "Widgets", href: "/app/widgets", icon: "grid" };
const CONNECTORS: SpaceSection = { label: "Connecteurs", href: "/app/connecteurs", icon: "connection" };
const REQUESTS: SpaceSection = { label: "Demandes", href: "/app/demandes", icon: "mail" };
const SETTINGS: SpaceSection = { label: "Réglages", href: "/app/reglages", icon: "sliders" };
const MORE: SpaceSection = { label: "Plus", href: "/app/plus", icon: "more" };

export const DESKTOP_SECTIONS = [HOME, TESTIMONIALS, OFFERS, WIDGETS, CONNECTORS, REQUESTS, SETTINGS];

export const MOBILE_SECTIONS = [HOME, TESTIMONIALS, REQUESTS, MORE];

export const MORE_SECTIONS = [OFFERS, WIDGETS, CONNECTORS, SETTINGS];

export const ACCOUNT_SECTIONS: SpaceSection[] = [
  { label: "Mon compte", href: "/app/reglages", icon: "user" },
  { label: "Abonnement et factures", href: "/app/facturation", icon: "card" },
  { label: "Aide et contact", href: "/aide", icon: "help" },
];

export const TESTIMONIALS_SECTION_HREF = TESTIMONIALS.href;

export const ADD_TESTIMONIAL_HREF = `${TESTIMONIALS.href}/ajouter`;

export const IMPORT_TESTIMONIALS_HREF = `${TESTIMONIALS.href}/importer`;

export const OFFERS_SECTION_HREF = OFFERS.href;

export const REQUESTS_SECTION_HREF = REQUESTS.href;

export const WIDGETS_SECTION_HREF = WIDGETS.href;

export const widgetEditorHref = (widgetId: string) => `${WIDGETS.href}/${widgetId}`;

/** « Coller dans Systeme.io » on its own page, for a phone. */
export const widgetGuideHref = (widgetId: string) => `${widgetEditorHref(widgetId)}/guide`;

export const SYSTEME_CONNECTOR_HREF = `${CONNECTORS.href}/systeme`;

export const CONNECTORS_SECTION_HREF = CONNECTORS.href;

export const MORE_SECTION_HREF = MORE.href;

export const BILLING_HREF = "/app/facturation";

const isWithin = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export const isSectionActive = (section: SpaceSection, pathname: string): boolean => {
  if (section === HOME) return pathname === HOME.href;
  if (section === MORE) {
    return isWithin(pathname, MORE.href) || [...MORE_SECTIONS, ...ACCOUNT_SECTIONS].some((other) => isWithin(pathname, other.href));
  }
  return isWithin(pathname, section.href);
};

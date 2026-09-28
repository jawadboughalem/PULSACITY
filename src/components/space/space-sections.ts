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
const MORE: SpaceSection = { label: "Plus", href: "/app/reglages", icon: "more" };

export const DESKTOP_SECTIONS = [HOME, TESTIMONIALS, OFFERS, WIDGETS, CONNECTORS, REQUESTS, SETTINGS];

export const MOBILE_SECTIONS = [HOME, TESTIMONIALS, REQUESTS, WIDGETS, MORE];

export const TESTIMONIALS_SECTION_HREF = TESTIMONIALS.href;

export const SYSTEME_CONNECTOR_HREF = `${CONNECTORS.href}/systeme`;

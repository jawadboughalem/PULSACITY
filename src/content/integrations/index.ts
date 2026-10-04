import { CALENDLY } from "./calendly";
import { STRIPE } from "./stripe";
import { SYSTEME_IO } from "./systeme-io";
import type { Integration } from "./types";

/** One content file per connector: the order of the lists, the available ones first. */
export const INTEGRATIONS: Integration[] = [SYSTEME_IO, STRIPE, CALENDLY];

export const findIntegration = (slug: string): Integration | null =>
  INTEGRATIONS.find((integration) => integration.slug === slug) ?? null;

export type { AvailableIntegration, InstallStep, Integration, RichText, UpcomingIntegration } from "./types";

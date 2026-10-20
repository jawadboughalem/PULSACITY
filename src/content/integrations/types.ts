import type { IconName } from "@/components/ui/icon-paths";
import type { FaqEntry } from "../faq";
import type { IntegrationFamilyId } from "./families";

/** A sentence of a step, in bold where it names what the creator clicks on, with a link to a page of the site. */
export type RichText = Array<string | { strong: string } | { link: string; href: string }>;

export type InstallStep = {
  title: string;
  text: RichText;
  /** A part of the space or of Systeme.io under the text: the same drawings as in the creator's space. */
  illustration?:
    | "connection-address"
    | "systeme-webhook-screens"
    | "connection-success"
    | "paste-widget-screens"
    | "systeme-enrollment-rule"
    | "universal-fields";
  /** A line under the illustration, in small. */
  note?: RichText;
};

type IntegrationBase = {
  /** In the address: /integrations/systeme-io. The same as the connector's slug in the space. */
  slug: string;
  name: string;
  /** Its family in the catalog (decisions/connecteurs.md). */
  family: IntegrationFamilyId;
  /** One line under the name, on /integrations (m21): the sentence of decisions/connecteurs.md. */
  summary: string;
  seo: { title: string; description: string };
  heading: string;
  intro: string;
};

/** A connector that works today: what it does, how to install it, its own questions (m21, Systeme.io). */
export type AvailableIntegration = IntegrationBase & {
  status: "available";
  /** false for the universal connector: its address alone authenticates the sales, without a secret key. */
  hasSigningKey?: boolean;
  /** « Installer la connexion Systeme.io, pas à pas » when not given. */
  installTitle?: string;
  /** The sentence of the final call: « Connectez Systeme.io : la prochaine vente fait le reste. » when not given. */
  finalCall?: string;
  benefits: Array<{ title: string; text: string }>;
  installIntro: string;
  installSteps: InstallStep[];
  optionalStep?: InstallStep;
  faq: FaqEntry[];
};

/** A connector to come: « Me prévenir », what it will do, what works meanwhile (m21, Stripe and Calendly). */
export type UpcomingIntegration = IntegrationBase & {
  status: "soon";
  /** Its id among the upcoming connectors of the space (« Me prévenir »). */
  connector: string;
  willDo: string[];
  /**
   * How its sales reach PULSACITY meanwhile: with Zapier or Make by default (decisions/connecteurs.md), the universal
   * connector itself for Zapier, Make and n8n, Zapier alone for Podia.
   */
  meanwhileVia?: "zapier-or-make" | "universal" | "zapier";
  /** The guide that sends its sales to the universal connector today: « En attendant » links to it. */
  guideSlug?: string;
  /**
   * What the tool sends, when « chaque vente » does not say it (maquettes 3.5, Stripe): the end of « Une fois installée,
   * plus rien à faire : … » and what becomes a request in « En attendant ».
   */
  sales?: { arrive: string; become: string };
};

export type Integration = AvailableIntegration | UpcomingIntegration;

/** What works with any tool, while its connector is to come. */
export type MeanwhileItem = { title: string; text: string; icon?: IconName; link?: { href: string; label: string } };

import type { IconName } from "@/components/ui/icon-paths";
import type { FaqEntry } from "../faq";

/** A sentence of a step, in bold where it names what the creator clicks on. */
export type RichText = Array<string | { strong: string }>;

export type InstallStep = {
  title: string;
  text: RichText;
  /** A part of the space or of Systeme.io under the text: the same drawings as in the creator's space. */
  illustration?:
    | "connection-address"
    | "systeme-webhook-screens"
    | "connection-success"
    | "paste-widget-screens"
    | "systeme-enrollment-rule";
  /** A line under the illustration, in small. */
  note?: RichText;
};

type IntegrationBase = {
  /** In the address: /integrations/systeme-io. The same as the connector's slug in the space. */
  slug: string;
  name: string;
  /** One line under the name, on /integrations (m21). */
  summary: string;
  seo: { title: string; description: string };
  heading: string;
  intro: string;
};

/** A connector that works today: what it does, how to install it, its own questions (m21, Systeme.io). */
export type AvailableIntegration = IntegrationBase & {
  status: "available";
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
};

export type Integration = AvailableIntegration | UpcomingIntegration;

/** What works with any tool, while its connector is to come. */
export type MeanwhileItem = { title: string; text: string; icon?: IconName };

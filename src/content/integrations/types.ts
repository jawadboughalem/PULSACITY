import type { FaqEntry } from "../faq";

/** A sentence of a step, in bold where it names what the creator clicks on. */
export type RichText = Array<string | { strong: string }>;

export type InstallStep = {
  title: string;
  text: RichText;
  /** A part of the app shown under the text, the same as in the creator's space. */
  illustration?: "systeme-webhook-screens" | "systeme-enrollment-rule" | "paste-widget-screens";
};

type IntegrationBase = {
  /** In the address: /integrations/systeme-io. The same as the connector's slug in the space. */
  slug: string;
  name: string;
  /** One line in the lists of the home page and /integrations. */
  summary: string;
  seo: { title: string; description: string };
  heading: string;
  intro: string;
};

/** A connector that works today: what it does, how to install it, its own questions. */
export type AvailableIntegration = IntegrationBase & {
  status: "available";
  benefits: Array<{ title: string; text: string }>;
  installSteps: InstallStep[];
  optionalStep?: InstallStep;
  afterInstall: string;
  faq: FaqEntry[];
  /** The guide that goes further, by its slug in /guides. */
  relatedGuide: string;
};

/** A connector to come: what it will do, « Me prévenir », and what works meanwhile. */
export type UpcomingIntegration = IntegrationBase & {
  status: "soon";
  /** Its id among the upcoming connectors of the space (« Me prévenir »). */
  connector: string;
  willDo: string[];
  meanwhile: Array<{ title: string; text: string }>;
};

export type Integration = AvailableIntegration | UpcomingIntegration;

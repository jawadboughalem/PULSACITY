import { Fragment, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { quoteInFrench } from "@/lib/french/typography";
import { ChooseEventsDrawing, FillWebhookDrawing, OpenWebhooksDrawing } from "./systeme/SystemeSettingsDrawings";

type GuidePart = string | { strong: string };

type GuideStep = { drawing: ReactNode; parts: GuidePart[] };

/** Step 2 of maquette 5, platform by platform: where to paste the address and the secret. */
const GUIDES: Record<string, GuideStep[]> = {
  systeme: [
    {
      drawing: <OpenWebhooksDrawing />,
      parts: [
        "Cliquez sur votre photo de profil, puis ",
        { strong: "Paramètres" },
        " et ",
        { strong: "Webhooks" },
        ". Cliquez sur ",
        { strong: "Créer" },
        ".",
      ],
    },
    {
      drawing: <FillWebhookDrawing />,
      parts: [
        `Nommez-le ${quoteInFrench("PULSACITY")}. Collez l'adresse dans le champ `,
        { strong: "URL" },
        " et la clé dans ",
        { strong: "Secret" },
        ".",
      ],
    },
    {
      drawing: <ChooseEventsDrawing />,
      parts: [
        "Cochez ",
        { strong: "Nouvelle vente" },
        " et ",
        { strong: "Vente annulée" },
        ", activez le webhook, puis ",
        { strong: "Enregistrer" },
        ".",
      ],
    },
  ],
};

const renderPart = (part: GuidePart, index: number) =>
  typeof part === "string" ? (
    <Fragment key={index}>{part}</Fragment>
  ) : (
    <strong key={index} className="font-bold">
      {part.strong}
    </strong>
  );

type ConnectionGuideProps = {
  connectorId: string;
  connectorName: string;
};

export const ConnectionGuide = ({ connectorId, connectorName }: ConnectionGuideProps) => {
  const steps = GUIDES[connectorId];
  if (!steps) {
    return (
      <p className="max-w-text text-body">{`Collez l'adresse et la clé secrète dans les réglages de ${connectorName}.`}</p>
    );
  }
  return (
    <ol className="grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-6">
      {steps.map((step, index) => (
        <li key={index} className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-card bg-sky">{step.drawing}</div>
          <p className="text-small">
            <span className="font-bold">{`${index + 1}.`}</span> {step.parts.map(renderPart)}
          </p>
        </li>
      ))}
    </ol>
  );
};

type RuleBox = { caption: string; name: string; hint: string };

type OptionalGuide = {
  title: string;
  description: string;
  rule: [RuleBox, Omit<RuleBox, "hint"> & { hint: (addressStep: number) => string }];
  parts: GuidePart[];
};

/**
 * The step after the three, marked « + » in maquette 5: what the connection receives besides sales. For Systeme.io, a
 * formation joined without a sale, sent by an automation rule to the same address (labels captured on 27 September).
 */
const OPTIONAL_GUIDES: Record<string, OptionalGuide> = {
  systeme: {
    title: "Facultatif : les inscriptions sans vente",
    description:
      "Vous offrez une formation ? Systeme.io n'y voit pas de vente. Une règle d'automatisation nous prévient quand même de chaque inscription, à la même adresse.",
    rule: [
      { caption: "Déclencheur", name: "Inscrit à la formation", hint: "Choisissez la formation offerte." },
      { caption: "Action", name: "Appeler un webhook", hint: (addressStep) => `Collez l'adresse de l'étape ${addressStep}.` },
    ],
    parts: [
      "Dans Systeme.io : ",
      { strong: "Automatisations" },
      ", puis ",
      { strong: "Règles" },
      " et ",
      { strong: "Créer" },
      ". Chaque inscription arrive ici avec le nom de la formation : associez-la à une offre, et la demande d'avis part au délai choisi.",
    ],
  },
};

/** Ciel on the public page; Nuage in the space, where the step sits on a white card (maquettes 3.4). */
type RuleSurface = "sky" | "cloud";

const RuleCard = ({ caption, name, hint, surface }: RuleBox & { surface: RuleSurface }) => (
  <div className={cn("flex flex-1 flex-col gap-1 rounded-card p-4", surface === "cloud" ? "bg-cloud" : "bg-sky")}>
    <p className="text-small text-gray">{caption}</p>
    <p className="text-body font-bold">{name}</p>
    <p className="text-small">{hint}</p>
  </div>
);

type ConnectionRuleProps = {
  connectorId: string;
  /** The step where the address is copied: the first in the space (m5), the second on the public page (m21). */
  addressStep: number;
  surface?: RuleSurface;
};

/** The automation rule of the optional step: its trigger, then its action. Also on the public page of the connector. */
export const ConnectionRule = ({ connectorId, addressStep, surface = "sky" }: ConnectionRuleProps) => {
  const guide = OPTIONAL_GUIDES[connectorId];
  if (!guide) return null;
  const [trigger, action] = guide.rule;
  return (
    <div className="flex max-w-[720px] flex-col items-stretch gap-2 desktop:flex-row desktop:items-center desktop:gap-4">
      <RuleCard {...trigger} surface={surface} />
      <Icon name="chevronDown" size={20} className="shrink-0 self-center desktop:hidden" />
      <Icon name="chevronRight" size={20} className="hidden shrink-0 desktop:block" />
      <RuleCard {...action} hint={action.hint(addressStep)} surface={surface} />
    </div>
  );
};

export const ConnectionOptionalStep = ({ connectorId }: { connectorId: string }) => {
  const guide = OPTIONAL_GUIDES[connectorId];
  if (!guide) return null;
  return (
    <section aria-labelledby="optional-step" className="flex gap-3 pt-3 desktop:gap-4">
      <span
        aria-hidden="true"
        className="flex size-[36px] shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white"
      >
        <Icon name="plus" size={20} />
      </span>
      <div className="flex min-w-[0] flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1 pt-[4px]">
          <h3 id="optional-step" className="font-display text-h3">
            {guide.title}
          </h3>
          <p className="max-w-text text-body text-gray">{guide.description}</p>
        </div>
        <ConnectionRule connectorId={connectorId} addressStep={1} surface="cloud" />
        <p className="max-w-text text-small">{guide.parts.map(renderPart)}</p>
      </div>
    </section>
  );
};

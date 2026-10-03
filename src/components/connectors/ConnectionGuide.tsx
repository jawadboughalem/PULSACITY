import { Fragment, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
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
    <strong key={index} className="font-semibold">
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
    <ol className="grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-5">
      {steps.map((step, index) => (
        <li key={index} className="flex flex-col gap-3">
          <div className="border border-hairline-200 bg-paper-100">{step.drawing}</div>
          <p className="text-small">
            <span className="font-semibold">{`${index + 1}.`}</span> {step.parts.map(renderPart)}
          </p>
        </li>
      ))}
    </ol>
  );
};

type RuleBox = { caption: string; name: string; hint: string };

type OptionalGuide = { title: string; description: string; rule: [RuleBox, RuleBox]; parts: GuidePart[] };

/**
 * The step after the three, marked « + » in maquette 5: what the connection receives besides sales. For Systeme.io, a
 * formation joined without a sale, sent by an automation rule to the same address (labels captured on 27 September).
 */
const OPTIONAL_GUIDES: Record<string, OptionalGuide> = {
  systeme: {
    title: "Facultatif : les inscriptions sans vente",
    description:
      "Vous offrez une formation ? Systeme.io n'y voit pas de vente. Une règle d'automatisation nous prévient quand même de chaque inscription, à la même adresse.",
    rule: [
      { caption: "Déclencheur", name: "Inscrit à la formation", hint: "Choisissez la formation offerte." },
      { caption: "Action", name: "Appeler un webhook", hint: "Collez l'adresse de l'étape 1." },
    ],
    parts: [
      "Dans Systeme.io : ",
      { strong: "Automatisations" },
      ", puis ",
      { strong: "Règles" },
      " et ",
      { strong: "Créer" },
      ". Chaque inscription arrive ici avec le nom de la formation : associez-la à une offre, et la demande d'avis part au délai choisi.",
    ],
  },
};

const RuleCard = ({ caption, name, hint }: RuleBox) => (
  <div className="flex flex-1 flex-col gap-1 border border-hairline-200 bg-white p-4">
    <p className="text-small text-slate-600">{caption}</p>
    <p className="text-body font-semibold">{name}</p>
    <p className="text-small">{hint}</p>
  </div>
);

export const ConnectionOptionalStep = ({ connectorId }: { connectorId: string }) => {
  const guide = OPTIONAL_GUIDES[connectorId];
  if (!guide) return null;
  const [trigger, action] = guide.rule;
  return (
    <section aria-labelledby="optional-step" className="flex gap-4 border-b border-hairline-200 py-6 desktop:gap-5 desktop:py-7">
      <span
        aria-hidden="true"
        className="flex size-[32px] shrink-0 items-center justify-center rounded-full border border-ink-900 bg-white desktop:size-[40px]"
      >
        <Icon name="plus" size={20} />
      </span>
      <div className="flex min-w-[0] flex-1 flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h3 id="optional-step" className="font-serif text-quote font-medium">
            {guide.title}
          </h3>
          <p className="max-w-text text-body text-slate-600">{guide.description}</p>
        </div>
        <div className="flex max-w-[720px] flex-col items-stretch gap-2 desktop:flex-row desktop:items-center desktop:gap-4">
          <RuleCard {...trigger} />
          <Icon name="chevronDown" size={20} className="shrink-0 self-center desktop:hidden" />
          <Icon name="chevronRight" size={20} className="hidden shrink-0 desktop:block" />
          <RuleCard {...action} />
        </div>
        <p className="max-w-text text-small">{guide.parts.map(renderPart)}</p>
      </div>
    </section>
  );
};

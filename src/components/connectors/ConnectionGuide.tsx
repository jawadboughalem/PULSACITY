import { Fragment, type ReactNode } from "react";
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

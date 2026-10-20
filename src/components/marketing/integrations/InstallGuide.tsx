import type { ReactNode } from "react";
import { ConnectionGuide, ConnectionRule } from "@/components/connectors/ConnectionGuide";
import { UniversalFieldList } from "@/components/connectors/UniversalFieldList";
import { RichTextLine } from "@/components/marketing/RichTextLine";
import { Icon } from "@/components/ui/Icon";
import { PasteGuideSteps } from "@/components/widgets/SystemePasteGuide";
import type { AvailableIntegration, InstallStep } from "@/content/integrations";
import { cn } from "@/lib/cn";
import { ConnectionAddressFrame, ConnectionSuccessFrame } from "./SpacePreviewFrames";

/** The step where the address and the key are copied: the rule of the optional step sends back to it. */
const findAddressStep = (steps: InstallStep[]): number =>
  steps.findIndex((step) => step.illustration === "connection-address") + 1;

/** The same drawings as in the creator's space: what the page says is what they will see. */
const renderIllustration = (
  illustration: NonNullable<InstallStep["illustration"]>,
  addressStep: number,
  integration: AvailableIntegration,
): ReactNode => {
  switch (illustration) {
    case "connection-address":
      return <ConnectionAddressFrame connectorName={integration.name} hasSigningKey={integration.hasSigningKey ?? true} />;
    case "systeme-webhook-screens":
      return <ConnectionGuide connectorId="systeme" connectorName="Systeme.io" frame="cloud" />;
    case "connection-success":
      return <ConnectionSuccessFrame connectorName={integration.name} />;
    case "universal-fields":
      return <UniversalFieldList />;
    case "paste-widget-screens":
      return <PasteGuideSteps layout="pairs" frame="cloud" />;
    case "systeme-enrollment-rule":
      return (
        <div className="desktop:max-w-[640px]">
          <ConnectionRule connectorId="systeme" addressStep={addressStep} surface="cloud" />
        </div>
      );
  }
};

type StepRowProps = {
  marker: ReactNode;
  /** Read before the title, for screen readers: « Étape 2 : ». */
  spokenPrefix?: string;
  isOptional?: boolean;
  step: InstallStep;
  addressStep: number;
  integration: AvailableIntegration;
};

/**
 * A step of maquettes 3.5 (charte v2, Étapes numérotées): its number on a Soleil disc of 36, its title and its sentence
 * in a column; under them, its drawing, in the column of the text.
 */
const StepRow = ({ marker, spokenPrefix, isOptional = false, step, addressStep, integration }: StepRowProps) => (
  <div className="grid grid-cols-[36px_minmax(0,1fr)] gap-x-3 gap-y-4 desktop:gap-x-4 desktop:gap-y-5">
    <span
      aria-hidden="true"
      className={cn(
        "flex size-[36px] items-center justify-center rounded-full",
        isOptional ? "border-2 border-ink bg-white" : "bg-sun font-display text-[18px] leading-[1]",
      )}
    >
      {marker}
    </span>
    <div className="flex flex-col gap-2 pt-[4px]">
      <h3 className="font-display text-h3">
        {spokenPrefix ? <span className="sr-only">{spokenPrefix}</span> : null}
        {step.title}
      </h3>
      <p className="max-w-text text-body text-gray">
        <RichTextLine parts={step.text} />
      </p>
    </div>
    {step.illustration ? (
      <div className="col-start-2">
        {renderIllustration(step.illustration, addressStep, integration)}
      </div>
    ) : null}
    {step.note ? (
      <p className="col-start-2 max-w-[560px] text-small">
        <RichTextLine parts={step.note} />
      </p>
    ) : null}
  </div>
);

/**
 * « Installer la connexion », step by step, on a white card (maquettes 3.5), spaced without rules, then the optional
 * step marked « + ».
 */
export const InstallGuide = ({ integration }: { integration: AvailableIntegration }) => {
  const addressStep = findAddressStep(integration.installSteps);
  return (
    <div className="flex flex-col gap-10 rounded-panel bg-white p-4 desktop:p-10">
      <ol className="flex flex-col gap-10">
        {integration.installSteps.map((step, index) => (
          <li key={step.title}>
            <StepRow
              marker={index + 1}
              spokenPrefix={`Étape ${index + 1} : `}
              step={step}
              addressStep={addressStep}
              integration={integration}
            />
          </li>
        ))}
      </ol>
      {integration.optionalStep ? (
        <StepRow
          marker={<Icon name="plus" size={20} />}
          isOptional
          step={integration.optionalStep}
          addressStep={addressStep}
          integration={integration}
        />
      ) : null}
    </div>
  );
};

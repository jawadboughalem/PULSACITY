import type { ReactNode } from "react";
import { ConnectionGuide, ConnectionRule } from "@/components/connectors/ConnectionGuide";
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
const renderIllustration = (illustration: NonNullable<InstallStep["illustration"]>, addressStep: number): ReactNode => {
  switch (illustration) {
    case "connection-address":
      return <ConnectionAddressFrame />;
    case "systeme-webhook-screens":
      return <ConnectionGuide connectorId="systeme" connectorName="Systeme.io" />;
    case "connection-success":
      return <ConnectionSuccessFrame />;
    case "paste-widget-screens":
      return <PasteGuideSteps layout="pairs" />;
    case "systeme-enrollment-rule":
      return (
        <div className="desktop:max-w-[640px]">
          <ConnectionRule connectorId="systeme" addressStep={addressStep} />
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
};

/**
 * A step of m21: its number, its title and its sentence in a column; under them, its drawing, the full width on a phone
 * and in the column of the text on a computer.
 */
const StepRow = ({ marker, spokenPrefix, isOptional = false, step, addressStep }: StepRowProps) => (
  <div className="grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 gap-y-5 border-b border-hairline-200 py-6 desktop:grid-cols-[40px_minmax(0,1fr)] desktop:gap-x-5 desktop:py-6">
    <span
      aria-hidden="true"
      className={cn(
        "flex size-[32px] items-center justify-center rounded-full desktop:size-[40px]",
        isOptional
          ? "border border-ink-900 bg-white"
          : "bg-ink-900 font-serif text-body text-white desktop:text-quote",
      )}
    >
      {marker}
    </span>
    <div className="flex flex-col gap-2">
      <h3 className="font-serif text-quote font-medium">
        {spokenPrefix ? <span className="sr-only">{spokenPrefix}</span> : null}
        {step.title}
      </h3>
      <p className="max-w-text text-body text-slate-600">
        <RichTextLine parts={step.text} />
      </p>
    </div>
    {step.illustration ? (
      <div className="col-span-2 desktop:col-span-1 desktop:col-start-2">
        {renderIllustration(step.illustration, addressStep)}
      </div>
    ) : null}
    {step.note ? (
      <p className="col-span-2 max-w-[560px] text-small desktop:col-span-1 desktop:col-start-2">
        <RichTextLine parts={step.note} />
      </p>
    ) : null}
  </div>
);

/** « Installer la connexion », step by step under a rule of Encre (m21), then the optional step marked « + ». */
export const InstallGuide = ({ integration }: { integration: AvailableIntegration }) => {
  const addressStep = findAddressStep(integration.installSteps);
  return (
    <div className="border-t border-ink-900">
      <ol>
        {integration.installSteps.map((step, index) => (
          <li key={step.title}>
            <StepRow
              marker={index + 1}
              spokenPrefix={`Étape ${index + 1} : `}
              step={step}
              addressStep={addressStep}
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
        />
      ) : null}
    </div>
  );
};

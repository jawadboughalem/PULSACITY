import type { ReactNode } from "react";
import { ConnectionGuide, ConnectionRule } from "@/components/connectors/ConnectionGuide";
import { RichTextLine } from "@/components/marketing/RichTextLine";
import { Icon } from "@/components/ui/Icon";
import { PasteGuideSteps } from "@/components/widgets/SystemePasteGuide";
import type { AvailableIntegration, InstallStep } from "@/content/integrations";

/** The same drawings as in the creator's space: what the page says is what they will see. */
const ILLUSTRATIONS: Record<NonNullable<InstallStep["illustration"]>, ReactNode> = {
  "systeme-webhook-screens": <ConnectionGuide connectorId="systeme" connectorName="Systeme.io" />,
  "systeme-enrollment-rule": <ConnectionRule connectorId="systeme" />,
  "paste-widget-screens": <PasteGuideSteps layout="grid" />,
};

type StepRowProps = {
  marker: ReactNode;
  /** Read before the title, for screen readers: « Étape 2 : ». */
  spokenPrefix?: string;
  isOptional?: boolean;
  step: InstallStep;
};

const StepRow = ({ marker, spokenPrefix, isOptional = false, step }: StepRowProps) => (
  <div className="flex gap-4 border-b border-hairline-200 py-6 desktop:gap-5 desktop:py-7">
    <span
      aria-hidden="true"
      className={
        isOptional
          ? "flex size-[32px] shrink-0 items-center justify-center rounded-full border border-ink-900 bg-white desktop:size-[40px]"
          : "flex size-[32px] shrink-0 items-center justify-center rounded-full bg-ink-900 font-serif text-body text-white desktop:size-[40px] desktop:text-quote"
      }
    >
      {marker}
    </span>
    <div className="flex min-w-[0] flex-1 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-quote font-medium">
          {spokenPrefix ? <span className="sr-only">{spokenPrefix}</span> : null}
          {step.title}
        </h3>
        <p className="max-w-text text-body text-slate-600">
          <RichTextLine parts={step.text} />
        </p>
      </div>
      {step.illustration ? ILLUSTRATIONS[step.illustration] : null}
    </div>
  </div>
);

/** « Installer la connexion », step by step, like Connecteurs › Systeme.io in the space (m5). */
export const InstallGuide = ({ integration }: { integration: AvailableIntegration }) => (
  <div className="border-t border-ink-900">
    <ol>
      {integration.installSteps.map((step, index) => (
        <li key={step.title}>
          <StepRow marker={index + 1} spokenPrefix={`Étape ${index + 1} : `} step={step} />
        </li>
      ))}
    </ol>
    {integration.optionalStep ? (
      <StepRow marker={<Icon name="plus" size={20} />} isOptional step={integration.optionalStep} />
    ) : null}
  </div>
);

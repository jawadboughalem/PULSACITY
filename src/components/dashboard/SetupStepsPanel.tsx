import Link from "next/link";
import type { ReactNode } from "react";
import { CONNECTORS_SECTION_HREF } from "@/components/space/space-sections";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { SetupSteps } from "@/lib/dashboard/read-setup-steps";
import { CopyCollectionLinkButton } from "./CopyCollectionLinkButton";
import { CopyWidgetCodeButton, SendWidgetCodeButton } from "./WidgetCodeButtons";

type Step = {
  key: string;
  title: string;
  isDone: boolean;
  content?: ReactNode;
};

type SetupStepsPanelProps = {
  steps: SetupSteps;
  collectionUrl: string;
  widgetSnippet: string | null;
  approvedCount: number;
};

/** The button of a remaining step: full width on a phone; compact (44) on a computer, in the step's Nuage card. */
const STEP_BUTTON_CLASSES = "w-full desktop:h-[44px] desktop:w-auto desktop:self-start desktop:px-[18px]";

const buildSteps = ({ steps, collectionUrl, widgetSnippet, approvedCount }: SetupStepsPanelProps): Step[] => [
  { key: "account", title: "Créer votre compte", isDone: true },
  {
    key: "link",
    title: "Partager votre lien de collecte",
    isDone: steps.isLinkShared,
    content: (
      <>
        <p className="text-small text-gray">Envoyez-le à vos clients : leurs avis arrivent ici.</p>
        <CopyCollectionLinkButton url={collectionUrl} className={STEP_BUTTON_CLASSES} />
      </>
    ),
  },
  {
    key: "connection",
    title: "Connecter votre outil de vente",
    isDone: steps.connection === "active",
    content: (
      <>
        <p className="text-small text-gray">
          Chaque vente déclenchera une demande d&apos;avis<span className="hidden desktop:inline">, sans rien faire</span>.
        </p>
        <Link
          href={CONNECTORS_SECTION_HREF}
          className={cn(SECONDARY_BUTTON_CLASSES, STEP_BUTTON_CLASSES)}
        >
          <Icon name="connection" size={20} />
          Connecter mon outil
        </Link>
      </>
    ),
  },
  {
    key: "widget",
    title: "Coller le widget sur votre page de vente",
    isDone: steps.isWidgetPasted,
    content: widgetSnippet ? (
      <>
        <p className="hidden text-small text-gray desktop:block">
          {approvedCount > 0
            ? `Vos ${approvedCount} avis validés s'afficheront tout seuls.`
            : "Vos avis validés s'afficheront tout seuls."}
        </p>
        <div className="hidden flex-col gap-3 desktop:flex">
          <CopyWidgetCodeButton snippet={widgetSnippet} className={STEP_BUTTON_CLASSES} />
        </div>
        <p className="text-small text-gray desktop:hidden">
          Plus simple depuis un ordinateur : nous pouvons vous envoyer le code par e-mail.
        </p>
        <div className="desktop:hidden">
          <SendWidgetCodeButton />
        </div>
      </>
    ) : null,
  },
];

export const countDoneSteps = (steps: SetupSteps): { done: number; total: number } => {
  const states = [true, steps.isLinkShared, steps.connection === "active", steps.isWidgetPasted];
  return { done: states.filter(Boolean).length, total: states.length };
};

export const SetupStepsPanel = (props: SetupStepsPanelProps) => {
  const steps = buildSteps(props);
  const { done, total } = countDoneSteps(props.steps);

  return (
    <section aria-labelledby="setup-steps" className="flex flex-col gap-5 rounded-panel bg-white p-5 desktop:gap-6 desktop:p-7">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="setup-steps" className="font-display text-h3">
              Étapes restantes
            </h2>
            <span className="text-small text-gray desktop:hidden">{`${done} sur ${total}`}</span>
          </div>
          <p className="hidden text-small text-gray desktop:block">{`${done} étapes sur ${total} terminées`}</p>
        </div>
        {/* Charte v2, Jauge: a bar of 10 on Ciel, filled in Encre. */}
        <div
          role="progressbar"
          aria-label="Étapes terminées"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          className="h-[10px] overflow-hidden rounded-full bg-sky"
        >
          <div className="h-[10px] rounded-full bg-ink" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>
      <ul className="hidden flex-col gap-2 desktop:flex">
        {steps
          .filter((step) => step.isDone)
          .map((step) => (
            <li key={step.key} className="flex items-center gap-3 text-body text-gray">
              <Icon name="valid" size={20} className="text-success" />
              {step.title}
            </li>
          ))}
      </ul>
      <ol className="flex flex-col gap-3">
        {steps
          .filter((step) => !step.isDone)
          .map((step, index) => {
            const stepNumber = done + index + 1;
            return (
              <li key={step.key} className="flex gap-3 rounded-card bg-cloud p-4 desktop:px-4 desktop:py-5">
                {/* Charte v2, Étapes numérotées: the remaining steps are a true sequence, on a Soleil disc of 36. */}
                <span
                  aria-hidden="true"
                  className="hidden size-[36px] shrink-0 items-center justify-center rounded-full bg-sun font-display text-[18px] leading-[1] desktop:flex"
                >
                  {stepNumber}
                </span>
                <div className="flex min-w-[0] flex-1 flex-col gap-1 desktop:pt-[5px]">
                  <h3 className="text-body font-bold">{step.title}</h3>
                  <div className="flex flex-col gap-3">{step.content}</div>
                </div>
              </li>
            );
          })}
      </ol>
    </section>
  );
};

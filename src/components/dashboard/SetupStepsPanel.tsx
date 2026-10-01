import Link from "next/link";
import type { ReactNode } from "react";
import { SYSTEME_CONNECTOR_HREF } from "@/components/space/space-sections";
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

const buildSteps = ({ steps, collectionUrl, widgetSnippet, approvedCount }: SetupStepsPanelProps): Step[] => [
  { key: "account", title: "Créer votre compte", isDone: true },
  {
    key: "link",
    title: "Partager votre lien de collecte",
    isDone: steps.isLinkShared,
    content: (
      <>
        <p className="text-small text-slate-600">Envoyez-le à vos clients : leurs avis arrivent ici.</p>
        <CopyCollectionLinkButton url={collectionUrl} />
      </>
    ),
  },
  {
    key: "systeme",
    title: "Connecter Systeme.io",
    isDone: steps.systeme === "active",
    content: (
      <>
        <p className="text-small text-slate-600">
          Chaque vente déclenchera une demande d&apos;avis<span className="hidden desktop:inline">, sans rien faire</span>.
        </p>
        <Link href={SYSTEME_CONNECTOR_HREF} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}>
          Connecter Systeme.io
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
        <p className="hidden text-small text-slate-600 desktop:block">
          {approvedCount > 0
            ? `Vos ${approvedCount} avis validés s'afficheront tout seuls.`
            : "Vos avis validés s'afficheront tout seuls."}
        </p>
        <div className="hidden flex-col desktop:flex">
          <CopyWidgetCodeButton snippet={widgetSnippet} />
        </div>
        <p className="text-small text-slate-600 desktop:hidden">
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
  const states = [true, steps.isLinkShared, steps.systeme === "active", steps.isWidgetPasted];
  return { done: states.filter(Boolean).length, total: states.length };
};

export const SetupStepsPanel = (props: SetupStepsPanelProps) => {
  const steps = buildSteps(props);
  const { done, total } = countDoneSteps(props.steps);

  return (
    <section aria-labelledby="setup-steps" className="flex flex-col gap-5 bg-paper-100 p-4 desktop:p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="setup-steps" className="font-serif text-quote font-medium">
            Étapes restantes
          </h2>
          <span className="text-small text-slate-600 desktop:hidden">{`${done} sur ${total}`}</span>
        </div>
        <p className="hidden text-small text-slate-600 desktop:block">{`${done} étapes sur ${total} terminées`}</p>
        <div
          role="progressbar"
          aria-label="Étapes terminées"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
          className="h-1 bg-hairline-200"
        >
          <div className="h-1 bg-ink-900" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>
      <ul className="hidden flex-col gap-3 desktop:flex">
        {steps
          .filter((step) => step.isDone)
          .map((step) => (
            <li key={step.key} className="flex items-center gap-3 text-small text-slate-600">
              <Icon name="valid" size={20} className="text-success" />
              {step.title}
            </li>
          ))}
      </ul>
      <ol className="flex flex-col">
        {steps
          .filter((step) => !step.isDone)
          .map((step, index) => {
            const stepNumber = done + index + 1;
            return (
              <li
                key={step.key}
                className="flex gap-3 border-hairline-200 py-5 first:pt-[0] last:pb-[0] not-first:border-t desktop:first:border-t desktop:first:pt-5"
              >
                <span
                  aria-hidden="true"
                  className="hidden size-[24px] shrink-0 items-center justify-center rounded-full border border-ink-900 text-legal font-semibold desktop:flex"
                >
                  {stepNumber}
                </span>
                <div className="flex min-w-[0] flex-1 flex-col gap-3">
                  <h3 className="text-body font-semibold">{step.title}</h3>
                  {step.content}
                </div>
              </li>
            );
          })}
      </ol>
    </section>
  );
};

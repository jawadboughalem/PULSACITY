import { cn } from "@/lib/cn";

const STEP_COUNT = 2;

type OnboardingStepHeadingProps = {
  step: 1 | 2;
  title: string;
  description: string;
};

/**
 * Charte v2, Étapes d'un formulaire: « Étape 1 sur 2 » in 15/22 700, then segments of 8, Encre up to the current step,
 * Gris clair after.
 */
export const OnboardingStepHeading = ({ step, title, description }: OnboardingStepHeadingProps) => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-col gap-3">
      <p className="text-small font-bold">{`Étape ${step} sur ${STEP_COUNT}`}</p>
      <div aria-hidden="true" className="flex gap-2">
        {Array.from({ length: STEP_COUNT }, (_, index) => (
          <span key={index} className={cn("h-[8px] flex-1 rounded-full", index < step ? "bg-ink" : "bg-gray-light")} />
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-h1">{title}</h1>
      <p className="text-lead">{description}</p>
    </div>
  </div>
);

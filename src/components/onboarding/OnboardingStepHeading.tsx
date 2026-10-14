const STEP_COUNT = 2;

type OnboardingStepHeadingProps = {
  step: 1 | 2;
  title: string;
  description: string;
};

export const OnboardingStepHeading = ({ step, title, description }: OnboardingStepHeadingProps) => (
  <div className="flex flex-col gap-2">
    <p className="text-small text-gray">{`Étape ${step} sur ${STEP_COUNT}`}</p>
    <h1 className="font-display text-h1">{title}</h1>
    <p className="text-body text-gray">{description}</p>
  </div>
);

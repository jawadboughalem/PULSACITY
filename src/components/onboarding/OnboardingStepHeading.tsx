const STEP_COUNT = 2;

type OnboardingStepHeadingProps = {
  step: 1 | 2;
  title: string;
  description: string;
};

export const OnboardingStepHeading = ({ step, title, description }: OnboardingStepHeadingProps) => (
  <div className="flex flex-col gap-2">
    <p className="text-small text-slate-600">{`Étape ${step} sur ${STEP_COUNT}`}</p>
    <h1 className="font-serif text-h1 font-medium">{title}</h1>
    <p className="text-body text-slate-600">{description}</p>
  </div>
);

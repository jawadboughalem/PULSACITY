import { PhoneFrame } from '@/components/phone-frame';
import { SectionTitle } from '@/components/ui/section-title';
import { StepList } from '@/components/ui/step-list';
import type { Section } from '@/lib/lines';

type Steps = Extract<Section, { type: 'steps' }>;

/** `phoneShot` is the real mobile capture, when one has been generated. */
export function StepsSection({ section, phoneShot }: { section: Steps; phoneShot?: string }) {
  return (
    <div className="gap-title flex flex-col">
      <SectionTitle>{section.title}</SectionTitle>
      <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <StepList steps={section.items} />
        {phoneShot ? (
          <div className="mx-auto w-48 sm:w-56">
            <PhoneFrame src={phoneShot} alt="Un site livré, vu sur téléphone" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

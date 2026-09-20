import type { Section } from '@/lib/lines';

import { PhoneFrame } from '@/components/phone-frame';

import { SectionShell } from './section-shell';

type Steps = Extract<Section, { type: 'steps' }>;

/** `phoneShot` is the real mobile capture, when one has been generated. */
export function StepsSection({ section, phoneShot }: { section: Steps; phoneShot?: string }) {
  return (
    <SectionShell id="methode" title={section.title}>
      <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <ol className="space-y-8">
          {section.items.map((item, index) => (
            <li key={item.title} className="reveal flex gap-5">
              <span className="bg-accent-soft text-accent-ink mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {index + 1}
              </span>
              <div>
                <h3 className="text-ink font-semibold">{item.title}</h3>
                <p className="text-ink-muted mt-1">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
        {phoneShot ? (
          <div className="reveal mx-auto w-48 sm:w-56">
            <PhoneFrame src={phoneShot} alt="Un site livré, vu sur téléphone" />
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}

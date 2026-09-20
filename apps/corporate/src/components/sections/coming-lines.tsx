import { NotifyForm } from '@/components/notify-form';
import { Badge } from '@/components/ui/badge';
import { Divider } from '@/components/ui/divider';
import { SectionTitle } from '@/components/ui/section-title';
import type { Line } from '@/lib/lines';

import { SectionBand } from './section-band';

/**
 * Lines still in preparation: one sentence each, and a way to be told.
 *
 * Always on the paper, and always the band that puts paper back under the
 * inked call to action above it — `divided` is computed by the page from what
 * precedes, like every other band.
 */
export function ComingLinesSection({ lines, divided }: { lines: Line[]; divided: boolean }) {
  if (lines.length === 0) return null;

  return (
    <SectionBand tone="ground" divided={divided} id="a-venir" className="py-section-tight">
      <div className="gap-title flex flex-col">
        <SectionTitle>À venir</SectionTitle>
        <ul className="grid gap-10 sm:grid-cols-2">
          {lines.map((line) => (
            <li key={line.slug} className="flex flex-col items-start gap-3">
              <Badge>En préparation</Badge>
              <h3 className="text-subtitle text-ink font-semibold">{line.title}</h3>
              <p className="text-ink-muted text-body">{line.tagline}</p>
            </li>
          ))}
        </ul>

        <div className="max-w-narrow mt-4">
          <Divider />
          <div className="mt-8">
            <NotifyForm lineSlug={lines[0]!.slug} />
          </div>
        </div>
      </div>
    </SectionBand>
  );
}

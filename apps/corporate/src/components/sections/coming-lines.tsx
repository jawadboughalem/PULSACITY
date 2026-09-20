import { NotifyForm } from '@/components/notify-form';
import type { Line } from '@/lib/lines';

import { SectionShell } from './section-shell';

/** Lines still in preparation: one sentence each, and a way to be told. */
export function ComingLinesSection({ lines }: { lines: Line[] }) {
  if (lines.length === 0) return null;

  return (
    <SectionShell id="a-venir" title="À venir">
      <ul className="space-y-10">
        {lines.map((line) => (
          <li key={line.slug} className="reveal">
            <span className="bg-accent-soft text-accent-ink inline-block rounded-md px-2 py-1 text-xs font-medium uppercase tracking-wide">
              En préparation
            </span>
            <h3 className="text-ink mt-3 text-lg font-semibold">{line.title}</h3>
            <p className="text-ink-muted mt-1">{line.tagline}</p>
          </li>
        ))}
      </ul>

      <div className="border-line mt-10 border-t pt-8">
        <NotifyForm lineSlug={lines[0]!.slug} />
      </div>
    </SectionShell>
  );
}

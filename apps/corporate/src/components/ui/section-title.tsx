import { cn } from '@/lib/utils';

/** Anything that already closes the sentence; only a full stop is recoloured. */
const TERMINAL = /[.!?…:]$/;

export interface TitleParts {
  /** The heading without the stop the component draws itself. */
  readonly body: string;
  /** Whether a coral full stop is drawn after it. */
  readonly stop: boolean;
}

/**
 * Where the coral full stop goes.
 *
 * A bare title is given one; a title that already ends in a full stop keeps it,
 * recoloured; any other closing punctuation is left exactly as the content wrote
 * it. The text in `content/` is never edited — only how it is set.
 */
export function titleParts(text: string, withoutStop = false): TitleParts {
  if (withoutStop) return { body: text, stop: false };
  if (text.endsWith('.')) return { body: text.slice(0, -1), stop: true };
  if (TERMINAL.test(text)) return { body: text, stop: false };
  return { body: text, stop: true };
}

export interface SectionTitleProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3';
  /** Set when the section also shows an eyebrow: the dot is already spent. */
  withoutStop?: boolean;
  id?: string;
  className?: string;
}

/**
 * A section heading, with the coral full stop.
 *
 * The stop is typography, not content: the title in `content/` is never edited.
 * A title that already ends in punctuation keeps it — recoloured when it is a
 * full stop, left alone otherwise — and one that ends bare is given one.
 * `accent-ink` rather than `accent`, because this dot is a glyph: it has to be
 * readable as text, not merely visible as a mark.
 */
export function SectionTitle({
  children,
  as: Tag = 'h2',
  withoutStop = false,
  id,
  className,
}: SectionTitleProps) {
  const { body, stop } = titleParts(children, withoutStop);

  return (
    <Tag id={id} className={cn('font-display text-title text-ink text-balance', className)}>
      {body}
      {stop ? <span className="text-accent-ink">.</span> : null}
    </Tag>
  );
}

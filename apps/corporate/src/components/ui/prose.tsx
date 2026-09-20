import { cn } from '@/lib/utils';

export interface ProseProps {
  /** Markdown already converted to HTML — legal pages, and nothing else. */
  html: string;
  className?: string;
}

/**
 * Long-form text we do not author element by element. The rules live in
 * `globals.css` under `.legal-prose`, because there is no React element here to
 * hang a class on.
 */
export function Prose({ html, className }: ProseProps) {
  return (
    <div className={cn('legal-prose', className)} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

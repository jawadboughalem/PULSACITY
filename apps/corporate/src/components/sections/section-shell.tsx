import { cn } from '@/lib/utils';

/** Shared rhythm: one idea per screen, generous air, a hairline between sections. */
export function SectionShell({
  id,
  title,
  bordered = true,
  tinted = false,
  width = 'wide',
  children,
}: {
  id?: string;
  title?: string;
  bordered?: boolean;
  tinted?: boolean;
  width?: 'wide' | 'narrow';
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(bordered && 'border-line border-t', tinted && 'bg-accent-soft/40')}
    >
      <div
        className={cn(
          'mx-auto w-full px-4 py-20 sm:py-28',
          width === 'wide' ? 'max-w-5xl' : 'max-w-3xl',
        )}
      >
        {title ? <h2 className="reveal text-title text-ink font-semibold">{title}</h2> : null}
        <div className={cn(title && 'mt-10')}>{children}</div>
      </div>
    </section>
  );
}

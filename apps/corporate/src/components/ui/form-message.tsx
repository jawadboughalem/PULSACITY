import { CircleAlert, Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const TONES = {
  danger: { colour: 'text-danger', Icon: CircleAlert, role: 'alert' as const },
  success: { colour: 'text-success', Icon: Check, role: 'status' as const },
};

export interface FormMessageProps {
  tone: keyof typeof TONES;
  children: React.ReactNode;
  id?: string;
  /** `-1` makes the message focusable by script, for moving focus onto it. */
  tabIndex?: number;
  className?: string;
}

/**
 * What a form has to say. The icon is one of the five permitted uses: it carries
 * the outcome for anyone who does not read the colour.
 */
export function FormMessage({ tone, children, id, tabIndex, className }: FormMessageProps) {
  const { colour, Icon, role } = TONES[tone];

  return (
    <p
      id={id}
      role={role}
      tabIndex={tabIndex}
      className={cn('text-body-sm flex items-start gap-2 focus:outline-none', colour, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

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
  className?: string;
}

/**
 * What a form has to say. The icon is one of the five permitted uses: it carries
 * the outcome for anyone who does not read the colour.
 */
export function FormMessage({ tone, children, id, className }: FormMessageProps) {
  const { colour, Icon, role } = TONES[tone];

  return (
    <p id={id} role={role} className={cn('text-body-sm flex items-start gap-2', colour, className)}>
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

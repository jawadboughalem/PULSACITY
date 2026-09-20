import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * A raised block laid on the paper. Never a full-width band — changing the band
 * is `Surface`'s job.
 */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('border-line bg-surface rounded-lg border p-6', className)} {...props} />
  );
}

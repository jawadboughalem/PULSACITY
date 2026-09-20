'use client';

import * as React from 'react';

import type { ChoiceProps } from './checkbox';
import { cn } from '@/lib/utils';

export function Radio({ label, className, ...props }: ChoiceProps) {
  return (
    <label className="text-ink-muted text-body flex items-center gap-3 py-2">
      <input
        type="radio"
        className={cn(
          'border-line-strong accent-accent size-5 shrink-0',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}

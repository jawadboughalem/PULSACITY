'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface ChoiceProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/**
 * The whole row is the target: a 20 px box alone is under any reasonable touch
 * size, so the label carries the padding that brings the row to 44 px.
 */
export function Checkbox({ label, className, ...props }: ChoiceProps) {
  return (
    <label className="text-ink-muted text-body flex items-center gap-3 py-2">
      <input
        type="checkbox"
        className={cn(
          'border-line-strong accent-accent size-5 shrink-0 rounded',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}

'use client';

import * as React from 'react';

import { useFieldControl } from './field';
import { cn } from '@/lib/utils';

const CONTROL = [
  'border-line-strong bg-surface text-ink text-body w-full rounded-md border px-3 py-2',
  'placeholder:text-ink-faint',
  'focus-visible:border-accent duration-[var(--duration-fast)] ease-out transition-colors',
  'aria-[invalid]:border-danger',
  'disabled:cursor-not-allowed disabled:opacity-60',
];

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const field = useFieldControl();
  return <input className={cn(CONTROL, 'h-11', className)} {...field} {...props} />;
}

export { CONTROL as controlClasses };

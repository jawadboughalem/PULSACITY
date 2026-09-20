'use client';

import * as React from 'react';

import { useFieldControl } from './field';
import { controlClasses } from './input';
import { cn } from '@/lib/utils';

export function Textarea({
  className,
  rows = 5,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const field = useFieldControl();
  return <textarea rows={rows} className={cn(controlClasses, className)} {...field} {...props} />;
}

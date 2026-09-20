import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap',
    'duration-[var(--duration-fast)] ease-out transition-colors',
    'disabled:pointer-events-none disabled:opacity-60',
  ],
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground hover:bg-accent-hover',
        secondary: 'border-line-strong bg-surface text-ink hover:bg-ground border',
        ghost: 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
        link: 'text-accent-ink hover:text-accent h-auto p-0 underline-offset-4 hover:underline',
      },
      size: {
        /* 40, 44 and 52 px. Nothing interactive goes under 40. */
        sm: 'text-body-sm h-10 px-4',
        default: 'text-body-sm h-11 px-5',
        lg: 'text-body h-13 px-6',
      },
    },
    /*
     * A link-shaped button has no box, so it takes no height and no padding from
     * the size — only the type size. cva emits compound variants last, which is
     * what lets this win over the `size` classes above.
     */
    compoundVariants: [{ variant: 'link', class: 'h-auto px-0 py-0' }],
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

/**
 * Motion that reports a state is exempt from the reduced-motion rule: stopping
 * it would leave a static ring saying nothing.
 */
function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="size-4 shrink-0 animate-spin"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Keeps the label and adds the spinner, so the button does not change width. */
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}

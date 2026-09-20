'use client';

import { createContext, useContext, useId } from 'react';

import { FormMessage } from './form-message';

interface FieldContextValue {
  controlId: string;
  describedBy: string | undefined;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/**
 * The props a control takes from its surrounding `Field`. Empty outside one, so
 * every control still stands alone.
 */
export function useFieldControl() {
  const field = useContext(FieldContext);
  if (!field) return {};

  return {
    id: field.controlId,
    'aria-describedby': field.describedBy,
    'aria-invalid': field.invalid || undefined,
  };
}

export interface FieldProps {
  label: string;
  /** Shown inside the label, so it is announced with it rather than after it. */
  hint?: string;
  error?: string;
  /** Needed only when something outside has to point at the control. */
  id?: string;
  children: React.ReactNode;
}

/**
 * A label, a control, and what went wrong.
 *
 * The wiring is the point: the label is bound to the control, the error is
 * pointed at by `aria-describedby`, and the control is marked `aria-invalid`.
 * Written by hand at each call site, one of the three is always forgotten.
 */
export function Field({ label, hint, error, id, children }: FieldProps) {
  const generated = useId();
  const controlId = id ?? generated;
  const errorId = `${controlId}-error`;

  return (
    <FieldContext.Provider
      value={{ controlId, describedBy: error ? errorId : undefined, invalid: Boolean(error) }}
    >
      <div>
        <label htmlFor={controlId} className="text-ink text-body-sm block font-medium">
          {label}
          {hint ? <span className="text-ink-faint ml-1 font-normal">{hint}</span> : null}
        </label>
        <div className="mt-2">{children}</div>
        {error ? (
          <FormMessage tone="danger" id={errorId} className="mt-1.5">
            {error}
          </FormMessage>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

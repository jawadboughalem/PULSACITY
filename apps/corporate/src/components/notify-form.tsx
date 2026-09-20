'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { notifyMeAction, type NotifyState } from '@/actions/notify';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { FormMessage } from '@/components/ui/form-message';
import { Input } from '@/components/ui/input';

const initial: NotifyState = { status: 'idle' };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      Prévenez-moi
    </Button>
  );
}

/** One field, one promise: being told when a line opens. Nothing more. */
export function NotifyForm({ lineSlug }: { lineSlug: string }) {
  const [state, notify] = useActionState(notifyMeAction, initial);

  if (state.status === 'sent') {
    return <FormMessage tone="success">{state.message}</FormMessage>;
  }

  return (
    <form
      // Remounts on each rejected attempt so the address below reaches the input.
      key={state.status === 'error' ? state.attempt : 0}
      action={notify}
      className="relative"
    >
      <input type="hidden" name="lineSlug" value={lineSlug} />
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor={`website-${lineSlug}`}>Ne pas remplir</label>
        <input
          id={`website-${lineSlug}`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field
        label="Votre e-mail, pour être prévenu"
        id={`notify-${lineSlug}`}
        {...(state.status === 'error' ? { error: state.message } : {})}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="vous@exemple.fr"
            className="sm:max-w-xs"
            {...(state.status === 'error' && state.email ? { defaultValue: state.email } : {})}
          />
          <Submit />
        </div>
      </Field>
    </form>
  );
}

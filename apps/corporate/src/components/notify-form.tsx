'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { notifyMeAction, type NotifyState } from '@/actions/notify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initial: NotifyState = { status: 'idle' };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Envoi…' : 'Prévenez-moi'}
    </Button>
  );
}

/** One field, one promise: being told when a line opens. Nothing more. */
export function NotifyForm({ lineSlug }: { lineSlug: string }) {
  const [state, notify] = useActionState(notifyMeAction, initial);

  if (state.status === 'sent') {
    return (
      <p className="text-ink text-sm font-medium" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={notify} className="relative">
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

      <Label htmlFor={`notify-${lineSlug}`} className="text-ink-muted text-sm font-normal">
        Votre e-mail, pour être prévenu
      </Label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Input
          id={`notify-${lineSlug}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="vous@exemple.fr"
          className="sm:max-w-xs"
        />
        <Submit />
      </div>

      {state.status === 'error' ? (
        <p className="text-danger mt-2 text-sm" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

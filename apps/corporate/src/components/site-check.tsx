'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import {
  checkSiteAction,
  requestSiteAction,
  type SiteCheckState,
  type SiteRequestState,
} from '@/actions/site-check';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { demoOrigin } from '@/lib/env';

/** Off-screen decoy field. A bot fills it; a visitor never sees it. */
function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor="website">Ne pas remplir</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

function SubmitButton({
  children,
  pendingLabel,
  ...props
}: React.ComponentProps<typeof Button> & { pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-sm text-red-700" role="alert">
      {message}
    </p>
  );
}

const initialCheck: SiteCheckState = { status: 'idle' };
const initialRequest: SiteRequestState = { status: 'idle' };

export function SiteCheck() {
  const [checkState, check] = useActionState(checkSiteAction, initialCheck);
  const [requestState, request] = useActionState(requestSiteAction, initialRequest);

  const prefillName =
    checkState.status === 'none' || checkState.status === 'many' ? checkState.businessName : '';
  const prefillCity =
    checkState.status === 'none' || checkState.status === 'many' ? checkState.city : '';

  if (requestState.status === 'sent') {
    return (
      <div className="border-accent bg-accent-soft rounded-xl border p-6" role="status">
        <p className="font-medium text-neutral-900">{requestState.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form action={check} className="relative space-y-4">
        <Honeypot />
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <div>
            <Label htmlFor="check-business">Nom de votre entreprise</Label>
            <Input
              id="check-business"
              name="businessName"
              required
              minLength={2}
              maxLength={120}
              autoComplete="organization"
              placeholder="Ex. Garage Martin"
              defaultValue={prefillName}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="check-city">
              Ville <span className="font-normal text-neutral-500">(facultatif)</span>
            </Label>
            <Input
              id="check-city"
              name="city"
              maxLength={80}
              autoComplete="address-level2"
              placeholder="Paris"
              defaultValue={prefillCity}
              className="mt-1.5"
            />
          </div>
        </div>
        <SubmitButton size="lg" pendingLabel="Recherche…">
          Voir si mon site est déjà prêt
        </SubmitButton>
      </form>

      {checkState.status === 'error' ? (
        <p className="text-sm text-red-700" role="alert">
          {checkState.message}
        </p>
      ) : null}

      {checkState.status === 'many' ? (
        <div className="rounded-xl border border-neutral-200 p-6">
          <p className="font-medium text-neutral-900">
            Plusieurs sites correspondent. Choisissez le vôtre :
          </p>
          <ul className="mt-3 space-y-2">
            {checkState.matches.map((match) => (
              <li key={match.slug}>
                <a
                  className="text-accent underline underline-offset-2"
                  href={`${demoOrigin()}/${match.slug}`}
                >
                  {match.name}
                  {match.city ? ` — ${match.city}` : ''}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {checkState.status === 'none' ? (
        <div className="rounded-xl border border-neutral-200 p-6">
          <p className="font-medium text-neutral-900">Votre site n&apos;est pas encore préparé.</p>
          <p className="mt-1 text-sm text-neutral-600">
            Laissez-nous vos coordonnées : nous le préparons et vous envoyons le lien par SMS.
          </p>

          <form action={request} className="relative mt-5 space-y-4">
            <Honeypot />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="request-business">Nom de l&apos;entreprise</Label>
                <Input
                  id="request-business"
                  name="businessName"
                  required
                  maxLength={120}
                  autoComplete="organization"
                  defaultValue={prefillName}
                  className="mt-1.5"
                />
                <FieldError
                  message={
                    requestState.status === 'error'
                      ? requestState.fieldErrors?.businessName
                      : undefined
                  }
                />
              </div>
              <div>
                <Label htmlFor="request-city">Ville</Label>
                <Input
                  id="request-city"
                  name="city"
                  required
                  maxLength={80}
                  autoComplete="address-level2"
                  defaultValue={prefillCity}
                  className="mt-1.5"
                />
                <FieldError
                  message={
                    requestState.status === 'error' ? requestState.fieldErrors?.city : undefined
                  }
                />
              </div>
              <div>
                <Label htmlFor="request-phone">Téléphone</Label>
                <Input
                  id="request-phone"
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="06 12 34 56 78"
                  className="mt-1.5"
                />
                <FieldError
                  message={
                    requestState.status === 'error' ? requestState.fieldErrors?.phone : undefined
                  }
                />
              </div>
              <div>
                <Label htmlFor="request-email">
                  E-mail <span className="font-normal text-neutral-500">(facultatif)</span>
                </Label>
                <Input
                  id="request-email"
                  name="email"
                  type="email"
                  maxLength={160}
                  autoComplete="email"
                  className="mt-1.5"
                />
                <FieldError
                  message={
                    requestState.status === 'error' ? requestState.fieldErrors?.email : undefined
                  }
                />
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <input
                id="request-consent"
                name="consent"
                type="checkbox"
                required
                className="mt-1 size-4 rounded border-neutral-300 accent-[var(--color-accent)]"
              />
              <label htmlFor="request-consent" className="text-sm text-neutral-700">
                J&apos;accepte d&apos;être recontacté au sujet de mon site.
              </label>
            </div>
            <FieldError
              message={
                requestState.status === 'error' ? requestState.fieldErrors?.consent : undefined
              }
            />

            {requestState.status === 'error' && !requestState.fieldErrors ? (
              <p className="text-sm text-red-700" role="alert">
                {requestState.message}
              </p>
            ) : null}

            <SubmitButton pendingLabel="Envoi…">Demander mon site</SubmitButton>
          </form>
        </div>
      ) : null}
    </div>
  );
}

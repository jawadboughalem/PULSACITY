'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { submitBriefAction, type BriefState } from '@/actions/order-brief';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BRIEF_PAGE_OPTIONS } from '@/lib/brief';

const initial: BriefState = { status: 'idle' };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? 'Envoi…' : 'Envoyer ma demande'}
    </Button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-danger mt-1 text-sm" role="alert">
      {message}
    </p>
  );
}

function Field({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>
        {label}
        {hint ? <span className="text-ink-faint ml-1 font-normal">{hint}</span> : null}
      </Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function BriefForm({ lineSlug }: { lineSlug: string }) {
  const [state, submit] = useActionState(submitBriefAction, initial);
  const errors = state.status === 'error' ? state.fieldErrors : undefined;

  return (
    <form action={submit} className="relative space-y-8">
      <input type="hidden" name="lineSlug" value={lineSlug} />
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nom de votre entreprise" htmlFor="businessName">
          <Input
            id="businessName"
            name="businessName"
            required
            maxLength={120}
            autoComplete="organization"
          />
          <FieldError message={errors?.businessName} />
        </Field>

        <Field label="Votre activité" htmlFor="activity">
          <Input
            id="activity"
            name="activity"
            required
            maxLength={160}
            placeholder="Garage deux-roues, boulangerie…"
          />
          <FieldError message={errors?.activity} />
        </Field>

        <Field label="Ville" htmlFor="city">
          <Input id="city" name="city" required maxLength={80} autoComplete="address-level2" />
          <FieldError message={errors?.city} />
        </Field>

        <Field label="Téléphone" htmlFor="phone">
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="06 12 34 56 78"
          />
          <FieldError message={errors?.phone} />
        </Field>

        <Field label="E-mail" hint="(facultatif)" htmlFor="email">
          <Input id="email" name="email" type="email" maxLength={160} autoComplete="email" />
          <FieldError message={errors?.email} />
        </Field>

        <Field label="Lien de votre fiche Google" hint="(facultatif)" htmlFor="googleUrl">
          <Input
            id="googleUrl"
            name="googleUrl"
            type="url"
            maxLength={500}
            placeholder="https://"
          />
          <FieldError message={errors?.googleUrl} />
        </Field>
      </div>

      <Field label="Décrivez le site que vous voulez" hint="(facultatif)" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={5}
          maxLength={3000}
          className="border-line-strong bg-surface placeholder:text-ink-faint focus-visible:border-accent flex w-full rounded-md border px-3 py-2 text-base focus-visible:outline-none"
          placeholder="Ce que vous faites, à qui vous vous adressez, ce que le site doit permettre."
        />
      </Field>

      <fieldset>
        <legend className="text-ink text-sm font-medium">Les pages dont vous avez besoin</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {BRIEF_PAGE_OPTIONS.map((option) => (
            <label key={option.value} className="text-ink-muted flex items-center gap-2.5">
              <input
                type="checkbox"
                name="pages"
                value={option.value}
                className="border-line-strong size-4 rounded accent-[var(--color-accent)]"
              />
              {option.label}
            </label>
          ))}
        </div>
        <div className="mt-3">
          <Label htmlFor="pagesOther" className="text-ink-muted text-sm font-normal">
            Si « autre », précisez
          </Label>
          <Input id="pagesOther" name="pagesOther" maxLength={300} className="mt-1.5" />
        </div>
      </fieldset>

      <Field label="Un ou deux sites que vous aimez" hint="(facultatif)" htmlFor="likedSites">
        <Input
          id="likedSites"
          name="likedSites"
          maxLength={500}
          placeholder="Des adresses, ou juste des noms."
        />
      </Field>

      <fieldset>
        <legend className="text-ink text-sm font-medium">Avez-vous des photos ou un logo ?</legend>
        <div className="mt-3 flex gap-6">
          {['oui', 'non'].map((value) => (
            <label key={value} className="text-ink-muted flex items-center gap-2.5 capitalize">
              <input
                type="radio"
                name="hasAssets"
                value={value}
                className="border-line-strong size-4 accent-[var(--color-accent)]"
              />
              {value}
            </label>
          ))}
        </div>
      </fieldset>

      {state.status === 'error' && !errors ? (
        <p className="text-danger text-sm" role="alert">
          {state.message}
        </p>
      ) : null}

      <Submit />
    </form>
  );
}

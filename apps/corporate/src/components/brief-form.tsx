'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { submitBriefAction, type BriefState, type BriefValues } from '@/actions/order-brief';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { FormMessage } from '@/components/ui/form-message';
import { Input } from '@/components/ui/input';
import { Radio } from '@/components/ui/radio';
import { Textarea } from '@/components/ui/textarea';
import { BRIEF_PAGE_OPTIONS } from '@/lib/brief';

const initial: BriefState = { status: 'idle' };

/**
 * The fields that can come back invalid, in the order they are read.
 *
 * On a form this long the error is usually above the fold the visitor is looking
 * at, so a rejected submit would leave them staring at an unchanged page. Moving
 * focus to the first invalid field scrolls it into view and announces it.
 */
const FIELD_ORDER = ['businessName', 'activity', 'city', 'phone', 'email', 'googleUrl'] as const;

const FORM_ERROR_ID = 'brief-error';

const ASSET_CHOICES = [
  { value: 'oui', label: 'Oui' },
  { value: 'non', label: 'Non' },
] as const;

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" loading={pending}>
      Envoyer ma demande
    </Button>
  );
}

/** A group of choices is labelled by its legend, not by a `Field`. */
function ChoiceGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-ink text-body-sm font-medium">{legend}</legend>
      <div className="mt-2">{children}</div>
    </fieldset>
  );
}

export function BriefForm({ lineSlug }: { lineSlug: string }) {
  const [state, submit] = useActionState(submitBriefAction, initial);
  const errors = state.status === 'error' ? state.fieldErrors : undefined;
  const error = (field: keyof NonNullable<typeof errors>) =>
    errors?.[field] ? { error: errors[field] } : {};

  // What the visitor typed, handed back by the action so a rejected submit does
  // not empty the form. See `BriefState.attempt`.
  const values = state.status === 'error' ? state.values : undefined;
  const typed = (field: keyof BriefValues) => {
    const value = values?.[field];
    return typeof value === 'string' && value !== '' ? { defaultValue: value } : {};
  };

  useEffect(() => {
    if (state.status !== 'error') return;
    const firstInvalid = FIELD_ORDER.find((field) => errors?.[field]);
    // Focusing scrolls it into view on its own, and announces it where the
    // `role="alert"` alone would not move the keyboard.
    document.getElementById(firstInvalid ?? FORM_ERROR_ID)?.focus();
  }, [state, errors]);

  return (
    <form
      // Remounting on each rejected attempt is what lets the defaults below
      // reach the inputs; React has already cleared them by this point.
      key={state.status === 'error' ? state.attempt : 0}
      action={submit}
      className="relative flex flex-col gap-10"
    >
      <input type="hidden" name="lineSlug" value={lineSlug} />
      {/* Honeypot: off-screen rather than hidden, so a bot still fills it in. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nom de votre entreprise" id="businessName" {...error('businessName')}>
          <Input
            name="businessName"
            required
            maxLength={120}
            autoComplete="organization"
            {...typed('businessName')}
          />
        </Field>

        <Field label="Votre activité" id="activity" {...error('activity')}>
          <Input
            name="activity"
            required
            maxLength={160}
            placeholder="Garage deux-roues, boulangerie…"
            {...typed('activity')}
          />
        </Field>

        <Field label="Ville" id="city" {...error('city')}>
          <Input
            name="city"
            required
            maxLength={80}
            autoComplete="address-level2"
            {...typed('city')}
          />
        </Field>

        <Field label="Téléphone" id="phone" {...error('phone')}>
          <Input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            {...typed('phone')}
          />
        </Field>

        <Field label="E-mail" hint="(facultatif)" id="email" {...error('email')}>
          <Input
            name="email"
            type="email"
            maxLength={160}
            autoComplete="email"
            {...typed('email')}
          />
        </Field>

        <Field
          label="Lien de votre fiche Google"
          hint="(facultatif)"
          id="googleUrl"
          {...error('googleUrl')}
        >
          <Input
            name="googleUrl"
            type="url"
            maxLength={500}
            placeholder="https://"
            {...typed('googleUrl')}
          />
        </Field>
      </div>

      <Field label="Décrivez le site que vous voulez" hint="(facultatif)" id="description">
        <Textarea
          name="description"
          rows={5}
          maxLength={3000}
          placeholder="Ce que vous faites, à qui vous vous adressez, ce que le site doit permettre."
          {...typed('description')}
        />
      </Field>

      <ChoiceGroup legend="Les pages dont vous avez besoin">
        <div className="grid sm:grid-cols-3">
          {BRIEF_PAGE_OPTIONS.map((option) => (
            <Checkbox
              key={option.value}
              name="pages"
              value={option.value}
              label={option.label}
              defaultChecked={values?.pages.includes(option.value)}
            />
          ))}
        </div>
        <div className="mt-4">
          <Field label="Si « autre », précisez" id="pagesOther">
            <Input
              name="pagesOther"
              maxLength={300}
              className="sm:max-w-sm"
              {...typed('pagesOther')}
            />
          </Field>
        </div>
      </ChoiceGroup>

      <Field label="Un ou deux sites que vous aimez" hint="(facultatif)" id="likedSites">
        <Input
          name="likedSites"
          maxLength={500}
          placeholder="Des adresses, ou juste des noms."
          {...typed('likedSites')}
        />
      </Field>

      <ChoiceGroup legend="Avez-vous des photos ou un logo ?">
        <div className="flex gap-8">
          {ASSET_CHOICES.map((choice) => (
            <Radio
              key={choice.value}
              name="hasAssets"
              value={choice.value}
              label={choice.label}
              defaultChecked={values?.hasAssets === choice.value}
            />
          ))}
        </div>
      </ChoiceGroup>

      {state.status === 'error' && !errors ? (
        <FormMessage tone="danger" id={FORM_ERROR_ID} tabIndex={-1}>
          {state.message}
        </FormMessage>
      ) : null}

      <Submit />
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import { joinConnectorWaitlist } from "@/app/(marketing)/integrations/[connector]/public-waitlist-actions";
import { HoneypotField } from "@/components/collect/HoneypotField";
import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import { describeMissingEmailPart } from "@/lib/forms/describe-invalid-email";

/** m21, under the address: what is missing, the address typed completed as an example. */
const describeInvalidEmail = (value: string): string => {
  const typed = value.trim();
  if (!typed) return "Indiquez votre adresse e-⁠mail : c'est là que nous vous préviendrons.";
  return (
    describeMissingEmailPart(typed) ??
    "Cette adresse e-⁠mail est incomplète. Écrivez-la en entier, par exemple julie@example.com."
  );
};

type PublicWaitlistFormProps = {
  connector: string;
  connectorName: string;
};

/**
 * Maquette 21, « Être prévenu à la sortie de Stripe »: an address on Papier, kept only until the connector is out. The
 * confirmation replaces the form in the same box.
 */
export const PublicWaitlistForm = ({ connector, connectorName }: PublicWaitlistFormProps) => {
  const [result, submitAction, isPending] = useActionState(joinConnectorWaitlist, null);
  // Kept by React state: a form action empties the fields it does not control, even when the address is refused.
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const fieldId = `waitlist-${connector}`;
  const isInvalid = result?.ok === false && result.error === "invalid-email";

  return (
    <section aria-labelledby="waitlist-title" className="flex flex-col gap-5 bg-paper-100 p-5 desktop:max-w-[704px] desktop:p-6">
      <h2 id="waitlist-title" className="font-serif text-quote font-medium desktop:text-h2">
        {`Être prévenu à la sortie de ${connectorName}`}
      </h2>
      {result?.ok ? (
        <StatusBanner tone="success" title="Nous vous préviendrons par e-⁠mail.">
          {`À l'adresse ${result.data.email}, le jour de la sortie de ${connectorName}. Un seul e-⁠mail.`}
        </StatusBanner>
      ) : (
        <form
          action={(formData) => {
            setSubmittedEmail(email);
            submitAction(formData);
          }}
          noValidate
          className="flex flex-col gap-3"
        >
          {result?.ok === false && result.error === "too-many-requests" ? (
            <StatusBanner tone="error" title="Plusieurs demandes sont parties en peu de temps.">
              Patientez quelques minutes, puis réessayez.
            </StatusBanner>
          ) : null}
          <input type="hidden" name="connector" value={connector} />
          <HoneypotField value={honeypot} onChange={setHoneypot} />
          <div className="flex flex-col gap-4 desktop:flex-row desktop:items-start desktop:gap-3">
            <div className="min-w-[0] flex-1">
              <TextField
                id={fieldId}
                name="email"
                type="email"
                label="Adresse e-⁠mail"
                placeholder="vous@example.com"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={isInvalid ? describeInvalidEmail(submittedEmail) : undefined}
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              aria-label={`Me prévenir à la sortie de ${connectorName}`}
              className={cn(PRIMARY_BUTTON_CLASSES, "w-full shrink-0 desktop:mt-[28px] desktop:w-auto")}
            >
              Me prévenir
            </button>
          </div>
          {isInvalid ? null : (
            <p className="text-small text-slate-600">Un seul e-⁠mail, le jour de la sortie. Votre adresse ne sert qu&apos;à cela.</p>
          )}
        </form>
      )}
    </section>
  );
};

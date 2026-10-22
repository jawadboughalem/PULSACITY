"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { type SendContactMessageResult, sendContactMessage } from "@/app/(marketing)/aide/contact-actions";
import { HoneypotField } from "@/components/collect/HoneypotField";
import { DISCREET_BUTTON_CLASSES, INLINE_LINK_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { ErrorSummary, type ErrorSummaryItem } from "@/components/ui/ErrorSummary";
import { Spinner } from "@/components/ui/Spinner";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import {
  CONTACT_FIELDS,
  type ContactField,
  type ContactFieldErrors,
  MAX_CONTACT_MESSAGE_LENGTH,
  MAX_CONTACT_SUBJECT_LENGTH,
} from "@/lib/support/contact-message";
import type { ContactDraft } from "@/lib/support/report-content";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support/support-address";

const FIELD_IDS: Record<ContactField, string> = {
  email: "contact-email",
  subject: "contact-subject",
  message: "contact-message",
};

const FIELD_LABELS: Record<ContactField, string> = {
  email: "Votre adresse e-⁠mail",
  subject: "Sujet",
  message: "Message",
};

const describeSummary = (count: number) =>
  count === 1 ? "1 point à corriger avant d'envoyer" : `${count} points à corriger avant d'envoyer`;

/** Each submission is counted: the summary takes the focus again, and « Écrire un autre message » closes its own. */
type Submission = { result: SendContactMessageResult; count: number };

/** The fields typed into since a submission: their error goes as soon as they change. */
type EditedFields = { count: number; fields: ContactField[] };

/** Once the message has left, the card shrinks: its title comes back into view, under the sticky header of the site. */
const revealTop = (section: HTMLElement | null) => {
  if (!section) return;
  const headerBottom = document.querySelector("[data-site-header]")?.getBoundingClientRect().bottom ?? 0;
  if (section.getBoundingClientRect().top < headerBottom) section.scrollIntoView({ block: "start" });
};

type ContactFormProps = {
  /** The address of a signed-in creator: already typed, and the answer goes there unless it is changed. */
  accountEmail: string | null;
  /** « Signaler un contenu » (/aide?sujet=signalement): the subject and the questions of a report, already typed. */
  draft?: ContactDraft | null;
};

/**
 * Maquette 8.4, « Écrivez-nous »: the address (already typed when signed in), a subject, a message. The message leaves by
 * e-mail; nothing is kept here. The text typed stays in the fields whatever happens, until it has left.
 */
export const ContactForm = ({ accountEmail, draft = null }: ContactFormProps) => {
  const [submission, submitAction, isPending] = useActionState<Submission | null, FormData>(
    async (previous, formData) => ({
      result: await sendContactMessage(previous?.result ?? null, formData),
      count: (previous?.count ?? 0) + 1,
    }),
    null,
  );
  // Kept by React state: a form action empties the fields it does not control.
  const [email, setEmail] = useState(accountEmail ?? "");
  const [subject, setSubject] = useState(draft?.subject ?? "");
  const [message, setMessage] = useState(draft?.message ?? "");
  const [honeypot, setHoneypot] = useState("");
  const [closedCount, setClosedCount] = useState(0);
  const [edited, setEdited] = useState<EditedFields>({ count: 0, fields: [] });
  const sectionRef = useRef<HTMLElement>(null);
  const noticeRef = useRef<HTMLDivElement>(null);

  const count = submission?.count ?? 0;
  const result = count > closedCount ? (submission?.result ?? null) : null;
  const sentTo = result?.ok ? result.data.email : null;
  const editedFields = edited.count === count ? edited.fields : [];
  const submittedErrors = result?.ok === false && result.error === "invalid-input" ? result.fieldErrors : {};
  const fieldErrors: ContactFieldErrors = Object.fromEntries(
    CONTACT_FIELDS.flatMap((field) =>
      submittedErrors[field] && !editedFields.includes(field) ? [[field, submittedErrors[field]]] : [],
    ),
  );
  const sendError = result?.ok === false && result.error !== "invalid-input" ? result.error : null;

  // The answer of the server is said where the eyes are: the confirmation or the problem takes the focus.
  useEffect(() => {
    if (sentTo) revealTop(sectionRef.current);
    if (sentTo || sendError) noticeRef.current?.focus({ preventScroll: Boolean(sentTo) });
  }, [count, sentTo, sendError]);

  const markEdited = (field: ContactField) =>
    setEdited((current) => ({
      count,
      fields: current.count === count ? [...new Set([...current.fields, field])] : [field],
    }));

  const writeAnother = () => {
    setSubject("");
    setMessage("");
    setClosedCount(count);
    requestAnimationFrame(() => document.getElementById(FIELD_IDS.subject)?.focus());
  };

  const summaryItems = CONTACT_FIELDS.flatMap((field): ErrorSummaryItem[] =>
    fieldErrors[field] ? [{ fieldId: FIELD_IDS[field], message: FIELD_LABELS[field] }] : [],
  );
  const isAccountEmail = accountEmail !== null && email.trim().toLowerCase() === accountEmail.toLowerCase();

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-title"
      className="flex scroll-mt-6 flex-col gap-5 rounded-panel bg-white p-5 desktop:p-8"
    >
      <h2 id="contact-title" className="font-display text-h2">
        Écrivez-nous
      </h2>
      {sentTo ? (
        <>
          <div ref={noticeRef} tabIndex={-1} className="focus:outline-none">
            <StatusBanner tone="success" title="Message envoyé.">
              {`Nous vous répondons sous deux jours ouvrés, à ${sentTo}.`}
            </StatusBanner>
          </div>
          <button type="button" onClick={writeAnother} className={cn(DISCREET_BUTTON_CLASSES, "self-start")}>
            Écrire un autre message
          </button>
        </>
      ) : (
        <>
          <p className="text-body">
            {"Une question, un blocage, une idée ? Votre message arrive à l'équipe ; la réponse revient à votre adresse."}
          </p>
          <form action={submitAction} noValidate className="flex flex-col gap-5">
            {summaryItems.length > 0 ? (
              <ErrorSummary key={count} title={describeSummary(summaryItems.length)} items={summaryItems} />
            ) : null}
            {sendError ? (
              <div key={count} ref={noticeRef} tabIndex={-1} className="focus:outline-none">
                {sendError === "too-many-requests" ? (
                  <StatusBanner tone="error" title="Plusieurs messages sont partis en peu de temps.">
                    Patientez quelques minutes, puis réessayez. Votre texte est gardé.
                  </StatusBanner>
                ) : (
                  <StatusBanner tone="error" title="Votre message n'est pas parti.">
                    {"Réessayez dans un moment : votre texte est gardé. Ou écrivez-nous directement à "}
                    <a href={SUPPORT_MAILTO} className={INLINE_LINK_CLASSES}>
                      {SUPPORT_EMAIL}
                    </a>
                    .
                  </StatusBanner>
                )}
              </div>
            ) : null}
            <HoneypotField value={honeypot} onChange={setHoneypot} />
            <TextField
              id={FIELD_IDS.email}
              name="email"
              type="email"
              label={FIELD_LABELS.email}
              placeholder="julie@exemple.fr"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                markEdited("email");
              }}
              error={fieldErrors.email}
              hint={isAccountEmail ? "Adresse de votre compte : nous répondrons à cette adresse." : undefined}
            />
            <TextField
              id={FIELD_IDS.subject}
              name="subject"
              label={FIELD_LABELS.subject}
              placeholder="Par exemple : relier Kajabi"
              autoComplete="off"
              maxLength={MAX_CONTACT_SUBJECT_LENGTH}
              required
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                markEdited("subject");
              }}
              error={fieldErrors.subject}
            />
            <TextAreaField
              id={FIELD_IDS.message}
              name="message"
              label={FIELD_LABELS.message}
              maxLength={MAX_CONTACT_MESSAGE_LENGTH}
              required
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                markEdited("message");
              }}
              error={fieldErrors.message}
              className="min-h-[180px]"
            />
            <button
              type="submit"
              disabled={isPending}
              aria-busy={isPending || undefined}
              className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}
            >
              {isPending ? (
                <>
                  <Spinner size={20} />
                  Envoi…
                </>
              ) : (
                "Envoyer"
              )}
            </button>
          </form>
          <p className="text-small text-gray">
            {"Nous vous répondons sous deux jours ouvrés. Rien n'est gardé ici : votre message part par e-⁠mail."}
          </p>
        </>
      )}
    </section>
  );
};

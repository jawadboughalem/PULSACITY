"use client";

import { useState, useTransition } from "react";
import {
  cancelTestimonialCorrection,
  proposeTestimonialCorrection,
  restoreTestimonialDisplay,
} from "@/app/app/(espace)/temoignages/testimonial-actions";
import {
  DISCREET_BUTTON_CLASSES,
  FOCUS_RING,
  PRIMARY_BUTTON_CLASSES,
  SECONDARY_BUTTON_CLASSES,
} from "@/components/ui/button-styles";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES, TEXTAREA_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/Spinner";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { cn } from "@/lib/cn";
import { formatDateTime, formatDayMonthYear } from "@/lib/dates/format-french-date";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { prefixWithDe } from "@/lib/french/prefix-with-de";
import { MAX_CORRECTIONS_PER_TESTIMONIAL } from "@/lib/testimonials/corrections/correction-outcome";
import { getFirstName } from "@/lib/testimonials/format-customer-name";
import type { TestimonialDetail } from "@/lib/testimonials/load-testimonial-detail";
import { MAX_TESTIMONIAL_LENGTH } from "@/lib/testimonials/testimonial-form-schema";
import { DisplayedText, MaskPassagePanel } from "./MaskPassagePanel";

type Mode = "reading" | "correcting" | "masking";

type Notice = "masked" | null;

const CORRECTION_ERRORS = {
  "testimonial-not-found": "Ce témoignage n'existe plus. Rechargez la page.",
  "invalid-input": `Votre correction doit compter de 1 à ${MAX_TESTIMONIAL_LENGTH} caractères.`,
  unreachable: "Cette personne ne peut pas recevoir d'e-⁠mail : la correction n'est pas partie.",
  "already-waiting": "Une correction attend déjà sa réponse.",
  "too-many": `${MAX_CORRECTIONS_PER_TESTIMONIAL} corrections ont déjà été proposées pour cet avis.`,
  unchanged: "Votre correction est identique au texte affiché. Changez-le, puis envoyez-le.",
  "not-sent": "La correction n'est pas partie. Vérifiez votre connexion, puis réessayez.",
} as const;

type CorrectionError = keyof typeof CORRECTION_ERRORS;

/** The text box of the fiche: the displayed text on Nuage, radius-field, padding 16 18, quote 19/28. */
const TEXT_BOX_CLASSES = "rounded-field bg-cloud px-[18px] py-4 text-quote whitespace-pre-line text-ink";

/** A labelled version (« Affiché aujourd'hui », « Correction proposée »), its label 14/20 700 Gris. */
const VersionBox = ({ label, text, tone }: { label: string; text: string; tone: "cloud" | "sky" }) => (
  <div className={cn(TEXT_BOX_CLASSES, "flex flex-col gap-1", tone === "sky" && "bg-sky")}>
    <p className="text-badge font-bold text-gray">{label}</p>
    <p>{text}</p>
  </div>
);

/** Why a correction cannot be proposed, when it cannot: the only change left is masking a name or a coordinate. */
const describeNoCorrection = (testimonial: TestimonialDetail, name: string): string | null => {
  if (testimonial.authorReach === "no-address") {
    return `Sans adresse e-⁠mail de ${name}, une correction ne peut pas lui être proposée${NO_BREAK_SPACE}: vous pouvez masquer un nom ou une coordonnée.`;
  }
  if (testimonial.authorReach === "unsubscribed") {
    return `${name} ne reçoit plus vos e-⁠mails${NO_BREAK_SPACE}: une correction ne peut pas lui être proposée. Vous pouvez masquer un nom ou une coordonnée.`;
  }
  if (testimonial.correctionsProposed >= MAX_CORRECTIONS_PER_TESTIMONIAL) {
    return `${MAX_CORRECTIONS_PER_TESTIMONIAL} corrections ont déjà été proposées à ${name}${NO_BREAK_SPACE}: vous pouvez masquer un nom ou une coordonnée.`;
  }
  return null;
};

/**
 * Maquettes 3.4, fiche 01 and 08 to 13: the displayed text is no longer edited in place (positionnement.md, point 4).
 * « Corriger le texte affiché » sends the correction to the author, who accepts or refuses it; without their
 * agreement, only « Masquer un nom ou une coordonnée ». The original stays as written, and can be shown again.
 */
export const DisplayedTextSection = ({ testimonial }: { testimonial: TestimonialDetail }) => {
  const [mode, setMode] = useState<Mode>("reading");
  const [notice, setNotice] = useState<Notice>(null);
  const displayed = testimonial.displayBody ?? testimonial.body;
  const [draft, setDraft] = useState(displayed);
  const [correctionError, setCorrectionError] = useState<CorrectionError | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const name = testimonial.authorName;
  const firstName = getFirstName(name) || name;
  const { correction } = testimonial;
  const isWaiting = correction !== null && correction.outcome === null;
  const isAccepted = correction?.outcome === "accepted" && testimonial.displayBody === correction.body;
  const isRefused =
    correction?.outcome === "refused" &&
    (testimonial.displayEditedAt === null ||
      correction.answeredAt === null ||
      testimonial.displayEditedAt <= correction.answeredAt);
  const noCorrection = describeNoCorrection(testimonial, name);

  const run = (action: () => Promise<void>) => {
    setFailure(null);
    startTransition(async () => {
      try {
        await action();
      } catch {
        setFailure("La modification n'a pas été enregistrée. Vérifiez votre connexion, puis réessayez.");
      }
    });
  };

  const sendCorrection = () =>
    run(async () => {
      setCorrectionError(null);
      const result = await proposeTestimonialCorrection(testimonial.id, draft);
      if (result.ok) setMode("reading");
      else setCorrectionError(result.error);
    });

  const cancelCorrection = () =>
    run(async () => {
      const result = await cancelTestimonialCorrection(testimonial.id);
      if (!result.ok) setFailure("La correction n'a pas été annulée. Rechargez la page, puis réessayez.");
    });

  const restoreOriginal = () =>
    run(async () => {
      const result = await restoreTestimonialDisplay(testimonial.id);
      if (result.ok) setNotice(null);
      else setFailure("Le texte original n'a pas été rétabli. Rechargez la page, puis réessayez.");
    });

  const actions =
    mode === "reading" && !isWaiting && !isAccepted ? (
      <div className="flex flex-col gap-4">
        {notice === "masked" ? (
          <p role="status" className="flex items-center gap-2 text-small font-bold text-success">
            <Icon name="valid" size={20} />
            Passage masqué. L&apos;original reste gardé.
          </p>
        ) : null}
        <p className={FIELD_HINT_CLASSES}>
          {noCorrection ?? (
            <>
              <span className="desktop:hidden">{`Une correction ne s'affiche qu'avec l'accord de ${firstName}.`}</span>
              <span className="hidden desktop:inline">
                {`Une correction part à ${name} pour accord${NO_BREAK_SPACE}: elle ne s'affiche qu'avec son accord. Sans accord, vous pouvez masquer un nom ou une coordonnée.`}
              </span>
            </>
          )}
        </p>
        <div className="flex flex-col items-start gap-3 desktop:flex-row desktop:items-center desktop:gap-6">
          {noCorrection === null ? (
            <button
              type="button"
              onClick={() => {
                setDraft(displayed);
                setCorrectionError(null);
                setNotice(null);
                setMode("correcting");
              }}
              className={cn(SECONDARY_BUTTON_CLASSES, "h-[44px] w-full px-[18px] desktop:w-auto")}
            >
              Corriger le texte affiché
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setNotice(null);
              setMode("masking");
            }}
            className={cn(DISCREET_BUTTON_CLASSES, "self-center desktop:self-auto")}
          >
            Masquer un nom ou une coordonnée
          </button>
        </div>
      </div>
    ) : null;

  return (
    <section className="flex flex-col gap-4" aria-labelledby="displayed-text-title">
      <h2 id="displayed-text-title" className={FIELD_LABEL_CLASSES}>
        Texte affiché
      </h2>

      {isWaiting && correction ? (
        <>
          <StatusBanner tone="waiting" title={`Correction envoyée à ${name} le ${formatDayMonthYear(correction.createdAt)}.`}>
            <p>{`Elle s'affichera quand ${firstName} l'acceptera. En attendant, le texte d'origine reste affiché.`}</p>
            <button
              type="button"
              onClick={cancelCorrection}
              disabled={isPending}
              className={cn(DISCREET_BUTTON_CLASSES, "mt-3 -ml-[10px]")}
            >
              Annuler la correction
            </button>
          </StatusBanner>
          <VersionBox label="Affiché aujourd'hui" text={displayed} tone="cloud" />
          <VersionBox label="Correction proposée" text={correction.body} tone="sky" />
        </>
      ) : null}

      {isAccepted && correction?.answeredAt ? (
        <StatusBanner tone="success" title={`${name} a accepté votre correction le ${formatDayMonthYear(correction.answeredAt)}.`}>
          Le texte corrigé s&apos;affiche. L&apos;original reste gardé, ci-dessous.
        </StatusBanner>
      ) : null}
      {isRefused && correction?.answeredAt && mode === "reading" ? (
        <StatusBanner tone="info" title={`${name} a refusé votre correction le ${formatDayMonthYear(correction.answeredAt)}.`}>
          Le texte d&apos;origine reste affiché. Vous pouvez masquer un nom ou une coordonnée, ou masquer l&apos;avis.
        </StatusBanner>
      ) : null}

      {mode === "masking" ? (
        <MaskPassagePanel
          testimonialId={testimonial.id}
          text={displayed}
          onMasked={() => {
            setNotice("masked");
            setMode("reading");
          }}
          onCancel={() => setMode("reading")}
        />
      ) : null}

      {!isWaiting && mode !== "masking" ? (
        <div className={TEXT_BOX_CLASSES}>
          <DisplayedText text={displayed} />
        </div>
      ) : null}

      {mode === "correcting" ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="correction-body" className={FIELD_LABEL_CLASSES}>
            Votre correction
          </label>
          <textarea
            id="correction-body"
            value={draft}
            maxLength={MAX_TESTIMONIAL_LENGTH}
            onChange={(event) => setDraft(event.target.value)}
            aria-describedby={correctionError ? "correction-body-error" : "correction-body-hint"}
            aria-invalid={correctionError === "invalid-input" || correctionError === "unchanged" || undefined}
            className={cn(TEXTAREA_CLASSES, "min-h-[176px] text-quote")}
          />
          {correctionError ? <FieldError id="correction-body-error" message={CORRECTION_ERRORS[correctionError]} /> : null}
          <p id="correction-body-hint" className={FIELD_HINT_CLASSES}>
            {`Corrigez une faute ou raccourcissez, sans changer le sens. ${name} reçoit la correction par e-⁠mail et l'accepte ou la refuse. En attendant, le texte d'origine reste affiché.`}
          </p>
          <div className="mt-2 flex flex-col items-stretch gap-3 desktop:flex-row desktop:items-center desktop:gap-6">
            <button
              type="button"
              onClick={sendCorrection}
              aria-busy={isPending || undefined}
              className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
            >
              {isPending ? <Spinner size={20} /> : null}
              {isPending ? "Envoi…" : `Envoyer à ${name} pour accord`}
            </button>
            <button
              type="button"
              onClick={() => setMode("reading")}
              disabled={isPending}
              className={cn(DISCREET_BUTTON_CLASSES, "self-center desktop:self-auto")}
            >
              Annuler
            </button>
          </div>
        </div>
      ) : null}

      {actions}
      {failure ? <FieldError id="displayed-text-failure" message={failure} /> : null}

      <details className="group" open={mode === "reading" && testimonial.displayBody !== null && !isWaiting}>
        <summary
          className={cn(
            "flex min-h-[44px] cursor-pointer list-none items-center gap-3 text-body font-bold [&::-webkit-details-marker]:hidden",
            FOCUS_RING,
          )}
        >
          <Icon name="chevronRight" size={20} className="group-open:rotate-90" />
          {`Texte original ${prefixWithDe(firstName)}`}
        </summary>
        <div className="mt-4 flex flex-col gap-3 rounded-field bg-cloud px-[18px] py-4">
          <p className="max-w-quote text-quote whitespace-pre-line text-ink">{testimonial.body}</p>
          <p className="text-small text-gray">
            {`Envoyé le ${formatDateTime(testimonial.createdAt)} · conservé tel quel, non modifiable`}
          </p>
          {testimonial.displayBody !== null && !isWaiting ? (
            <button
              type="button"
              onClick={restoreOriginal}
              disabled={isPending}
              className={cn(DISCREET_BUTTON_CLASSES, "self-start -ml-[10px]")}
            >
              Afficher le texte original
            </button>
          ) : null}
        </div>
      </details>
    </section>
  );
};

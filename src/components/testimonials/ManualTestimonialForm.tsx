"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  type AddManualTestimonialFormResult,
  addManualTestimonialForm,
} from "@/app/app/(espace)/temoignages/manual-testimonial-actions";
import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Checkbox } from "@/components/ui/Checkbox";
import { type ErrorSummaryItem, ErrorSummary } from "@/components/ui/ErrorSummary";
import { FieldError } from "@/components/ui/FieldError";
import { Icon } from "@/components/ui/Icon";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import { MANUAL_CONSENT_TEXT } from "@/lib/testimonials/manual-consent";
import type {
  ManualTestimonialField,
  ManualTestimonialFieldError,
  ManualTestimonialFieldErrors,
} from "@/lib/testimonials/manual-testimonial-form-schema";
import {
  MAX_AUTHOR_NAME_LENGTH,
  MAX_AUTHOR_TITLE_LENGTH,
  MAX_TESTIMONIAL_LENGTH,
} from "@/lib/testimonials/testimonial-form-schema";
import { FIRST_APPROVAL_SEARCH_PARAM } from "./first-approval-param";
import { RatingInput } from "./RatingInput";

type FieldMessages = Partial<Record<ManualTestimonialFieldError, { field: string; summary: string }>>;

const FIELD_IDS: Record<ManualTestimonialField, string> = {
  authorName: "manual-author-name",
  authorTitle: "manual-author-title",
  rating: "manual-rating",
  body: "manual-body",
  receivedAt: "manual-received-at",
  hasConsent: "manual-consent",
};

/** In the order of the form, so the summary reads from top to bottom. */
const FIELD_ORDER: ManualTestimonialField[] = ["authorName", "authorTitle", "rating", "body", "receivedAt", "hasConsent"];

const fieldMessages = (field: ManualTestimonialField, dateExample: string): FieldMessages => {
  switch (field) {
    case "authorName":
      return {
        missing: {
          field: "Indiquez le nom à afficher, par exemple un prénom et une initiale.",
          summary: "Indiquez le nom à afficher.",
        },
        "too-long": {
          field: `Ce nom dépasse ${MAX_AUTHOR_NAME_LENGTH} caractères. Raccourcissez-le.`,
          summary: "Raccourcissez le nom.",
        },
      };
    case "authorTitle":
      return {
        "too-long": {
          field: `Ce titre dépasse ${MAX_AUTHOR_TITLE_LENGTH} caractères. Raccourcissez-le.`,
          summary: "Raccourcissez le titre.",
        },
      };
    case "rating":
      return { missing: { field: "Choisissez une note de 1 à 5 étoiles.", summary: "Choisissez une note." } };
    case "body":
      return {
        missing: { field: "Collez le texte du témoignage reçu.", summary: "Collez le texte du témoignage." },
        "too-long": {
          field: "Ce texte dépasse 2 000 caractères. Raccourcissez-le.",
          summary: "Raccourcissez le texte.",
        },
      };
    case "receivedAt":
      return {
        invalid: { field: `Cette date n'existe pas. Exemple : ${dateExample}.`, summary: "Cette date n'existe pas." },
        future: {
          field: "Cette date est dans le futur. Indiquez le jour où vous l'avez reçu.",
          summary: "La date est dans le futur.",
        },
      };
    case "hasConsent":
      return {
        missing: {
          field: "Cochez la case : sans accord, le témoignage ne peut pas être publié.",
          summary: "Confirmez l'accord de la personne.",
        },
      };
  }
};

const SUBMIT_ERRORS = {
  "space-not-found": "Votre espace est introuvable. Rechargez la page.",
  "product-not-found": "Cette offre n'existe plus. Choisissez-en une autre.",
  "invalid-photo": "La photo n'a pas été reçue. Choisissez-la à nouveau.",
  "not-sent": "Le témoignage n'a pas été ajouté. Vérifiez votre connexion, puis réessayez.",
} as const;

const describeSummary = (count: number) =>
  `${count} ${count > 1 ? "points" : "point"} à corriger avant d'ajouter le témoignage`;

const CONTROL_CLASSES =
  "w-full rounded-sm border border-gray-400 bg-white text-body text-ink-900 placeholder:text-slate-600 focus:border-2 focus:border-ink-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-paper-100";

type ManualTestimonialFormProps = {
  products: { id: string; name: string }[];
  dateExample: string;
  testimonialsHref: string;
  importHref: string;
};

export const ManualTestimonialForm = ({ products, dateExample, testimonialsHref, importHref }: ManualTestimonialFormProps) => {
  const router = useRouter();
  const [isSubmitting, startSubmitting] = useTransition();
  const [form, setForm] = useState({
    authorName: "",
    authorTitle: "",
    rating: 0,
    body: "",
    productId: "",
    receivedAt: "",
    hasConsent: false,
  });
  const [fieldErrors, setFieldErrors] = useState<ManualTestimonialFieldErrors>({});
  const [summaryKey, setSummaryKey] = useState(0);
  const [submitError, setSubmitError] = useState<keyof typeof SUBMIT_ERRORS | null>(null);

  const messagesFor = (field: ManualTestimonialField) => {
    const error = fieldErrors[field];
    return error ? fieldMessages(field, dateExample)[error] : undefined;
  };
  const messageFor = (field: ManualTestimonialField) => messagesFor(field)?.field;

  const summaryItems = FIELD_ORDER.flatMap((field): ErrorSummaryItem[] => {
    const messages = messagesFor(field);
    return messages ? [{ fieldId: FIELD_IDS[field], message: messages.summary }] : [];
  });

  const updateField = <Field extends keyof typeof form>(field: Field, value: (typeof form)[Field]) => {
    setForm({ ...form, [field]: value });
    if (field in fieldErrors) setFieldErrors({ ...fieldErrors, [field]: undefined });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    startSubmitting(async () => {
      let result: AddManualTestimonialFormResult;
      try {
        result = await addManualTestimonialForm({ ...form, photoKey: null });
      } catch {
        setSubmitError("not-sent");
        return;
      }
      if (result.ok) {
        const celebration = result.data.isFirstApproval ? `?${FIRST_APPROVAL_SEARCH_PARAM}=1` : "";
        router.push(`${testimonialsHref}/${result.data.testimonialId}${celebration}`);
        return;
      }
      if (result.error === "invalid-input") {
        setFieldErrors(result.fieldErrors);
        setSummaryKey((key) => key + 1);
      } else {
        setSubmitError(result.error);
      }
    });
  };

  const bodyError = messageFor("body");
  const consentError = messageFor("hasConsent");

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {submitError ? (
        <StatusBanner tone="error" title="Le témoignage n'a pas été ajouté.">
          {SUBMIT_ERRORS[submitError]}
        </StatusBanner>
      ) : null}
      {summaryItems.length > 0 ? (
        <ErrorSummary key={summaryKey} title={describeSummary(summaryItems.length)} items={summaryItems} />
      ) : null}
      <fieldset disabled={isSubmitting} className="flex min-w-[0] flex-col gap-6">
        <TextField
          id={FIELD_IDS.authorName}
          label="Nom affiché"
          value={form.authorName}
          maxLength={MAX_AUTHOR_NAME_LENGTH}
          autoComplete="off"
          placeholder="Par exemple : Camille R."
          hint={messageFor("authorName") ? undefined : "C'est le nom que verront vos visiteurs."}
          onChange={(event) => updateField("authorName", event.target.value)}
          error={messageFor("authorName")}
        />
        <TextField
          id={FIELD_IDS.authorTitle}
          label={
            <>
              Titre <span className="font-normal text-slate-600">(facultatif)</span>
            </>
          }
          value={form.authorTitle}
          maxLength={MAX_AUTHOR_TITLE_LENGTH}
          autoComplete="off"
          placeholder="Par exemple : Enseignante, Lyon"
          onChange={(event) => updateField("authorTitle", event.target.value)}
          error={messageFor("authorTitle")}
        />
        <RatingInput
          id={FIELD_IDS.rating}
          rating={form.rating}
          error={messageFor("rating")}
          onChange={(rating) => updateField("rating", rating)}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor={FIELD_IDS.body} className="text-small font-semibold">
            Texte du témoignage
          </label>
          <textarea
            id={FIELD_IDS.body}
            value={form.body}
            maxLength={MAX_TESTIMONIAL_LENGTH}
            placeholder="Collez ici le message reçu"
            aria-invalid={bodyError ? true : undefined}
            aria-describedby={bodyError ? `${FIELD_IDS.body}-error` : `${FIELD_IDS.body}-hint`}
            onChange={(event) => updateField("body", event.target.value)}
            className={cn(
              CONTROL_CLASSES,
              "min-h-[160px] p-4 focus:p-[15px]",
              bodyError && "border-2 border-error p-[15px]",
            )}
          />
          {bodyError ? (
            <FieldError id={`${FIELD_IDS.body}-error`} message={bodyError} />
          ) : (
            <p id={`${FIELD_IDS.body}-hint`} className="text-small text-slate-600">
              Recopiez le message tel quel. Vous pourrez corriger une faute plus tard.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-6 desktop:grid desktop:grid-cols-[minmax(0,1fr)_240px] desktop:gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="manual-offer" className="text-small font-semibold">
              Offre <span className="font-normal text-slate-600">(facultatif)</span>
            </label>
            <span className="relative flex">
              <select
                id="manual-offer"
                value={form.productId}
                aria-describedby="manual-offer-hint"
                onChange={(event) => updateField("productId", event.target.value)}
                className={cn(CONTROL_CLASSES, "h-[48px] appearance-none pr-7 pl-4 focus:pl-[15px]")}
              >
                <option value="">Aucune offre</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" size={20} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
            </span>
            <p id="manual-offer-hint" className="text-small text-slate-600">
              Le témoignage s&apos;affichera dans les widgets de cette offre.
            </p>
          </div>
          <TextField
            id={FIELD_IDS.receivedAt}
            label={
              <>
                Date de réception <span className="font-normal text-slate-600">(facultatif)</span>
              </>
            }
            value={form.receivedAt}
            autoComplete="off"
            placeholder="jj/mm/aaaa"
            onChange={(event) => updateField("receivedAt", event.target.value)}
            error={messageFor("receivedAt")}
          />
        </div>
        <div className="border-t border-hairline-200 pt-6">
          <div className={cn("flex flex-col gap-2", consentError && "border-2 border-error bg-error-surface p-4")}>
            <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-body has-disabled:cursor-not-allowed">
              <Checkbox
                id={FIELD_IDS.hasConsent}
                checked={form.hasConsent}
                hasError={Boolean(consentError)}
                aria-describedby={consentError ? `${FIELD_IDS.hasConsent}-error` : undefined}
                onChange={(event) => updateField("hasConsent", event.target.checked)}
              />
              <span>{MANUAL_CONSENT_TEXT}</span>
            </label>
            {consentError ? (
              <div className="pl-[36px]">
                <FieldError id={`${FIELD_IDS.hasConsent}-error`} message={consentError} />
              </div>
            ) : null}
          </div>
        </div>
      </fieldset>
      <div className="flex flex-col gap-4 desktop:flex-row desktop:items-center desktop:gap-5">
        <button type="submit" disabled={isSubmitting} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
          {isSubmitting ? "Ajout en cours…" : "Ajouter le témoignage"}
        </button>
        {isSubmitting ? (
          <p className="text-small text-slate-600">Ne fermez pas la page.</p>
        ) : (
          <Link href={testimonialsHref} className={cn(DISCREET_BUTTON_CLASSES, "self-start desktop:self-auto")}>
            Annuler
          </Link>
        )}
      </div>
      <p className="text-small text-slate-600 min-[1280px]:hidden">
        Vous en avez beaucoup ?{" "}
        <Link
          href={importHref}
          className="font-medium text-carmine underline underline-offset-[3px] hover:text-carmine-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
        >
          Importer un fichier CSV
        </Link>
      </p>
    </form>
  );
};

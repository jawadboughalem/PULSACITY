"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  type AddManualTestimonialFormResult,
  addManualTestimonialForm,
} from "@/app/app/(espace)/temoignages/manual-testimonial-actions";
import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Checkbox } from "@/components/ui/Checkbox";
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

const FIELD_MESSAGES: Record<ManualTestimonialField, Partial<Record<ManualTestimonialFieldError, string>>> = {
  authorName: {
    missing: "Indiquez le nom de la personne, par exemple Camille R.",
    "too-long": `Ce nom dépasse ${MAX_AUTHOR_NAME_LENGTH} caractères. Raccourcissez-le.`,
  },
  authorTitle: { "too-long": `Ce titre dépasse ${MAX_AUTHOR_TITLE_LENGTH} caractères. Raccourcissez-le.` },
  rating: { missing: "Choisissez une note, de 1 à 5 étoiles." },
  body: {
    missing: "Collez le texte du témoignage reçu.",
    "too-long": "Ce texte dépasse 2 000 caractères. Raccourcissez-le.",
  },
  receivedAt: {
    invalid: "Cette date n'est pas reconnue. Choisissez-la dans le calendrier.",
    future: "Cette date est dans le futur. Choisissez le jour où vous l'avez reçu.",
  },
  hasConsent: { missing: "Cochez la case : sans l'accord de la personne, ce témoignage ne peut pas être publié." },
};

const SUBMIT_ERRORS = {
  "space-not-found": "Votre espace est introuvable. Rechargez la page.",
  "product-not-found": "Cette offre n'existe plus. Choisissez-en une autre.",
  "invalid-photo": "La photo n'a pas été reçue. Choisissez-la à nouveau.",
  "not-sent": "Le témoignage n'a pas été ajouté. Vérifiez votre connexion, puis réessayez.",
} as const;

type ManualTestimonialFormProps = {
  products: { id: string; name: string }[];
  today: string;
  detailHrefPrefix: string;
};

export const ManualTestimonialForm = ({ products, today, detailHrefPrefix }: ManualTestimonialFormProps) => {
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
  const [submitError, setSubmitError] = useState<keyof typeof SUBMIT_ERRORS | null>(null);

  const messageFor = (field: ManualTestimonialField) => {
    const error = fieldErrors[field];
    return error ? FIELD_MESSAGES[field][error] : undefined;
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
        router.push(`${detailHrefPrefix}/${result.data.testimonialId}${celebration}`);
        return;
      }
      if (result.error === "invalid-input") setFieldErrors(result.fieldErrors);
      else setSubmitError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {submitError ? (
        <StatusBanner tone="error" title="Le témoignage n'a pas été ajouté.">
          {SUBMIT_ERRORS[submitError]}
        </StatusBanner>
      ) : null}
      <div className="flex flex-col gap-6 desktop:grid desktop:grid-cols-2">
        <TextField
          id="manual-author-name"
          label="Nom affiché"
          value={form.authorName}
          maxLength={MAX_AUTHOR_NAME_LENGTH}
          autoComplete="off"
          placeholder="Par exemple : Camille R."
          onChange={(event) => setForm({ ...form, authorName: event.target.value })}
          error={messageFor("authorName")}
        />
        <TextField
          id="manual-author-title"
          label={
            <>
              Titre affiché <span className="font-normal text-slate-600">(facultatif)</span>
            </>
          }
          value={form.authorTitle}
          maxLength={MAX_AUTHOR_TITLE_LENGTH}
          autoComplete="off"
          placeholder="Par exemple : Enseignante, Lyon"
          onChange={(event) => setForm({ ...form, authorTitle: event.target.value })}
          error={messageFor("authorTitle")}
        />
      </div>
      <RatingInput
        rating={form.rating}
        error={messageFor("rating")}
        onChange={(rating) => setForm({ ...form, rating })}
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="manual-body" className="text-small font-semibold">
          Texte du témoignage
        </label>
        <textarea
          id="manual-body"
          value={form.body}
          maxLength={MAX_TESTIMONIAL_LENGTH}
          aria-invalid={fieldErrors.body ? true : undefined}
          aria-describedby={fieldErrors.body ? "manual-body-error" : "manual-body-hint"}
          onChange={(event) => setForm({ ...form, body: event.target.value })}
          className={cn(
            "min-h-[176px] w-full rounded-sm border border-gray-400 bg-white p-4 font-serif text-quote text-ink-900 focus:border-2 focus:border-ink-900 focus:p-[15px] focus:outline-none",
            fieldErrors.body && "border-2 border-error p-[15px]",
          )}
        />
        {fieldErrors.body ? (
          <FieldError id="manual-body-error" message={messageFor("body") ?? ""} />
        ) : (
          <p id="manual-body-hint" className="text-small text-slate-600">
            Recopiez-le tel que vous l&apos;avez reçu. Vous pourrez corriger l&apos;affichage ensuite.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-6 desktop:grid desktop:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="manual-offer" className="text-small font-semibold">
            Offre <span className="font-normal text-slate-600">(facultatif)</span>
          </label>
          <span className="relative flex">
            <select
              id="manual-offer"
              value={form.productId}
              onChange={(event) => setForm({ ...form, productId: event.target.value })}
              className="h-[48px] w-full appearance-none rounded-sm border border-gray-400 bg-white pr-7 pl-4 text-body text-ink-900 focus:border-2 focus:border-ink-900 focus:pl-[15px] focus:outline-none"
            >
              <option value="">Sans offre</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={20} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2" />
          </span>
        </div>
        <TextField
          id="manual-received-at"
          type="date"
          label={
            <>
              Reçu le <span className="font-normal text-slate-600">(facultatif)</span>
            </>
          }
          value={form.receivedAt}
          max={today}
          hint="Sans date, c'est la date du jour."
          onChange={(event) => setForm({ ...form, receivedAt: event.target.value })}
          error={messageFor("receivedAt")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-body">
          <Checkbox
            checked={form.hasConsent}
            hasError={Boolean(fieldErrors.hasConsent)}
            aria-describedby={fieldErrors.hasConsent ? "manual-consent-error" : undefined}
            onChange={(event) => setForm({ ...form, hasConsent: event.target.checked })}
          />
          <span>{MANUAL_CONSENT_TEXT}</span>
        </label>
        {fieldErrors.hasConsent ? (
          <FieldError id="manual-consent-error" message={messageFor("hasConsent") ?? ""} />
        ) : null}
      </div>
      <button type="submit" disabled={isSubmitting} className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto desktop:self-start")}>
        {isSubmitting ? "Ajout…" : "Ajouter le témoignage"}
      </button>
    </form>
  );
};

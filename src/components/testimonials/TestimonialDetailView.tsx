"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  type TestimonialPresentationField,
  linkTestimonialProduct,
  restoreTestimonialDisplay,
  saveTestimonialPresentation,
} from "@/app/app/(espace)/temoignages/testimonial-actions";
import {
  DISCREET_BUTTON_CLASSES,
  FOCUS_RING,
  PRIMARY_BUTTON_CLASSES,
  SECONDARY_BUTTON_CLASSES,
} from "@/components/ui/button-styles";
import { Checkbox } from "@/components/ui/Checkbox";
import { Breadcrumb } from "@/components/space/BackBar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FieldError } from "@/components/ui/FieldError";
import { FIELD_HINT_CLASSES, FIELD_LABEL_CLASSES, TEXTAREA_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { SelectControl } from "@/components/ui/SelectControl";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { TextField } from "@/components/ui/TextField";
import { cn } from "@/lib/cn";
import { formatDateTime, formatDayMonthYear } from "@/lib/dates/format-french-date";
import { prefixWithDe } from "@/lib/french/prefix-with-de";
import { quoteInFrench } from "@/lib/french/typography";
import { getFirstName } from "@/lib/testimonials/format-customer-name";
import type { TestimonialDetail } from "@/lib/testimonials/load-testimonial-detail";
import {
  MAX_AUTHOR_NAME_LENGTH,
  MAX_AUTHOR_TITLE_LENGTH,
  MAX_TESTIMONIAL_LENGTH,
} from "@/lib/testimonials/testimonial-form-schema";
import { describeTestimonialSource } from "./describe-testimonial-source";
import { RatingStars } from "./RatingStars";
import {
  PLAN_LIMIT_MESSAGE,
  REVIEW_ERROR_MESSAGES,
  buildDeleteConfirmation,
  buildHideConfirmation,
} from "./review-messages";
import { StatusBadge } from "./StatusBadge";
import { useTestimonialDeletion } from "./useTestimonialDeletion";
import { useTestimonialReview } from "./useTestimonialReview";

const FIELD_ERRORS: Record<TestimonialPresentationField, string> = {
  displayBody: `Le texte affiché doit compter de 1 à ${MAX_TESTIMONIAL_LENGTH} caractères.`,
  authorName: `Le nom affiché doit compter de 1 à ${MAX_AUTHOR_NAME_LENGTH} caractères.`,
  authorTitle: `Le titre affiché dépasse ${MAX_AUTHOR_TITLE_LENGTH} caractères. Raccourcissez-le.`,
};

const WITHOUT_OFFER = "";

type TestimonialDetailViewProps = {
  testimonial: TestimonialDetail;
  products: { id: string; name: string }[];
  isApprovalAllowed: boolean;
  listHref: string;
  proofHref: string;
};

type SaveState = "idle" | "saving" | "saved" | "failed";

export const TestimonialDetailView = ({
  testimonial,
  products,
  isApprovalAllowed,
  listHref,
  proofHref,
}: TestimonialDetailViewProps) => {
  const router = useRouter();
  const review = useTestimonialReview(testimonial, isApprovalAllowed);
  const deletion = useTestimonialDeletion(testimonial.id, () => router.push(listHref));
  const displayedBody = testimonial.displayBody ?? testimonial.body;
  const [presentation, setPresentation] = useState({
    displayBody: displayedBody,
    authorName: testimonial.authorName,
    authorTitle: testimonial.authorTitle ?? "",
  });
  const [invalidFields, setInvalidFields] = useState<TestimonialPresentationField[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [productId, setProductId] = useState(testimonial.productId ?? WITHOUT_OFFER);
  const [productState, setProductState] = useState<SaveState>("idle");
  const [isSaving, startSaving] = useTransition();
  const firstName = getFirstName(testimonial.authorName) || testimonial.authorName;
  const source = describeTestimonialSource(testimonial);
  const isChanged =
    presentation.displayBody !== displayedBody ||
    presentation.authorName !== testimonial.authorName ||
    presentation.authorTitle !== (testimonial.authorTitle ?? "");
  const error = review.error ?? deletion.error;

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startSaving(async () => {
      setSaveState("saving");
      try {
        const result = await saveTestimonialPresentation(testimonial.id, presentation);
        setInvalidFields(result.ok || result.error !== "invalid-input" ? [] : result.fields);
        setSaveState(result.ok ? "saved" : "failed");
      } catch {
        setSaveState("failed");
      }
    });
  };

  const handleRestore = () => {
    startSaving(async () => {
      try {
        const result = await restoreTestimonialDisplay(testimonial.id);
        if (result.ok) {
          setPresentation((current) => ({ ...current, displayBody: testimonial.body }));
          setSaveState("saved");
        } else {
          setSaveState("failed");
        }
      } catch {
        setSaveState("failed");
      }
    });
  };

  const handleProductChange = (nextProductId: string) => {
    setProductId(nextProductId);
    setProductState("saving");
    startSaving(async () => {
      try {
        const result = await linkTestimonialProduct(testimonial.id, nextProductId || null);
        setProductState(result.ok ? "saved" : "failed");
      } catch {
        setProductState("failed");
      }
    });
  };

  const saveMessage = {
    idle: isChanged ? "Modifications non enregistrées." : "Aucune modification pour l'instant.",
    saving: "Enregistrement…",
    saved: isChanged ? "Modifications non enregistrées." : "Modifications enregistrées.",
    failed: "Les modifications n'ont pas été enregistrées. Vérifiez les champs, puis réessayez.",
  }[saveState];

  const statusButtons = (
    <>
      {review.status !== "approved" ? (
        <button
          type="button"
          onClick={review.approve}
          disabled={review.isOverPlanLimit}
          className={cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:order-2 desktop:w-auto")}
        >
          Valider
        </button>
      ) : null}
      {review.status !== "hidden" ? (
        <button
          type="button"
          onClick={review.askToHide}
          className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:order-1 desktop:w-auto")}
        >
          Masquer
        </button>
      ) : null}
    </>
  );

  return (
    <div className="flex flex-col gap-6 desktop:gap-8">
      <Breadcrumb parentHref={listHref} parentLabel="Témoignages" current={testimonial.authorName} />

      <header className="flex flex-col gap-6 desktop:flex-row desktop:items-start desktop:justify-between">
        <div className="flex items-start gap-4 desktop:gap-6">
          <SpaceAvatar name={testimonial.authorName} logoUrl={testimonial.authorPhotoUrl} size={64} background="sky" />
          <div className="flex min-w-[0] flex-col gap-2">
            <div className="flex flex-col items-start gap-2 desktop:flex-row desktop:items-center desktop:gap-4">
              <h1 className="font-display text-h2 desktop:text-h1">{testimonial.authorName}</h1>
              <StatusBadge status={review.status} isJustApproved={review.isJustApproved} />
            </div>
            <p className="hidden text-body text-gray desktop:block">
              {[testimonial.authorTitle, `reçu le ${formatDayMonthYear(testimonial.createdAt)}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center">{statusButtons}</div>
      </header>
      {review.isOverPlanLimit ? <p className="text-small text-gray">{PLAN_LIMIT_MESSAGE}</p> : null}
      {error ? <FieldError id="testimonial-error" message={REVIEW_ERROR_MESSAGES[error]} /> : null}

      <div className="flex flex-col gap-8 desktop:grid desktop:grid-cols-[minmax(0,1fr)_380px] desktop:gap-12">
        <div className="flex min-w-[0] flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h2 className={FIELD_LABEL_CLASSES}>Note</h2>
            <p className="flex flex-wrap items-center gap-3 text-small text-gray">
              <RatingStars rating={testimonial.rating} size={20} />
              <span className="desktop:hidden">non modifiable</span>
              <span className="hidden desktop:inline">{`${testimonial.rating} sur 5 · donnée à l'envoi, non modifiable`}</span>
            </p>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="display-body" className={FIELD_LABEL_CLASSES}>
                Texte affiché
              </label>
              <textarea
                id="display-body"
                value={presentation.displayBody}
                maxLength={MAX_TESTIMONIAL_LENGTH}
                aria-describedby="display-body-hint"
                aria-invalid={invalidFields.includes("displayBody") || undefined}
                onChange={(event) => setPresentation({ ...presentation, displayBody: event.target.value })}
                className={cn(TEXTAREA_CLASSES, "min-h-[176px]")}
              />
              <p id="display-body-hint" className={FIELD_HINT_CLASSES}>
                <span className="desktop:hidden">Corrigez une faute ou raccourcissez, sans changer le sens.</span>
                <span className="hidden desktop:inline">
                  {`Vous pouvez corriger une faute ou raccourcir, sans changer le sens : le témoignage reste signé par ${testimonial.authorName.replace(/\.$/, "")}.`}
                </span>
              </p>
              {invalidFields.includes("displayBody") ? (
                <FieldError id="display-body-error" message={FIELD_ERRORS.displayBody} />
              ) : null}
            </div>
            <div className="flex flex-col gap-8 desktop:grid desktop:grid-cols-2 desktop:gap-8">
              <TextField
                id="author-name"
                label="Nom affiché"
                value={presentation.authorName}
                maxLength={MAX_AUTHOR_NAME_LENGTH}
                onChange={(event) => setPresentation({ ...presentation, authorName: event.target.value })}
                error={invalidFields.includes("authorName") ? FIELD_ERRORS.authorName : undefined}
              />
              <TextField
                id="author-title"
                label="Titre affiché"
                value={presentation.authorTitle}
                maxLength={MAX_AUTHOR_TITLE_LENGTH}
                onChange={(event) => setPresentation({ ...presentation, authorTitle: event.target.value })}
                error={invalidFields.includes("authorTitle") ? FIELD_ERRORS.authorTitle : undefined}
              />
            </div>
            <div className="flex flex-col gap-3 desktop:order-last desktop:flex-row desktop:items-center desktop:gap-6">
              <button
                type="submit"
                disabled={isSaving}
                className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}
              >
                Enregistrer les modifications
              </button>
              <p
                aria-live="polite"
                className={cn("text-small", saveState === "failed" ? "text-error" : "text-gray")}
              >
                {saveMessage}
              </p>
            </div>
            <details className="group" open={testimonial.displayBody !== null}>
              <summary
                className={cn(
                  "flex min-h-[44px] cursor-pointer list-none items-center gap-3 text-body font-bold [&::-webkit-details-marker]:hidden",
                  FOCUS_RING,
                )}
              >
                <Icon name="chevronRight" size={20} className="group-open:rotate-90" />
                {`Texte original ${prefixWithDe(firstName)}`}
              </summary>
              <div className="mt-4 flex flex-col gap-3 rounded-panel bg-sky p-6">
                <p className="max-w-quote text-quote whitespace-pre-line text-ink">{testimonial.body}</p>
                <p className="text-small text-gray">
                  {`Envoyé le ${formatDateTime(testimonial.createdAt)} · conservé tel quel, non modifiable`}
                </p>
                {testimonial.displayBody !== null ? (
                  <button
                    type="button"
                    onClick={handleRestore}
                    disabled={isSaving}
                    className={cn(DISCREET_BUTTON_CLASSES, "self-start")}
                  >
                    Afficher le texte original
                  </button>
                ) : null}
              </div>
            </details>
          </form>
        </div>

        <aside className="flex flex-col gap-8 rounded-card bg-white p-4 desktop:self-start desktop:p-6">
          <section className="flex flex-col gap-3">
            <label htmlFor="testimonial-offer" className={FIELD_LABEL_CLASSES}>
              Offre associée
            </label>
            <SelectControl
              id="testimonial-offer"
              value={productId}
              onChange={(event) => handleProductChange(event.target.value)}
            >
              <option value={WITHOUT_OFFER}>Sans offre</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </SelectControl>
            <p aria-live="polite" className={cn("text-small", productState === "failed" ? "text-error" : "text-gray")}>
              {productState === "saved" ? "Offre enregistrée." : null}
              {productState === "failed" ? "L'offre n'a pas été enregistrée. Réessayez." : null}
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className={FIELD_LABEL_CLASSES}>Source</h2>
            <p className="flex items-center gap-3 text-body">
              <Icon name={source.icon} size={20} className="hidden desktop:block" />
              {source.label}
            </p>
            {source.details ? (
              <p className="text-small text-gray">
                <span className="desktop:hidden">{source.shortDetails ?? source.details}</span>
                <span className="hidden desktop:inline">{source.details}</span>
              </p>
            ) : null}
          </section>

          <section className="flex flex-col gap-2">
            <h2 className={FIELD_LABEL_CLASSES}>Consentement</h2>
            {testimonial.consentAt ? (
              <>
                <p className="flex items-center gap-3 text-body text-success">
                  <Icon name="valid" size={20} />
                  {testimonial.source === "form"
                    ? `Accordé le ${formatDateTime(testimonial.consentAt)}`
                    : `Attesté par vous le ${formatDateTime(testimonial.consentAt)}`}
                </p>
                <p className="text-small text-gray">
                  <span className="hidden desktop:inline">{testimonial.source === "form" ? "Texte accepté : " : "Case cochée : "}</span>
                  {quoteInFrench(testimonial.consentText ?? "")}
                </p>
              </>
            ) : (
              <p className="flex items-center gap-3 text-body text-waiting">
                <Icon name="clock" size={20} />
                Aucun consentement enregistré
              </p>
            )}
            <a href={proofHref} download className={cn(DISCREET_BUTTON_CLASSES, "self-start")}>
              <span className="desktop:hidden">Télécharger la preuve</span>
              <span className="hidden desktop:inline">Télécharger la preuve de consentement</span>
            </a>
          </section>

          <section className="hidden flex-col gap-3 desktop:flex">
            <h2 className={FIELD_LABEL_CLASSES}>Photo</h2>
            {testimonial.authorPhotoUrl ? (
              <Image
                src={testimonial.authorPhotoUrl}
                alt={`Photo de ${testimonial.authorName}`}
                width={140}
                height={140}
                unoptimized
                className="size-[140px] rounded-full object-cover"
              />
            ) : (
              <p className="text-body text-gray">Aucune photo envoyée</p>
            )}
          </section>

          <section>
            <label className="flex min-h-[44px] cursor-pointer items-start gap-3">
              <Checkbox checked={review.featured} onChange={review.toggleFeatured} />
              <span className="flex flex-col">
                <span className="text-body">Mettre en avant dans les widgets</span>
                <span className="hidden text-small text-gray desktop:block">
                  Affiché en premier dans le mur et le carrousel.
                </span>
              </span>
            </label>
          </section>

          <section>
            <button
              type="button"
              onClick={deletion.askToDelete}
              disabled={deletion.isDeleting}
              className={cn(DISCREET_BUTTON_CLASSES, "text-error hover:text-error-hover")}
            >
              Supprimer définitivement
            </button>
          </section>
        </aside>
      </div>

      <ConfirmDialog
        isOpen={review.isHideConfirmationOpen}
        {...buildHideConfirmation(testimonial.authorName)}
        onConfirm={review.hide}
        onCancel={review.cancelHide}
      />
      <ConfirmDialog
        isOpen={deletion.isConfirmationOpen}
        {...buildDeleteConfirmation(testimonial.authorName)}
        onConfirm={deletion.confirmDeletion}
        onCancel={deletion.cancelDeletion}
      />
    </div>
  );
};

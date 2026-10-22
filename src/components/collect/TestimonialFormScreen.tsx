import { OPTIONAL_MARK_CLASSES } from "@/components/ui/field-styles";
import {
  MAX_AUTHOR_NAME_LENGTH,
  MAX_AUTHOR_TITLE_LENGTH,
  MAX_TESTIMONIAL_LENGTH,
  type TestimonialFieldError,
} from "@/lib/testimonials/testimonial-form-schema";
import { CollectInputField } from "./CollectInputField";
import { COLLECT_TITLE_CLASSES } from "./CollectShell";
import { CollectSubmitButton } from "./CollectSubmitButton";
import { CollectTextareaField } from "./CollectTextareaField";
import { ConsentField } from "./ConsentField";
import { HoneypotField } from "./HoneypotField";
import { type CollectionIncentive, IncentiveNote } from "./IncentiveNote";
import { PhotoPicker } from "./PhotoPicker";
import { RatingField } from "./RatingField";
import { SubmitProblemBanner } from "./SubmitProblemBanner";
import type { TestimonialFormState } from "./useTestimonialForm";

const formatCount = (value: number) => new Intl.NumberFormat("fr-FR").format(value);

const BODY_ERRORS: Record<TestimonialFieldError, string> = {
  missing: "Écrivez quelques mots sur ce qui a changé pour vous.",
  "too-long": `Votre témoignage dépasse ${formatCount(MAX_TESTIMONIAL_LENGTH)} caractères. Raccourcissez-le un peu.`,
};

const AUTHOR_NAME_ERRORS: Record<TestimonialFieldError, string> = {
  missing: "Indiquez votre prénom, et votre nom si vous le souhaitez.",
  "too-long": `Ce nom dépasse ${MAX_AUTHOR_NAME_LENGTH} caractères. Raccourcissez-le.`,
};

const AUTHOR_TITLE_TOO_LONG = `Ce titre dépasse ${MAX_AUTHOR_TITLE_LENGTH} caractères. Raccourcissez-le.`;

type TestimonialFormScreenProps = {
  form: TestimonialFormState;
  spaceName: string;
  accentColor: string | null;
  starColor: string | null;
  title: string;
  consentText: string;
  incentive?: CollectionIncentive | null;
};

/**
 * Maquettes 3.6, « Page de collecte »: the question, then the form, 28 apart; « Envoyer mon avis » the only filled
 * button, in the creator's accent. No duration: « Une note et quelques mots suffisent. » (charte v2, ton de voix).
 */
export const TestimonialFormScreen = ({
  form,
  spaceName,
  accentColor,
  starColor,
  title,
  consentText,
  incentive = null,
}: TestimonialFormScreenProps) => {
  const { values, setters, refs, fieldErrors } = form;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h1 className={COLLECT_TITLE_CLASSES}>{title}</h1>
        <p className="text-body text-gray">{`${spaceName} lira chaque mot. Une note et quelques mots suffisent.`}</p>
      </div>
      {incentive ? <IncentiveNote incentive={incentive} spaceName={spaceName} /> : null}
      <form onSubmit={form.handleSubmit} onInput={form.handleInput} noValidate className="flex flex-col gap-6">
        {form.submitProblem ? <SubmitProblemBanner problem={form.submitProblem} /> : null}
        <RatingField
          rating={values.rating}
          starColor={starColor}
          hasError={fieldErrors.rating !== undefined}
          firstStarRef={refs.firstStarRef}
          onChange={setters.setRating}
        />
        <CollectTextareaField
          id="testimonial-body"
          label="Votre témoignage"
          placeholder="Qu'est-ce qui a changé pour vous ?"
          hint="Votre avis sera public. Évitez les détails sur votre santé ou celle de vos proches."
          focusHint="Quelques phrases suffisent."
          maxLength={MAX_TESTIMONIAL_LENGTH}
          value={values.body}
          onChange={(event) => setters.setBody(event.target.value)}
          textareaRef={refs.bodyRef}
          error={fieldErrors.body ? BODY_ERRORS[fieldErrors.body] : undefined}
        />
        <CollectInputField
          id="author-name"
          label="Prénom et nom"
          autoComplete="name"
          maxLength={MAX_AUTHOR_NAME_LENGTH}
          value={values.authorName}
          onChange={(event) => setters.setAuthorName(event.target.value)}
          inputRef={refs.authorNameRef}
          hint={form.showsPrefilledNameHint ? "Repris de votre achat. Vous pouvez le modifier." : undefined}
          error={fieldErrors.authorName ? AUTHOR_NAME_ERRORS[fieldErrors.authorName] : undefined}
        />
        <CollectInputField
          id="author-title"
          label={
            <>
              Votre titre <span className={OPTIONAL_MARK_CLASSES}>(facultatif)</span>
            </>
          }
          placeholder="Enseignante, Lyon"
          autoComplete="organization-title"
          maxLength={MAX_AUTHOR_TITLE_LENGTH}
          value={values.authorTitle}
          onChange={(event) => setters.setAuthorTitle(event.target.value)}
          inputRef={refs.authorTitleRef}
          error={fieldErrors.authorTitle === "too-long" ? AUTHOR_TITLE_TOO_LONG : undefined}
        />
        <PhotoPicker upload={form.photoUpload} />
        <ConsentField
          consentText={consentText}
          spaceName={spaceName}
          isChecked={values.hasConsented}
          hasError={fieldErrors.hasConsented !== undefined}
          checkboxRef={refs.consentRef}
          onChange={setters.setHasConsented}
        />
        <HoneypotField value={values.honeypot} onChange={setters.setHoneypot} />
        <CollectSubmitButton
          accentColor={accentColor}
          isSubmitting={form.isSubmitting}
          isWaitingForPhoto={form.photoUpload.state.status === "uploading"}
        />
      </form>
    </div>
  );
};

import {
  MAX_AUTHOR_NAME_LENGTH,
  MAX_AUTHOR_TITLE_LENGTH,
  MAX_TESTIMONIAL_LENGTH,
  type TestimonialFieldError,
} from "@/lib/testimonials/testimonial-form-schema";
import { CollectHeader } from "./CollectHeader";
import { CollectInputField } from "./CollectInputField";
import { CollectSubmitButton } from "./CollectSubmitButton";
import { CollectTextareaField } from "./CollectTextareaField";
import { ConsentField } from "./ConsentField";
import { HoneypotField } from "./HoneypotField";
import { PhotoPicker } from "./PhotoPicker";
import { PoweredByPulsacity } from "./PoweredByPulsacity";
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
  logoUrl: string | null;
  title: string;
  consentText: string;
  homeUrl: string;
  referralCode: string;
};

export const TestimonialFormScreen = ({
  form,
  spaceName,
  logoUrl,
  title,
  consentText,
  homeUrl,
  referralCode,
}: TestimonialFormScreenProps) => {
  const { values, setters, refs, fieldErrors } = form;

  return (
    <>
      <CollectHeader spaceName={spaceName} logoUrl={logoUrl} />
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-h2 font-medium">{title}</h1>
        <p className="text-body text-slate-600">{`${spaceName} lira chaque mot. Comptez moins d'une minute.`}</p>
      </div>
      <form onSubmit={form.handleSubmit} onInput={form.handleInput} noValidate className="flex flex-col gap-5">
        {form.submitProblem ? <SubmitProblemBanner problem={form.submitProblem} /> : null}
        <RatingField
          rating={values.rating}
          hasError={fieldErrors.rating !== undefined}
          firstStarRef={refs.firstStarRef}
          onChange={setters.setRating}
        />
        <CollectTextareaField
          id="testimonial-body"
          label="Votre témoignage"
          placeholder="Qu'est-ce qui a changé pour vous ?"
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
              Votre titre <span className="font-normal text-slate-600">(facultatif)</span>
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
          isSubmitting={form.isSubmitting}
          isWaitingForPhoto={form.photoUpload.state.status === "uploading"}
        />
      </form>
      <PoweredByPulsacity homeUrl={homeUrl} referralCode={referralCode} />
    </>
  );
};

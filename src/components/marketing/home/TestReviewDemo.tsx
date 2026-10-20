"use client";

import { type FormEvent, useId, useRef, useState } from "react";
import { RatingInput } from "@/components/testimonials/RatingInput";
import { DISCREET_BUTTON_CLASSES, PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { FIELD_HINT_CLASSES, OPTIONAL_MARK_CLASSES } from "@/components/ui/field-styles";
import { Icon } from "@/components/ui/Icon";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { TextField } from "@/components/ui/TextField";
import { EXAMPLE_REVIEWS } from "@/content/home-examples";
import { cn } from "@/lib/cn";
import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { ExampleMention } from "../ExampleMention";
import { DemoWallCard } from "./DemoWallCard";

/** positionnement.md, section 4: what the band says before the demonstration opens. */
const INVITATION = "Écrivez un avis de test et regardez-le arriver sur le mur. Rien n'est enregistré.";

const ERRORS = {
  rating: "Choisissez une note.",
  text: "Écrivez quelques mots pour voir votre avis sur le mur.",
};

/** The name shown when the first name, optional, is left empty. */
const ANONYMOUS_NAME = "Vous";

const TEXT_MAX_LENGTH = 1000;

const FIRST_NAME_MAX_LENGTH = 40;

type TestReview = { id: number; name: string; rating: number; text: string };

type Errors = Partial<Record<keyof typeof ERRORS, string>>;

/** The example reviews of the wall: Camille, Léa, then Karim at 4 stars, as on the maquettes. */
const WALL_EXAMPLES = [EXAMPLE_REVIEWS[0], EXAMPLE_REVIEWS[2], EXAMPLE_REVIEWS[1]];

/**
 * Maquettes 3.5, Accueil, « Écrire un avis de test » (charte v2, ajouts 3.5, Démo à manipuler): the visitor writes a
 * review, and it arrives on a demonstration wall, edged with Soleil. Nothing leaves the page: no request to the server,
 * nothing kept; the review disappears with the page. No consent is asked, since nothing is published.
 */
export const TestReviewDemo = () => {
  const ids = useId();
  const [stage, setStage] = useState<"closed" | "writing" | "sent">("closed");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [firstName, setFirstName] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [reviews, setReviews] = useState<TestReview[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sentRef = useRef<HTMLParagraphElement>(null);

  const open = () => {
    setStage("writing");
    requestAnimationFrame(() => titleRef.current?.focus());
  };

  const writeAnother = () => {
    setRating(0);
    setText("");
    setFirstName("");
    setErrors({});
    open();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found: Errors = {
      rating: rating === 0 ? ERRORS.rating : undefined,
      text: text.trim() === "" ? ERRORS.text : undefined,
    };
    if (found.rating || found.text) {
      setErrors(found);
      document.getElementById(found.rating ? `${ids}-rating` : `${ids}-text`)?.focus();
      return;
    }
    setReviews((previous) => [
      { id: previous.length, name: firstName.trim() || ANONYMOUS_NAME, rating, text: text.trim() },
      ...previous,
    ]);
    setStage("sent");
    requestAnimationFrame(() => sentRef.current?.focus());
  };

  if (stage === "closed") {
    return (
      <div className="flex flex-col gap-5 rounded-block bg-sky p-6 desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-10 desktop:px-8 desktop:py-8">
        <p className="max-w-[620px] text-lead">{INVITATION}</p>
        <button type="button" onClick={open} className={cn(SECONDARY_BUTTON_CLASSES, "w-full desktop:w-auto")}>
          <Icon name="quote" size={20} />
          Écrire un avis de test
        </button>
      </div>
    );
  }

  return (
    // Maquettes 3.5 draw the open demo on Nuage: on a phone, the band runs from edge to edge, the cards keep the width.
    <div className="-mx-page-gutter grid grid-cols-[minmax(0,1fr)] items-start gap-4 bg-cloud px-page-gutter py-6 desktop:mx-[0] desktop:grid-cols-2 desktop:gap-6 desktop:rounded-block desktop:p-6">
      <section aria-labelledby={`${ids}-title`} className="flex flex-col gap-5 rounded-panel bg-white p-5 desktop:p-8">
        <h3 id={`${ids}-title`} ref={titleRef} tabIndex={-1} className="font-display text-h3 focus:outline-none">
          Votre avis de test
        </h3>
        {stage === "sent" ? (
          <div className="flex flex-col items-start gap-2">
            <p
              ref={sentRef}
              tabIndex={-1}
              role="status"
              className="flex items-center gap-2 text-body font-bold text-success focus:outline-none"
            >
              <Icon name="valid" size={20} className="shrink-0" />
              Votre avis est arrivé sur le mur.
            </p>
            <p className="text-small text-gray">Il disparaît quand vous quittez la page : rien n&apos;est enregistré.</p>
            <button type="button" onClick={writeAnother} className={cn(DISCREET_BUTTON_CLASSES, "-ml-[10px]")}>
              Écrire un autre avis
            </button>
          </div>
        ) : (
          <form noValidate onSubmit={submit} className="flex flex-col gap-5">
            <RatingInput
              id={`${ids}-rating`}
              legend="Votre note"
              isCompact
              rating={rating}
              error={errors.rating}
              onChange={(value) => {
                setRating(value);
                setErrors((previous) => ({ ...previous, rating: undefined }));
              }}
            />
            <TextAreaField
              id={`${ids}-text`}
              label="Votre avis"
              value={text}
              maxLength={TEXT_MAX_LENGTH}
              error={errors.text}
              onChange={(event) => {
                setText(event.target.value);
                setErrors((previous) => ({ ...previous, text: undefined }));
              }}
            />
            <TextField
              id={`${ids}-first-name`}
              label={
                <>
                  Votre prénom <span className={OPTIONAL_MARK_CLASSES}>(facultatif)</span>
                </>
              }
              value={firstName}
              maxLength={FIRST_NAME_MAX_LENGTH}
              autoComplete="off"
              placeholder="Par exemple : Inès"
              onChange={(event) => setFirstName(event.target.value)}
            />
            <button type="submit" className={cn(PRIMARY_BUTTON_CLASSES, "w-full")}>
              Envoyer mon avis
            </button>
            <p className={FIELD_HINT_CLASSES}>Rien n&apos;est enregistré : votre avis reste sur cette page, le temps de votre visite.</p>
          </form>
        )}
      </section>
      <section aria-labelledby={`${ids}-wall`} className="flex flex-col gap-4 rounded-panel bg-white p-4 desktop:p-6">
        <h3 id={`${ids}-wall`} className="text-small font-bold text-gray">
          Le mur de démonstration
        </h3>
        <ul className="flex flex-col gap-3">
          {reviews.map((review, index) => (
            <DemoWallCard
              key={review.id}
              name={review.name}
              detail="Votre avis de test · à l'instant"
              rating={review.rating}
              text={review.text}
              isNew={index === 0}
            />
          ))}
          {WALL_EXAMPLES.map((example) => (
            <DemoWallCard
              key={example.name}
              name={example.name}
              detail={`${example.offer} · ${formatDayMonthYear(new Date(`${example.date}T12:00:00Z`))}`}
              rating={example.rating}
              text={example.text}
            />
          ))}
        </ul>
        <ExampleMention />
      </section>
    </div>
  );
};

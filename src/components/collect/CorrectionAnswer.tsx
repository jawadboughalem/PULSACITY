import type { ReactNode } from "react";
import { SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { readAccentButtonColors } from "@/lib/colors/accent-button-colors";
import { cn } from "@/lib/cn";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { diffWords } from "@/lib/testimonials/corrections/diff-words";
import type { CorrectionPage } from "@/lib/testimonials/corrections/manage-corrections";
import { COLLECT_TITLE_CLASSES } from "./CollectShell";

const quoted = (text: string) => `«${NO_BREAK_SPACE}${text.trim()}${NO_BREAK_SPACE}»`;

/** One version of the text, on the neutral of the collect page, its label 13/18 700 Gris. */
const Version = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-2 rounded-card bg-widget-light-card px-5 py-4">
    <p className="text-legal font-bold text-gray">{label}</p>
    <p className="text-body">{children}</p>
  </div>
);

type CorrectionChoiceProps = {
  page: CorrectionPage;
  spaceSlug: string;
  token: string;
  action: (formData: FormData) => Promise<void>;
};

/**
 * Not drawn: the page of the e-mail's link, where the author answers. A link alone decides nothing, because a mail's
 * security software opens links by itself: the answer is a button of this page, the same two as the e-mail.
 */
export const CorrectionChoice = ({ page, spaceSlug, token, action }: CorrectionChoiceProps) => {
  const accent = readAccentButtonColors(page.space.accentColor);
  return (
    <div className="flex flex-col gap-6">
      <h1 className={COLLECT_TITLE_CLASSES}>{`Puis-je corriger votre avis${NO_BREAK_SPACE}?`}</h1>
      <p className="text-body">
        {`${page.space.name} aimerait corriger le texte affiché sur ses pages. Voici les deux versions${NO_BREAK_SPACE}:`}
      </p>
      <Version label="Votre texte">{quoted(page.fromBody)}</Version>
      <Version label="Le texte corrigé">
        {`«${NO_BREAK_SPACE}`}
        {diffWords(page.fromBody.trim(), page.body.trim()).map((segment, index) =>
          segment.isChanged ? (
            <strong key={index} className="font-bold underline decoration-2 underline-offset-4">
              {segment.text}
            </strong>
          ) : (
            <span key={index}>{segment.text}</span>
          ),
        )}
        {`${NO_BREAK_SPACE}»`}
      </Version>
      <p className="text-body">Rien ne change sans votre accord. Votre texte d&apos;origine reste gardé.</p>
      <form action={action} className="flex flex-col gap-3 desktop:flex-row">
        <input type="hidden" name="espace" value={spaceSlug} />
        <input type="hidden" name="c" value={token} />
        <button
          type="submit"
          name="reponse"
          value="accepter"
          className={cn(
            "pz-couleur pz-appui inline-flex h-[60px] cursor-pointer items-center justify-center rounded-full px-7 text-[18px] font-bold",
            "bg-(--accent) text-(--accent-text) hover:bg-(--accent-hover) focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink",
          )}
          style={
            {
              "--accent": accent?.background ?? "#FFBE3B",
              "--accent-text": accent?.text ?? "#16213E",
              "--accent-hover": accent?.hover ?? "#F7B021",
            } as React.CSSProperties
          }
        >
          Accepter la correction
        </button>
        <button type="submit" name="reponse" value="garder" className={cn(SECONDARY_BUTTON_CLASSES, "h-[60px]")}>
          Garder mon texte
        </button>
      </form>
      <p className="text-small text-gray">Sans réponse de votre part, votre texte d&apos;origine reste affiché.</p>
    </div>
  );
};

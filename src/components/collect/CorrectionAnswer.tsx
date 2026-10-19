import type { ReactNode } from "react";
import { DISCREET_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icon-paths";
import { SpaceAvatar } from "@/components/ui/SpaceAvatar";
import { readAccentButtonColors, readAccentTint } from "@/lib/colors/accent-button-colors";
import { cn } from "@/lib/cn";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { diffWords } from "@/lib/testimonials/corrections/diff-words";
import type { CorrectionPage } from "@/lib/testimonials/corrections/manage-corrections";
import { PoweredByPulsacity } from "./PoweredByPulsacity";

/** Charte v2, ajouts 3.6, Page de collecte: Nuage when the creator chose no accent. */
const NO_ACCENT_TINT = "#F4F8FF";

type CorrectionShellProps = {
  page: CorrectionPage;
  homeUrl: string;
  children: ReactNode;
};

/**
 * Maquettes 3.6, « Réponse à une correction »: the creator's identity only, on a tint of their accent; the card white,
 * radius 24, padding 48 56, a column of 640; on a phone, the tinted band on top and the page white.
 */
export const CorrectionShell = ({ page, homeUrl, children }: CorrectionShellProps) => {
  const tint = readAccentTint(page.space.accentColor) ?? NO_ACCENT_TINT;
  return (
    <div className="min-h-dvh bg-white text-ink desktop:bg-(--tint)" style={{ "--tint": tint } as React.CSSProperties}>
      <div className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col desktop:py-10">
        <header className="flex items-center gap-3 bg-(--tint) px-page-gutter py-4 desktop:bg-transparent desktop:px-0 desktop:pt-0 desktop:pb-6">
          <SpaceAvatar name={page.space.name} logoUrl={page.space.logoUrl} size={44} background="sky" />
          <p className="text-body font-bold">{page.space.name}</p>
        </header>
        <main className="flex flex-col gap-6 px-page-gutter pt-6 pb-8 desktop:rounded-panel desktop:bg-white desktop:px-14 desktop:py-12">
          {children}
        </main>
        <PoweredByPulsacity homeUrl={homeUrl} referralCode={page.space.referralCode} className="mt-auto pb-4 desktop:mt-4" />
      </div>
    </div>
  );
};

/** The icon in its round, the title (Figtree 800, 32/38, 26/32 on a phone), then the texts. */
export const CorrectionOutcome = ({
  icon,
  title,
  lines,
  page,
}: {
  icon: IconName;
  title: string;
  lines: [string, string];
  page: CorrectionPage;
}) => (
  <>
    <span className="flex size-[64px] items-center justify-center rounded-full bg-widget-light-card">
      <Icon name={icon} size={32} />
    </span>
    <h1 className="text-[26px] leading-[32px] font-extrabold tracking-[-0.01em] desktop:text-[32px] desktop:leading-[38px]">
      {title}
    </h1>
    <div className="flex flex-col gap-4">
      <p className="text-body">{lines[0]}</p>
      <p className="text-body text-gray">{lines[1]}</p>
    </div>
    <a href={`mailto:${page.space.replyToEmail}`} className={cn(DISCREET_BUTTON_CLASSES, "self-start -ml-[10px]")}>
      <Icon name="email" size={20} />
      {`Écrire à ${page.space.name}`}
    </a>
  </>
);

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
    <>
      <h1 className="text-[26px] leading-[32px] font-extrabold tracking-[-0.01em] desktop:text-[32px] desktop:leading-[38px]">
        {`Puis-je corriger votre avis${NO_BREAK_SPACE}?`}
      </h1>
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
    </>
  );
};

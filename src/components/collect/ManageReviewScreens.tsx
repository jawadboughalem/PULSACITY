import Link from "next/link";
import { DANGER_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";
import { prefixWithDe } from "@/lib/french/prefix-with-de";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { REQUEST_TOKEN_PARAMETER } from "@/lib/testimonials/read-request-token";
import { WITHDRAWAL_PARAMETER, WITHDRAWAL_STEPS } from "@/lib/testimonials/withdrawal-parameter";
import { CollectOutcome, WriteToCreatorLink } from "./CollectOutcome";
import { COLLECT_TITLE_CLASSES } from "./CollectShell";

type CreatorProps = { spaceName: string; replyToEmail: string };

const ACTIONS_CLASSES = "flex flex-col gap-3 desktop:flex-row";

const requestQuery = (requestToken: string, step?: string) =>
  `?${REQUEST_TOKEN_PARAMETER}=${encodeURIComponent(requestToken)}${step ? `&${WITHDRAWAL_PARAMETER}=${step}` : ""}`;

/**
 * Not drawn: « Gérer mon avis », the link of a request already answered (2.7, « lien déjà utilisé »). Built like the
 * other answers of 3.6 (CollectOutcome), the withdrawal as a bordered button: the page's one filled button stays
 * « Envoyer mon avis ».
 */
export const SavedReviewScreen = ({ spaceName, replyToEmail, requestToken }: CreatorProps & { requestToken: string }) => (
  <CollectOutcome
    icon="valid"
    title="Votre avis est enregistré"
    lines={[
      { text: `${spaceName} l'a bien reçu. Merci.` },
      {
        text: "Vous pouvez retirer votre accord à sa publication. Votre avis sera alors supprimé.",
        isSecondary: true,
      },
    ]}
    action={
      <div className="flex flex-col gap-4">
        <Link
          href={requestQuery(requestToken, WITHDRAWAL_STEPS.confirm)}
          className={cn(SECONDARY_BUTTON_CLASSES, "h-[60px] desktop:self-start")}
        >
          Retirer mon accord
        </Link>
        <WriteToCreatorLink spaceName={spaceName} replyToEmail={replyToEmail} />
      </div>
    }
  />
);

type ConfirmWithdrawalProps = CreatorProps & {
  spaceSlug: string;
  requestToken: string;
  action: (formData: FormData) => Promise<void>;
};

/**
 * A link alone decides nothing, because a mail's security software opens links by itself: the withdrawal is a button
 * of this page, after the reader has seen what it does.
 */
export const ConfirmWithdrawalScreen = ({ spaceName, spaceSlug, requestToken, action }: ConfirmWithdrawalProps) => (
  <div className="flex flex-col gap-6">
    <h1 className={COLLECT_TITLE_CLASSES}>{`Retirer votre accord${NO_BREAK_SPACE}?`}</h1>
    <p className="text-body">
      {`Votre avis sera supprimé. Il disparaîtra des pages ${prefixWithDe(spaceName)} sous 24${NO_BREAK_SPACE}heures.`}
    </p>
    <p className="text-body text-gray">Ce choix est définitif.</p>
    <form action={action} className={ACTIONS_CLASSES}>
      <input type="hidden" name="espace" value={spaceSlug} />
      <input type="hidden" name={REQUEST_TOKEN_PARAMETER} value={requestToken} />
      <button type="submit" className={cn(DANGER_BUTTON_CLASSES, "h-[60px]")}>
        Retirer mon accord
      </button>
      <Link href={requestQuery(requestToken)} className={cn(SECONDARY_BUTTON_CLASSES, "h-[60px]")}>
        Garder mon avis
      </Link>
    </form>
  </div>
);

export const WithdrawnScreen = ({ spaceName, replyToEmail }: CreatorProps) => (
  <CollectOutcome
    icon="valid"
    title="Votre accord est retiré"
    lines={[
      { text: `Votre avis est supprimé. Il disparaît des pages ${prefixWithDe(spaceName)} sous 24${NO_BREAK_SPACE}heures.` },
      { text: "Vous n'avez rien d'autre à faire.", isSecondary: true },
    ]}
    action={<WriteToCreatorLink spaceName={spaceName} replyToEmail={replyToEmail} />}
  />
);

/** The review is gone: withdrawn earlier, or deleted by the creator. */
export const RemovedReviewScreen = ({ spaceName, replyToEmail }: CreatorProps) => (
  <CollectOutcome
    icon="cancelled"
    title="Votre avis n'est plus enregistré"
    lines={[
      { text: `Il ne s'affiche plus sur les pages ${prefixWithDe(spaceName)}.` },
      { text: `Pour toute question, écrivez à ${spaceName}.`, isSecondary: true },
    ]}
    action={<WriteToCreatorLink spaceName={spaceName} replyToEmail={replyToEmail} />}
  />
);

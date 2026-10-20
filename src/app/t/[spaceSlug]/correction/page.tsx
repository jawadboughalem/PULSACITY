import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectOutcome, WriteToCreatorLink } from "@/components/collect/CollectOutcome";
import { CollectShell } from "@/components/collect/CollectShell";
import { CorrectionChoice } from "@/components/collect/CorrectionAnswer";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
import type { IconName } from "@/components/ui/icon-paths";
import {
  CORRECTION_TOKEN_PARAMETER,
  type CorrectionPage as Correction,
  findCorrection,
} from "@/lib/testimonials/corrections/manage-corrections";
import { answerCorrectionFromPage } from "./answer-correction-action";
import { CORRECTION_ANSWER_PARAMETER } from "./correction-answer-parameter";

export const metadata: Metadata = {
  title: "Votre avis · PULSACITY",
  robots: { index: false, follow: false },
};

const readParameter = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? null;

/** The icon, the title, what happened, then what to know (Gris), and the way to write to the creator. */
type OutcomeProps = { correction: Correction; icon: IconName; title: string; lines: [string, string] };

const Outcome = ({ correction, icon, title, lines }: OutcomeProps) => (
  <CollectOutcome
    icon={icon}
    title={title}
    lines={[{ text: lines[0] }, { text: lines[1], isSecondary: true }]}
    action={<WriteToCreatorLink spaceName={correction.space.name} replyToEmail={correction.space.replyToEmail} />}
  />
);

/**
 * Maquettes 3.6, « Réponse à une correction »: the author answers the creator's correction (positionnement.md, point
 * 4). Accepted, the corrected text shows; kept, nothing changes; a second visit says the answer is recorded.
 */
const CorrectionPage = async ({ params, searchParams }: PageProps<"/t/[spaceSlug]/correction">) => {
  const { spaceSlug } = await params;
  const parameters = await searchParams;
  const token = readParameter(parameters[CORRECTION_TOKEN_PARAMETER]);
  if (!token) notFound();
  const correction = await findCorrection(getDb(), spaceSlug, token);
  if (correction.status === "not-found") notFound();
  const { space } = correction;
  const identity = { name: space.name, logoUrl: space.logoUrl, accentColor: space.accentColor };
  const poweredBy = { homeUrl: getAppUrl(), referralCode: space.referralCode };
  const justAnswered = readParameter(parameters[CORRECTION_ANSWER_PARAMETER]);

  if (correction.status === "waiting") {
    return (
      <CollectShell identity={identity} poweredBy={poweredBy}>
        <CorrectionChoice page={correction} spaceSlug={spaceSlug} token={token} action={answerCorrectionFromPage} />
      </CollectShell>
    );
  }
  if (correction.status === "withdrawn") {
    return (
      <CollectShell identity={identity} poweredBy={poweredBy}>
        <Outcome
          correction={correction}
          icon="cancelled"
          title="Cette correction n'est plus proposée"
          lines={[
            `${correction.space.name} l'a retirée. Votre avis garde son texte d'origine.`,
            "Vous n'avez rien à faire.",
          ]}
        />
      </CollectShell>
    );
  }
  if (correction.outcome === "accepted" && justAnswered === "acceptee") {
    return (
      <CollectShell identity={identity} poweredBy={poweredBy}>
        <Outcome
          correction={correction}
          icon="valid"
          title="Correction acceptée"
          lines={[
            "Merci. Votre avis s'affiche désormais avec le texte corrigé.",
            "Votre texte d'origine reste gardé, tel que vous l'avez écrit.",
          ]}
        />
      </CollectShell>
    );
  }
  if (correction.outcome === "refused" && justAnswered === "gardee") {
    return (
      <CollectShell identity={identity} poweredBy={poweredBy}>
        <Outcome
          correction={correction}
          icon="valid"
          title="Votre texte reste tel quel"
          lines={[
            `C'est noté. ${correction.space.name} garde votre avis avec votre texte d'origine.`,
            "Vous pouvez toujours lui écrire pour en parler.",
          ]}
        />
      </CollectShell>
    );
  }
  return (
    <CollectShell identity={identity} poweredBy={poweredBy}>
      <Outcome
        correction={correction}
        icon="clock"
        title="Vous avez déjà répondu"
        lines={[
          "Votre réponse à cette correction est bien enregistrée.",
          `Pour changer d'avis, écrivez à ${correction.space.name}.`,
        ]}
      />
    </CollectShell>
  );
};

export default CorrectionPage;

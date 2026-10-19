import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CorrectionChoice, CorrectionOutcome, CorrectionShell } from "@/components/collect/CorrectionAnswer";
import { getDb } from "@/db";
import { getAppUrl } from "@/lib/app-url";
import { CORRECTION_TOKEN_PARAMETER, findCorrection } from "@/lib/testimonials/corrections/manage-corrections";
import { answerCorrectionFromPage } from "./answer-correction-action";
import { CORRECTION_ANSWER_PARAMETER } from "./correction-answer-parameter";

export const metadata: Metadata = {
  title: "Votre avis · PULSACITY",
  robots: { index: false, follow: false },
};

const readParameter = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? null;

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
  const homeUrl = getAppUrl();
  const justAnswered = readParameter(parameters[CORRECTION_ANSWER_PARAMETER]);

  if (correction.status === "waiting") {
    return (
      <CorrectionShell page={correction} homeUrl={homeUrl}>
        <CorrectionChoice page={correction} spaceSlug={spaceSlug} token={token} action={answerCorrectionFromPage} />
      </CorrectionShell>
    );
  }
  if (correction.status === "withdrawn") {
    return (
      <CorrectionShell page={correction} homeUrl={homeUrl}>
        <CorrectionOutcome
          page={correction}
          icon="cancelled"
          title="Cette correction n'est plus proposée"
          lines={[
            `${correction.space.name} l'a retirée. Votre avis garde son texte d'origine.`,
            "Vous n'avez rien à faire.",
          ]}
        />
      </CorrectionShell>
    );
  }
  if (correction.outcome === "accepted" && justAnswered === "acceptee") {
    return (
      <CorrectionShell page={correction} homeUrl={homeUrl}>
        <CorrectionOutcome
          page={correction}
          icon="valid"
          title="Correction acceptée"
          lines={[
            "Merci. Votre avis s'affiche désormais avec le texte corrigé.",
            "Votre texte d'origine reste gardé, tel que vous l'avez écrit.",
          ]}
        />
      </CorrectionShell>
    );
  }
  if (correction.outcome === "refused" && justAnswered === "gardee") {
    return (
      <CorrectionShell page={correction} homeUrl={homeUrl}>
        <CorrectionOutcome
          page={correction}
          icon="valid"
          title="Votre texte reste tel quel"
          lines={[
            `C'est noté. ${correction.space.name} garde votre avis avec votre texte d'origine.`,
            "Vous pouvez toujours lui écrire pour en parler.",
          ]}
        />
      </CorrectionShell>
    );
  }
  return (
    <CorrectionShell page={correction} homeUrl={homeUrl}>
      <CorrectionOutcome
        page={correction}
        icon="clock"
        title="Vous avez déjà répondu"
        lines={[
          "Votre réponse à cette correction est bien enregistrée.",
          `Pour changer d'avis, écrivez à ${correction.space.name}.`,
        ]}
      />
    </CorrectionShell>
  );
};

export default CorrectionPage;

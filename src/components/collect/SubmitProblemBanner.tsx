import { Icon } from "@/components/ui/Icon";
import type { SubmitProblem } from "./useTestimonialForm";

const KEPT_TEXT = "Votre texte est bien conservé.";

const PROBLEM_MESSAGES: Record<SubmitProblem, { title: string; detail: string }> = {
  "too-many-submissions": {
    title: "Plusieurs avis sont partis d'ici en peu de temps.",
    detail: `Patientez quelques minutes, puis renvoyez. ${KEPT_TEXT}`,
  },
  "page-not-found": {
    title: "Cette page de collecte n'existe plus.",
    detail: "Écrivez directement à la personne qui vous l'a envoyée.",
  },
  "invalid-photo": {
    title: "La photo n'a pas été reçue.",
    detail: `Retirez-la ou choisissez-la à nouveau, puis renvoyez. ${KEPT_TEXT}`,
  },
  "invalid-input": {
    title: "Certains champs sont à vérifier.",
    detail: `Corrigez-les, puis renvoyez. ${KEPT_TEXT}`,
  },
  unavailable: {
    title: "Votre avis n'a pas pu partir.",
    detail: `Vérifiez votre connexion, puis renvoyez. ${KEPT_TEXT}`,
  },
};

type SubmitProblemBannerProps = {
  problem: SubmitProblem;
};

export const SubmitProblemBanner = ({ problem }: SubmitProblemBannerProps) => (
  <div role="alert" className="flex items-start gap-3 rounded-lg border-2 border-error bg-error-surface p-4 text-error">
    <Icon name="alert" size={20} className="mt-[2px]" />
    <div className="flex flex-col gap-1">
      <p className="text-body font-semibold">{PROBLEM_MESSAGES[problem].title}</p>
      <p className="text-small">{PROBLEM_MESSAGES[problem].detail}</p>
    </div>
  </div>
);

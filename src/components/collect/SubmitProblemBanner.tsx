import { StatusBanner } from "@/components/ui/StatusBanner";
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

/** Charte v2, Bandeau d'erreur: the detail says what to do, since the form itself is the action. */
export const SubmitProblemBanner = ({ problem }: SubmitProblemBannerProps) => (
  <StatusBanner tone="error" title={PROBLEM_MESSAGES[problem].title}>
    {PROBLEM_MESSAGES[problem].detail}
  </StatusBanner>
);

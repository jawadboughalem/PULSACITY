export const PLAN_LIMIT_MESSAGE = "Pour l'afficher : passez au plan Essentiel, ou masquez un témoignage déjà publié.";

export const REVIEW_ERROR_MESSAGES = {
  "testimonial-not-found": "Ce témoignage n'existe plus. Rechargez la page.",
  "not-saved": "La modification n'a pas été enregistrée. Vérifiez votre connexion, puis réessayez.",
} as const;

export type ReviewError = keyof typeof REVIEW_ERROR_MESSAGES;

export const buildHideConfirmation = (authorName: string) => ({
  title: `Masquer l'avis de ${authorName} ?`,
  message: "Il n'apparaîtra plus sur vos pages. Vous pourrez l'afficher à nouveau à tout moment.",
  confirmLabel: "Masquer l'avis",
});

export const buildDeleteConfirmation = (authorName: string) => ({
  title: `Supprimer définitivement l'avis de ${authorName} ?`,
  message:
    "Le texte, la photo et la preuve de consentement seront effacés de PULSACITY. Vous ne pourrez pas les retrouver.",
  confirmLabel: "Supprimer l'avis",
});

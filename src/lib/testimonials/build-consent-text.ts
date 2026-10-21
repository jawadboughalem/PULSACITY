import { prefixWithQue } from "@/lib/french/prefix-with-de";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { SUPPORT_EMAIL } from "@/lib/support/support-address";

/** The page of a review request, or the creator's public link: only the first knows the purchase and has an e-mail. */
export type ConsentContext = "request" | "public-link";

/**
 * The box of the collect page (texte associé de 2.7), kept with the testimonial as the proof of its consent. It names
 * what the widget shows, and nothing else: the score, the text, the name and title typed, the photo, the date of the
 * review, and the month of the purchase when a request knows it.
 */
export const buildConsentText = (spaceName: string, context: ConsentContext): string => {
  const shown =
    context === "request"
      ? "ma note, mon texte, le nom et le titre que j'indique, ma photo si j'en ajoute une, la date de mon avis et le mois de mon achat"
      : "ma note, mon texte, le nom et le titre que j'indique, ma photo si j'en ajoute une, et la date de mon avis";
  const withdrawal =
    context === "request"
      ? "avec le lien de l'e-⁠mail reçu"
      : `en écrivant à ${spaceName} ou à ${SUPPORT_EMAIL}`;
  return `J'ai 18 ans ou plus et j'accepte ${prefixWithQue(spaceName)} publie mon avis sur ses pages de vente${NO_BREAK_SPACE}: ${shown}. Je peux retirer mon accord à tout moment ${withdrawal}.`;
};

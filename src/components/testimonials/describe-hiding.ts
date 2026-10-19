import { formatDayMonthYear } from "@/lib/dates/format-french-date";
import { NO_BREAK_SPACE } from "@/lib/french/typography";
import { describeHiddenReason } from "@/lib/testimonials/hidden-reasons";
import type { TestimonialDetail } from "@/lib/testimonials/load-testimonial-detail";

type Hiding = Pick<
  TestimonialDetail,
  "authorName" | "hiddenAt" | "hiddenReason" | "hiddenReasonDetail" | "hiddenReasonSentAt" | "authorReach"
>;

const quoted = (text: string) => `«${NO_BREAK_SPACE}${text}${NO_BREAK_SPACE}»`;

/**
 * Maquettes 3.4, fiche 06, « Masqué, motif transmis »: when, and what became of the reason. The cases the maquette
 * does not draw say why nothing left: no address, an author who unsubscribed, a reason already sent for this review.
 */
export const describeHiding = (testimonial: Hiding): { title: string; detail: string } => {
  const title = testimonial.hiddenAt ? `Masqué le ${formatDayMonthYear(testimonial.hiddenAt)}.` : "Masqué.";
  const reason = describeHiddenReason(testimonial);
  const name = testimonial.authorName;
  if (reason === null) {
    return {
      title,
      detail: "Masqué sans motif : il compte encore dans la note de vos widgets. Pour le retirer de la note, validez-le, puis masquez-le avec un motif.",
    };
  }
  const motif = quoted(reason);
  if (testimonial.authorReach === "no-address") {
    return { title, detail: `Motif gardé avec l'avis${NO_BREAK_SPACE}: ${motif}. Sans adresse e-⁠mail, il n'est pas envoyé.` };
  }
  if (testimonial.authorReach === "unsubscribed") {
    return { title, detail: `Motif gardé avec l'avis${NO_BREAK_SPACE}: ${motif}. ${name} ne reçoit plus vos e-⁠mails.` };
  }
  const { hiddenAt, hiddenReasonSentAt } = testimonial;
  if (hiddenReasonSentAt === null) {
    return { title, detail: `Motif à envoyer à ${name}${NO_BREAK_SPACE}: ${motif}. Il part au prochain envoi.` };
  }
  if (hiddenAt !== null && hiddenReasonSentAt < hiddenAt) {
    return {
      title,
      detail: `Motif${NO_BREAK_SPACE}: ${motif}. ${name} a déjà reçu un motif pour cet avis${NO_BREAK_SPACE}: un seul e-⁠mail par avis.`,
    };
  }
  return { title, detail: `Motif envoyé à ${name}${NO_BREAK_SPACE}: ${motif}.` };
};

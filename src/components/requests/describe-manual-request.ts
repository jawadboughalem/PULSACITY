import { formatDayMonth, formatDayMonthYear } from "@/lib/dates/format-french-date";
import { describeMissingEmailPart } from "@/lib/forms/describe-invalid-email";
import { endSentence } from "@/lib/french/typography";
import type { ExistingRequest } from "@/lib/requests/request-review-manually";

/** m20, under the address: what is missing, with the address the creator typed completed as an example. */
export const describeInvalidEmail = (value: string): string => {
  const typed = value.trim();
  if (!typed) return "Indiquez l'adresse e-mail de cette personne : c'est là que part la demande.";
  return (
    describeMissingEmailPart(typed) ??
    "Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple elodie@exemple.fr."
  );
};

/** m20, under the names: how the e-mail greets the customer. */
export const describeEmailGreeting = (firstName: string): string =>
  firstName.trim()
    ? `L'e-mail commence par « Bonjour ${firstName.trim()}, ».`
    : "L'e-mail commence par « Bonjour Élodie, ». Sans prénom : « Bonjour, ».";

/** m20, under the date: the sentence of the e-mail that says why the customer receives it (`ReviewRequestEmail`). */
export const describeEmailReason = (productName: string | null, spaceName: string, purchasedAt: Date | null): string =>
  `L'e-mail dira : « vous avez acheté ${productName ?? "[l'offre]"} auprès de ${spaceName} le ${
    purchasedAt ? formatDayMonthYear(purchasedAt) : "[date]"
  } ».`;

const ONE_REQUEST = "Une seule demande par client et par offre : ainsi, personne ne reçoit plus de deux e-mails.";

/** m20, « déjà une demande »: what became of the first request, and what the creator can still do. */
export const describeExistingRequest = (existing: ExistingRequest, now: Date): { detail: string; todo: string } => {
  const sent = existing.sentAt ? formatDayMonth(existing.sentAt) : null;
  const history = (() => {
    switch (existing.status) {
      case "scheduled":
        return existing.scheduledAt > now
          ? `Elle partira le ${formatDayMonth(existing.scheduledAt)}`
          : "Elle part au prochain envoi";
      case "sent":
        return existing.reminderScheduledAt
          ? `Elle lui a été envoyée le ${sent} ; une relance est prévue le ${formatDayMonth(existing.reminderScheduledAt)}`
          : `Elle lui a été envoyée le ${sent}`;
      case "reminded":
        return `Elle lui a été envoyée le ${sent}, puis relancée le ${formatDayMonth(existing.reminderSentAt ?? existing.scheduledAt)}`;
      case "completed":
        return existing.completedAt ? `Son avis est arrivé le ${formatDayMonth(existing.completedAt)}` : "Son avis est arrivé";
      case "cancelled":
        return existing.cancelledAt ? `Elle a été annulée le ${formatDayMonth(existing.cancelledAt)}` : "Elle a été annulée";
      case "failed":
        return "Elle n'a pas pu partir";
    }
  })();
  const todo =
    existing.status === "completed"
      ? "rien de plus : son avis vous attend dans Témoignages."
      : existing.status === "failed"
        ? "corrigez son adresse depuis sa demande, elle repartira."
        : "si cette personne vous a dit vouloir donner son avis, envoyez-lui vous-même votre lien de collecte.";
  return { detail: `${endSentence(history)} ${ONE_REQUEST}`, todo };
};

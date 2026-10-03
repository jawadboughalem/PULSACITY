import type { BadgeTone } from "@/components/ui/ToneBadge";
import type { IconName } from "@/components/ui/icon-paths";
import { formatDayMonth } from "@/lib/dates/format-french-date";
import type { ReviewRequestStatus, SpaceRequest } from "@/lib/requests/list-space-requests";

export const REQUEST_BADGES = {
  scheduled: { tone: "attention", label: "Planifiée", icon: "clock" },
  sent: { tone: "neutral", label: "Envoyée", icon: "mail" },
  reminded: { tone: "neutral", label: "Relancée", icon: "mail" },
  completed: { tone: "success", label: "Complétée", icon: "valid" },
  cancelled: { tone: "neutral", label: "Annulée", icon: "cancelled" },
  failed: { tone: "error", label: "Échec", icon: "alert" },
} as const satisfies Record<ReviewRequestStatus, { tone: BadgeTone; label: string; icon: IconName }>;

/** The address parameter of the status filter: read by the page on the server, set by the filter in the browser. */
export const REQUEST_STATUS_PARAMETER = "statut";

/** The filter of the list, its values in the address. */
export const REQUEST_STATUS_FILTERS = [
  { status: "scheduled", value: "planifiees", label: "Planifiées" },
  { status: "sent", value: "envoyees", label: "Envoyées" },
  { status: "reminded", value: "relancees", label: "Relancées" },
  { status: "completed", value: "completees", label: "Complétées" },
  { status: "cancelled", value: "annulees", label: "Annulées" },
  { status: "failed", value: "echecs", label: "Échecs" },
] as const satisfies readonly { status: ReviewRequestStatus; value: string; label: string }[];

export const readRequestStatusFilter = (value: string | string[] | undefined): ReviewRequestStatus | null => {
  const searched = Array.isArray(value) ? value[0] : value;
  return REQUEST_STATUS_FILTERS.find((filter) => filter.value === searched)?.status ?? null;
};

type Context = { now: Date; isPlanLimitReached: boolean };

/** One line under the customer: when the request left or will leave, and what came of it. */
export const describeRequest = (request: SpaceRequest, { now, isPlanLimitReached }: Context): string => {
  switch (request.status) {
    case "scheduled":
      if (request.scheduledAt > now) return `Partira le ${formatDayMonth(request.scheduledAt)}`;
      return isPlanLimitReached ? "Partira le mois prochain : limite du plan atteinte" : "Part au prochain envoi";
    case "sent":
      return request.reminderScheduledAt
        ? `Envoyée le ${formatDayMonth(request.sentAt ?? request.scheduledAt)} · relance prévue le ${formatDayMonth(request.reminderScheduledAt)}`
        : `Envoyée le ${formatDayMonth(request.sentAt ?? request.scheduledAt)} · sans relance`;
    case "reminded":
      return `Envoyée le ${formatDayMonth(request.sentAt ?? request.scheduledAt)} · relancée le ${formatDayMonth(request.reminderSentAt ?? request.scheduledAt)}`;
    case "completed":
      return request.completedAt ? `Avis reçu le ${formatDayMonth(request.completedAt)}` : "Avis reçu";
    case "cancelled":
      return request.isUnsubscribed ? "Annulée : le client s'est désinscrit" : "Annulée";
    case "failed":
      return "L'e-mail n'a pas pu partir. Vérifiez l'adresse du client, puis réessayez.";
  }
};

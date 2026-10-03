import type { BadgeTone } from "@/components/ui/ToneBadge";
import type { IconName } from "@/components/ui/icon-paths";
import { formatDayMonth } from "@/lib/dates/format-french-date";
import type { ReviewRequestStatus, SpaceRequest } from "@/lib/requests/list-space-requests";

/** m19, « Statuts d'une demande »: the icon and the word carry the meaning, the colour confirms it. */
export const REQUEST_BADGES = {
  scheduled: { tone: "paper", label: "Planifiée", icon: "clock" },
  sent: { tone: "outline", label: "Envoyée", icon: "mail" },
  reminded: { tone: "outline", label: "Relancée", icon: "replay" },
  completed: { tone: "success", label: "Complétée", icon: "valid" },
  cancelled: { tone: "dashed", label: "Annulée", icon: "close" },
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

type Context = {
  now: Date;
  /** The plan's limit is reached: the requests planned before this day wait for it. */
  heldUntil: Date | null;
};

/** One line under the customer: when the request left or will leave, and what came of it. */
export const describeRequest = (request: SpaceRequest, { now, heldUntil }: Context): string => {
  switch (request.status) {
    case "scheduled":
      if (heldUntil && request.scheduledAt < heldUntil) {
        return `Prévue le ${formatDayMonth(request.scheduledAt)} · partira le ${formatDayMonth(heldUntil)}`;
      }
      return request.scheduledAt > now ? `Partira le ${formatDayMonth(request.scheduledAt)}` : "Part au prochain envoi";
    case "sent":
      return request.reminderScheduledAt
        ? `Envoyée le ${formatDayMonth(request.sentAt ?? request.scheduledAt)} · relance prévue le ${formatDayMonth(request.reminderScheduledAt)}`
        : `Envoyée le ${formatDayMonth(request.sentAt ?? request.scheduledAt)} · sans relance`;
    case "reminded":
      return `Envoyée le ${formatDayMonth(request.sentAt ?? request.scheduledAt)} · relancée le ${formatDayMonth(request.reminderSentAt ?? request.scheduledAt)}`;
    case "completed":
      return request.completedAt ? `Avis reçu le ${formatDayMonth(request.completedAt)}` : "Avis reçu";
    case "cancelled": {
      const cancelled = request.cancelledAt ? `Annulée le ${formatDayMonth(request.cancelledAt)}` : "Annulée";
      return request.isUnsubscribed ? `${cancelled} : le client s'est désinscrit.` : cancelled;
    }
    case "failed":
      return request.failedAt
        ? `Non envoyée le ${formatDayMonth(request.failedAt)}, après trois essais. Vérifiez l'adresse e-mail.`
        : "Non envoyée après trois essais. Vérifiez l'adresse e-mail.";
  }
};

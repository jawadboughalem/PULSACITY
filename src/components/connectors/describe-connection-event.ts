import type { IconName } from "@/components/ui/icon-paths";
import type { ConnectionEvent } from "@/lib/connectors/load-connection-overview";
import { formatDayMonth } from "@/lib/dates/format-french-date";

export type EventTone = "success" | "attention" | "neutral" | "error";

export type DescribedEvent = {
  label: string;
  /** « Programme 30 jours · Léa M. » after the label, when the event carries them. */
  subject: string;
  detail: string;
  tone: EventTone;
  icon: IconName;
  canReplay: boolean;
};

const LABELS = {
  sale: "Nouvelle vente",
  enrollment: "Inscription",
  other: "Autre événement",
} as const satisfies Record<ConnectionEvent["kind"], string>;

type State = Pick<DescribedEvent, "detail" | "tone" | "icon"> & { canReplay?: boolean };

const describeRequest = (request: NonNullable<ConnectionEvent["request"]>): State => {
  if (request.status === "scheduled") {
    return { detail: `Demande d'avis prévue le ${formatDayMonth(request.scheduledAt)}`, tone: "success", icon: "valid" };
  }
  if (request.status === "cancelled") return { detail: "Demande d'avis annulée", tone: "neutral", icon: "cancelled" };
  if (request.status === "completed") return { detail: "Avis reçu", tone: "success", icon: "valid" };
  if (request.status === "failed") return { detail: "La demande d'avis n'a pas pu partir", tone: "error", icon: "alert" };
  return {
    detail: request.sentAt ? `Demande d'avis envoyée le ${formatDayMonth(request.sentAt)}` : "Demande d'avis envoyée",
    tone: "success",
    icon: "valid",
  };
};

const describeState = (event: ConnectionEvent, connectorName: string): State => {
  if (event.error === "invalid-signature") {
    return {
      detail: `Clé secrète différente : gardée de côté. Corrigez la clé dans ${connectorName}, puis rejouez la vente.`,
      tone: "attention",
      icon: "alert",
      canReplay: true,
    };
  }
  if (event.error === "invalid-payload") {
    return { detail: "Contenu illisible : gardé de côté", tone: "error", icon: "alert", canReplay: true };
  }
  if (event.error === "processing-failed") {
    return { detail: "Traitement interrompu : gardé de côté", tone: "error", icon: "alert", canReplay: true };
  }
  switch (event.outcome) {
    case null:
      return { detail: "En cours de traitement…", tone: "neutral", icon: "clock" };
    case "request-scheduled":
      return event.request ? describeRequest(event.request) : { detail: "Demande d'avis prévue", tone: "success", icon: "valid" };
    case "awaiting-product":
      return { detail: "En attente : associez ce produit à une offre", tone: "attention", icon: "clock" };
    case "request-exists":
      return { detail: "Ce client a déjà une demande pour cette offre", tone: "neutral", icon: "valid" };
    case "unsubscribed":
      return { detail: "Pas de demande : ce client s'est désinscrit", tone: "neutral", icon: "cancelled" };
    case "requests-disabled":
      return { detail: "Pas de demande : désactivées pour cette offre", tone: "neutral", icon: "cancelled" };
    case "duplicate":
      return { detail: "Déjà reçue : rien de nouveau", tone: "neutral", icon: "valid" };
    case "unsupported":
      return { detail: "Gardé de côté, sans demande d'avis", tone: "neutral", icon: "info" };
  }
};

/** Maquette 5, « Derniers événements reçus »: a sentence for each event, never its JSON. */
export const describeConnectionEvent = (event: ConnectionEvent, connectorName: string): DescribedEvent => {
  const { canReplay = false, ...state } = describeState(event, connectorName);
  return {
    label: LABELS[event.kind],
    subject: [event.productName, event.customerName].filter(Boolean).join(" · "),
    canReplay,
    ...state,
  };
};

import type { IconName } from "@/components/ui/icon-paths";
import { CONNECTOR_NAMES } from "@/lib/connectors/connector-names";
import { formatDayMonth, formatDayMonthYear } from "@/lib/dates/format-french-date";
import type { TestimonialDetail } from "@/lib/testimonials/load-testimonial-detail";

const DAY_MS = 24 * 60 * 60 * 1000;

export type TestimonialSourceDescription = {
  icon: IconName;
  label: string;
  details: string | null;
  shortDetails: string | null;
};

const describeDelay = (from: Date, to: Date) => {
  const days = Math.max(0, Math.round((to.getTime() - from.getTime()) / DAY_MS));
  if (days === 0) return "réponse le jour même";
  return days === 1 ? "réponse après 1 jour" : `réponse après ${days} jours`;
};

export const describeTestimonialSource = (testimonial: TestimonialDetail): TestimonialSourceDescription => {
  if (testimonial.source === "manual") {
    return {
      icon: "quote",
      label: "Ajout manuel",
      details: testimonial.consentAt ? `Ajouté par vous le ${formatDayMonthYear(testimonial.consentAt)}` : null,
      shortDetails: null,
    };
  }
  if (testimonial.source === "csv") {
    return {
      icon: "upload",
      label: "Import CSV",
      details: testimonial.consentAt ? `Importé par vous le ${formatDayMonthYear(testimonial.consentAt)}` : null,
      shortDetails: null,
    };
  }
  const { request } = testimonial;
  if (!request) {
    return { icon: "mail", label: "Page de collecte", details: "Laissé depuis votre lien de collecte", shortDetails: null };
  }

  const purchase = `Achat du ${formatDayMonthYear(request.purchasedAt)}`;
  const sent = request.requestSentAt ? `demande envoyée le ${formatDayMonth(request.requestSentAt)}` : null;
  const answered =
    request.requestSentAt && request.answeredAt ? describeDelay(request.requestSentAt, request.answeredAt) : null;
  return {
    icon: request.connector ? "connection" : "mail",
    label: request.connector ? `Connecteur ${CONNECTOR_NAMES[request.connector]}` : "Demande envoyée depuis PULSACITY",
    details: [purchase, [sent, answered].filter(Boolean).join(", ")].filter(Boolean).join(" · "),
    shortDetails: [purchase, request.requestSentAt ? `demande du ${formatDayMonth(request.requestSentAt)}` : null]
      .filter(Boolean)
      .join(" · "),
  };
};

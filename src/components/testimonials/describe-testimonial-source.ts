import type { IconName } from "@/components/ui/icon-paths";
import { readConnectorName } from "@/lib/connectors/registry";
import { formatDayMonth, formatDayMonthYear, formatMonthYear } from "@/lib/dates/format-french-date";
import type { TestimonialDetail } from "@/lib/testimonials/load-testimonial-detail";
import { hasKnownPurchase } from "@/lib/testimonials/testimonial-provenance";

const DAY_MS = 24 * 60 * 60 * 1000;

export type TestimonialSourceDescription = {
  icon: IconName;
  label: string;
  details: string | null;
  shortDetails: string | null;
  /** « Dans vos widgets : avis du 26 sept. 2026, achat en juin 2026. » */
  widgetLine: string;
};

const describeDelay = (from: Date, to: Date) => {
  const days = Math.max(0, Math.round((to.getTime() - from.getTime()) / DAY_MS));
  if (days === 0) return "réponse le jour même";
  return days === 1 ? "réponse après 1 jour" : `réponse après ${days} jours`;
};

type ProvenanceSource = Pick<
  TestimonialDetail,
  "provenance" | "purchasedAt" | "purchaseConnector" | "request" | "consentAt" | "createdAt"
>;

/** What the widgets write under the author (lot 4.13): the day of the review, and the month of a known purchase. */
export const describeWidgetDates = ({ provenance, purchasedAt, createdAt }: ProvenanceSource): string =>
  purchasedAt && hasKnownPurchase(provenance)
    ? `avis du ${formatDayMonthYear(createdAt)}, achat en ${formatMonthYear(purchasedAt)}`
    : `avis du ${formatDayMonthYear(createdAt)}`;

/**
 * Maquettes 3.4, « Provenance » and its five cases: a sale received, a manual request, an addition, an import or the
 * public link, with the purchase date when it is known, and what the widgets will show of it.
 */
export const describeTestimonialSource = (testimonial: ProvenanceSource): TestimonialSourceDescription => {
  const widgetLine = `Dans vos widgets : ${describeWidgetDates(testimonial)}.`;
  const { provenance, request } = testimonial;
  if (provenance === "added" || provenance === "import" || provenance === "public-link") {
    const by = testimonial.consentAt ?? testimonial.createdAt;
    const details = {
      added: `Ajouté par vous le ${formatDayMonthYear(by)} · date d'achat inconnue`,
      import: `Importé par vous le ${formatDayMonthYear(by)} · date d'achat inconnue`,
      "public-link": "Laissé depuis votre lien de collecte · date d'achat inconnue",
    }[provenance];
    return {
      icon: { added: "quote", import: "upload", "public-link": "share" }[provenance] as IconName,
      label: { added: "Ajout", import: "Import", "public-link": "Lien public" }[provenance],
      details,
      shortDetails: null,
      widgetLine,
    };
  }

  const purchase = testimonial.purchasedAt ? `Achat du ${formatDayMonthYear(testimonial.purchasedAt)}` : null;
  const sentAt = request?.requestSentAt ?? null;
  const sent = sentAt ? `demande envoyée le ${formatDayMonth(sentAt)}` : null;
  const answered = sentAt && request?.answeredAt ? describeDelay(sentAt, request.answeredAt) : null;
  return {
    icon: provenance === "sale" ? "connection" : "mail",
    label:
      provenance === "sale"
        ? `Vente reçue${testimonial.purchaseConnector ? ` · ${readConnectorName(testimonial.purchaseConnector)}` : ""}`
        : "Demande manuelle",
    details: [purchase, [sent, answered].filter(Boolean).join(", ")].filter(Boolean).join(" · ") || null,
    shortDetails: [purchase, sentAt ? `demande du ${formatDayMonth(sentAt)}` : null].filter(Boolean).join(" · ") || null,
    widgetLine,
  };
};

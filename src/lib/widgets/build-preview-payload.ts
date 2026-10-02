import type { WidgetCardStyle, WidgetPayload } from "../../../widget/src/payload";
import { buildWidgetPayload, countTestimonialsForAnswer } from "./build-widget-payload";
import type { ShownSummary, WidgetPreviewData } from "./load-widget-preview";
import type { WidgetEdit } from "./widget-settings";

export type PreviewLook = {
  cardStyle: WidgetCardStyle;
  spaceAccentColor: string | null;
  poweredByUrl: string;
  canHideBadge: boolean;
};

const NO_TESTIMONIAL: ShownSummary = { total: 0, averageRating: null };

/** The payload the public JSON would send once these settings are saved, built from the data the editor holds. */
export const buildPreviewPayload = (
  data: WidgetPreviewData,
  edit: WidgetEdit,
  look: PreviewLook,
  offset = 0,
): WidgetPayload => {
  const { type, productId, ...settings } = edit;
  const shown = productId ? data.testimonials.filter((testimonial) => testimonial.productId === productId) : data.testimonials;
  const summary = productId ? (data.summaries.byOffer[productId] ?? NO_TESTIMONIAL) : data.summaries.all;
  const start = type === "wall" ? offset : 0;
  const payload = buildWidgetPayload({
    type,
    settings: { ...settings, cardStyle: look.cardStyle },
    spaceAccentColor: look.spaceAccentColor,
    poweredBy: settings.hidePoweredBy && look.canHideBadge ? null : look.poweredByUrl,
    total: summary.total,
    averageRating: summary.averageRating,
    testimonials: shown.slice(start, start + countTestimonialsForAnswer(type, settings.maxItems, start)),
    offset: start,
  });
  // The editor holds the first testimonials only: « Voir les autres avis » stops where they end.
  return payload.next !== null && payload.next >= shown.length ? { ...payload, next: null } : payload;
};

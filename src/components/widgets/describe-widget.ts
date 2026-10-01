import type { IconName } from "@/components/ui/icon-paths";
import type { WidgetType } from "../../../widget/src/payload";

export const WIDGET_TYPE_OPTIONS: Array<{ type: WidgetType; label: string; icon: IconName }> = [
  { type: "wall", label: "Mur", icon: "wall" },
  { type: "carousel", label: "Carrousel", icon: "carousel" },
  { type: "badge", label: "Badge", icon: "badge" },
];

export const ALL_OFFERS_LABEL = "Toutes les offres";

const typeLabel = (type: WidgetType) => WIDGET_TYPE_OPTIONS.find((option) => option.type === type)?.label ?? "Mur";

/** « Mur · Toutes les offres »: a widget is named after what it shows, until it has a name of its own. */
export const describeWidget = (type: WidgetType, offerName: string | null): string =>
  `${typeLabel(type)} · ${offerName ?? ALL_OFFERS_LABEL}`;

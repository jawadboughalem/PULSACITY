import { z } from "zod";
import type { WidgetSettings } from "@/db/schema";
import { HEX_COLOR_PATTERN } from "@/lib/colors/contrast-ratio";
import {
  WIDGET_CARD_STYLES,
  WIDGET_THEMES,
  WIDGET_TYPES,
  type WidgetCardStyle,
  type WidgetTheme,
  type WidgetType,
} from "../../../widget/src/payload";

export const DEFAULT_WIDGET_MAX_ITEMS = 12;

export const MIN_WIDGET_MAX_ITEMS = 1;

/** A technical bound, the same on every plan: it keeps the public JSON small. */
export const MAX_WIDGET_MAX_ITEMS = 50;

export type ResolvedWidgetSettings = {
  theme: WidgetTheme;
  accentColor: string | null;
  maxItems: number;
  showPhoto: boolean;
  showRating: boolean;
  showDate: boolean;
  hidePoweredBy: boolean;
  cardStyle: WidgetCardStyle;
};

export const DEFAULT_WIDGET_SETTINGS: ResolvedWidgetSettings = {
  theme: "auto",
  accentColor: null,
  maxItems: DEFAULT_WIDGET_MAX_ITEMS,
  showPhoto: true,
  showRating: true,
  showDate: true,
  hidePoweredBy: false,
  cardStyle: "sharp",
};

const accentColorSchema = z.string().regex(HEX_COLOR_PATTERN).transform((color) => color.toUpperCase()).nullable();

const maxItemsSchema = z.number().int().min(MIN_WIDGET_MAX_ITEMS).max(MAX_WIDGET_MAX_ITEMS);

/** What a widget row holds may predate a setting, or come from an older editor: each setting falls back alone. */
const storedSettingsSchema = z.object({
  theme: z.enum(WIDGET_THEMES).catch(DEFAULT_WIDGET_SETTINGS.theme),
  accentColor: accentColorSchema.catch(DEFAULT_WIDGET_SETTINGS.accentColor),
  maxItems: maxItemsSchema.catch(DEFAULT_WIDGET_SETTINGS.maxItems),
  showPhoto: z.boolean().catch(DEFAULT_WIDGET_SETTINGS.showPhoto),
  showRating: z.boolean().catch(DEFAULT_WIDGET_SETTINGS.showRating),
  showDate: z.boolean().catch(DEFAULT_WIDGET_SETTINGS.showDate),
  hidePoweredBy: z.boolean().catch(DEFAULT_WIDGET_SETTINGS.hidePoweredBy),
  cardStyle: z.enum(WIDGET_CARD_STYLES).catch(DEFAULT_WIDGET_SETTINGS.cardStyle),
});

export const resolveWidgetSettings = (stored: WidgetSettings | null | undefined): ResolvedWidgetSettings =>
  storedSettingsSchema.parse(stored ?? {});

/** The creator's name for a widget, for their list only. */
export const MAX_WIDGET_NAME_LENGTH = 80;

const widgetNameSchema = z
  .string()
  .trim()
  .max(MAX_WIDGET_NAME_LENGTH)
  .nullable()
  .transform((name) => (name ? name : null));

/** Everything the editor of maquette 6 changes, saved as a whole on each change. */
export const widgetEditSchema = z.object({
  name: widgetNameSchema,
  type: z.enum(WIDGET_TYPES),
  productId: z.uuid().nullable(),
  theme: z.enum(WIDGET_THEMES),
  accentColor: accentColorSchema,
  maxItems: maxItemsSchema,
  showPhoto: z.boolean(),
  showRating: z.boolean(),
  showDate: z.boolean(),
  hidePoweredBy: z.boolean(),
  cardStyle: z.enum(WIDGET_CARD_STYLES),
});

export type WidgetEdit = z.output<typeof widgetEditSchema>;

/** One save of the editor: only what the creator just changed, so that another editor left open overwrites nothing. */
export const widgetChangeSchema = widgetEditSchema.partial();

export type WidgetChange = z.output<typeof widgetChangeSchema>;

export type EditableWidget = WidgetEdit & { id: string };

/** The settings column of an edit: what the public JSON reads. */
export const toWidgetSettings = (edit: WidgetEdit): ResolvedWidgetSettings => ({
  theme: edit.theme,
  accentColor: edit.accentColor,
  maxItems: edit.maxItems,
  showPhoto: edit.showPhoto,
  showRating: edit.showRating,
  showDate: edit.showDate,
  hidePoweredBy: edit.hidePoweredBy,
  cardStyle: edit.cardStyle,
});

export const toEditableWidget = (widget: {
  id: string;
  name: string | null;
  type: WidgetType;
  productId: string | null;
  settings: WidgetSettings;
}): EditableWidget => {
  const { theme, accentColor, maxItems, showPhoto, showRating, showDate, hidePoweredBy, cardStyle } =
    resolveWidgetSettings(widget.settings);
  return {
    id: widget.id,
    name: widget.name,
    type: widget.type,
    productId: widget.productId,
    theme,
    accentColor,
    maxItems,
    showPhoto,
    showRating,
    showDate,
    hidePoweredBy,
    cardStyle,
  };
};

/** The public JSON of /api/widget/[widgetId]: only what the widget displays, nothing more. */

export const WIDGET_PAYLOAD_VERSION = 1;

export const WIDGET_TYPES = ["wall", "carousel", "badge"] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];

export const WIDGET_THEMES = ["light", "dark", "auto"] as const;

export type WidgetTheme = (typeof WIDGET_THEMES)[number];

export const WIDGET_CARD_STYLES = ["sharp", "soft"] as const;

export type WidgetCardStyle = (typeof WIDGET_CARD_STYLES)[number];

export type PublicTestimonial = {
  name: string;
  initials: string;
  title: string | null;
  /** Null when the widget hides photos, or the customer sent none. */
  photo: string | null;
  /** Null when the widget hides ratings. */
  rating: number | null;
  text: string;
  /** Day of reception in Paris, YYYY-MM-DD. Null when the widget hides dates. */
  date: string | null;
};

export type BadgeAvatar = {
  initials: string;
  photo: string | null;
};

export type WidgetPayload = {
  v: typeof WIDGET_PAYLOAD_VERSION;
  type: WidgetType;
  theme: WidgetTheme;
  /** Null: the widget takes the colour of the links of the page it is pasted on. */
  accentColor: string | null;
  cardStyle: WidgetCardStyle;
  /** Validated testimonials the widget can show, all of them, not only those in this answer. */
  total: number;
  /** Null when the widget hides ratings. */
  average: number | null;
  testimonials: PublicTestimonial[];
  /** The badge shows three faces, never names nor texts. */
  avatars: BadgeAvatar[];
  /** Where the next testimonials of a wall start, for « Voir les autres avis ». */
  next: number | null;
  /** The « Propulsé par PULSACITY » link, null only when a Pro space removed it. */
  poweredBy: string | null;
};

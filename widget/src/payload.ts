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
  /** Day of reception in Paris, YYYY-MM-DD: « Avis du 12 sept. 2026 ». Null only in an answer from before lot 4.13. */
  date: string | null;
  /** Month of the purchase in Paris, YYYY-MM, when PULSACITY knows it: « achat en août 2026 ». */
  purchase?: string;
  /** A line under the author: on PULSACITY's own wall, « Bêta-testeur · plan Essentiel offert pendant la bêta ». */
  mention?: string;
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
  /**
   * Testimonials received, all of them but those hidden for a declared reason: the « 23 avis » of the rating (lot
   * 4.13). Absent from an answer of before, where the rating counted `total`.
   */
  count?: number;
  /** The average of those `count` testimonials. Null when the widget hides ratings. */
  average: number | null;
  testimonials: PublicTestimonial[];
  /** The badge shows three faces, never names nor texts. */
  avatars: BadgeAvatar[];
  /** Where the next testimonials of a wall start, for « Voir les autres avis ». */
  next: number | null;
  /** The « Propulsé par PULSACITY » link, null only when a Pro space removed it. */
  poweredBy: string | null;
  /** The space's name: « Sélection de Julie Nutrition : avis mis en avant, puis les plus récents. » */
  space?: string;
  /** The creator declared a counterpart for the reviews (Réglages), or they are PULSACITY's beta testers. */
  incentive?: boolean;
  /** « À propos de ces avis », on every plan, Pro included. */
  about?: string;
};

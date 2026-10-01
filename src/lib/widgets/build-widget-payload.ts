import { type SpacePlan, canHideBadge } from "@/config/plans";
import { getInitials } from "@/lib/spaces/get-initials";
import {
  WIDGET_PAYLOAD_VERSION,
  type BadgeAvatar,
  type PublicTestimonial,
  type WidgetPayload,
  type WidgetType,
} from "../../../widget/src/payload";
import type { ResolvedWidgetSettings } from "./widget-settings";

export const BADGE_AVATAR_COUNT = 3;

/** How many more testimonials « Voir les autres avis » brings at once. */
export const WIDGET_MORE_PAGE_SIZE = 50;

export type WidgetTestimonialSource = {
  authorName: string;
  authorTitle: string | null;
  authorPhotoUrl: string | null;
  rating: number;
  /** The displayed text: the creator's edited version, or the original. */
  text: string;
  /** Day of reception in Paris, YYYY-MM-DD. */
  receivedOn: string;
};

export type WidgetPayloadInput = {
  type: WidgetType;
  settings: ResolvedWidgetSettings;
  spaceAccentColor: string | null;
  poweredBy: string | null;
  total: number;
  averageRating: number | null;
  /** Featured first, then the most recent, already cut to this answer. */
  testimonials: WidgetTestimonialSource[];
  offset: number;
};

/** A wall shows its first testimonials, then « Voir les autres avis » brings the next ones. */
export const countTestimonialsForAnswer = (type: WidgetType, maxItems: number, offset: number): number => {
  if (type === "badge") return BADGE_AVATAR_COUNT;
  if (type === "carousel" || offset === 0) return maxItems;
  return WIDGET_MORE_PAGE_SIZE;
};

export const buildPoweredByUrl = (
  appUrl: string,
  space: SpacePlan & { referralCode: string },
  settings: Pick<ResolvedWidgetSettings, "hidePoweredBy">,
): string | null =>
  settings.hidePoweredBy && canHideBadge(space) ? null : `${appUrl}/?ref=${encodeURIComponent(space.referralCode)}`;

const toPublicTestimonial = (
  testimonial: WidgetTestimonialSource,
  settings: ResolvedWidgetSettings,
): PublicTestimonial => ({
  name: testimonial.authorName,
  initials: getInitials(testimonial.authorName),
  title: testimonial.authorTitle,
  photo: settings.showPhoto ? testimonial.authorPhotoUrl : null,
  rating: settings.showRating ? testimonial.rating : null,
  text: testimonial.text,
  date: settings.showDate ? testimonial.receivedOn : null,
});

const toBadgeAvatar = (testimonial: WidgetTestimonialSource, settings: ResolvedWidgetSettings): BadgeAvatar => ({
  initials: getInitials(testimonial.authorName),
  photo: settings.showPhoto ? testimonial.authorPhotoUrl : null,
});

export const buildWidgetPayload = (input: WidgetPayloadInput): WidgetPayload => {
  const { type, settings, total, offset } = input;
  const isBadge = type === "badge";
  const shownUntil = offset + input.testimonials.length;
  return {
    v: WIDGET_PAYLOAD_VERSION,
    type,
    theme: settings.theme,
    accentColor: settings.accentColor ?? input.spaceAccentColor,
    cardStyle: settings.cardStyle,
    total,
    average: settings.showRating && total > 0 ? input.averageRating : null,
    testimonials: isBadge ? [] : input.testimonials.map((testimonial) => toPublicTestimonial(testimonial, settings)),
    avatars: isBadge ? input.testimonials.map((testimonial) => toBadgeAvatar(testimonial, settings)) : [],
    next: type === "wall" && shownUntil < total ? shownUntil : null,
    poweredBy: input.poweredBy,
  };
};

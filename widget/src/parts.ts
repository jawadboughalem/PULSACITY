import {
  MENTION_HEIGHT,
  MENTION_LOGOTYPE,
  MENTION_ROCKET,
  MENTION_STAR,
  MENTION_SYMBOL_SCALE,
  MENTION_WIDTH,
} from "./brand-mention-paths";
import { h, svg } from "./dom";
import { ABOUT_REVIEWS, INCENTIVE_NOTE, describeDates, describeRating, describeSelection, quoteInFrench } from "./format";
import type { PublicTestimonial, WidgetPayload } from "./payload";

const STAR = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z";
const STAR_LEFT_HALF = "M12 2.5L9.1 8.6 2.5 9.4l4.9 4.6-1.3 6.6L12 17.3z";
const STAR_LEFT_EDGE = "M12 2.5L9.1 8.6 2.5 9.4l4.9 4.6-1.3 6.6L12 17.3";
const STAR_RIGHT_EDGE = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3";

const STROKE = { "stroke-width": "1.5", "stroke-linejoin": "round" };

type StarFill = "full" | "half" | "empty";

/** A half star is the empty outline with its left half filled: no clip path, so no id to share. */
const star = (fill: StarFill): SVGElement => {
  const shape =
    fill === "half"
      ? [
          svg("path", { d: STAR_LEFT_HALF, class: "full", "stroke-width": "0" }),
          svg("path", { d: STAR_LEFT_EDGE, class: "full", fill: "none", ...STROKE }),
          svg("path", { d: STAR_RIGHT_EDGE, class: "empty", ...STROKE }),
        ]
      : [svg("path", { d: STAR, class: fill, ...STROKE })];
  return svg("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" }, ...shape);
};

const fillOf = (position: number, rounded: number): StarFill => {
  if (position <= rounded) return "full";
  return position - 0.5 === rounded ? "half" : "empty";
};

/**
 * Five stars, rounded to the nearest half for an average, always with their value in words. Without a label, the stars
 * only repeat a text already read, and screen readers skip them. Charte v2, Widget: 18 on a card, 22 on a card of the
 * carousel, 20 in the summary, 16 in the badge.
 */
export const stars = (
  rating: number,
  label: string | null,
  size: "small" | "regular" | "medium" | "large" = "regular",
): HTMLElement => {
  const rounded = Math.round(rating * 2) / 2;
  const sizeClass = size === "regular" ? "stars" : `stars ${size}`;
  return h(
    "span",
    label === null ? { class: sizeClass, "aria-hidden": "true" } : { class: sizeClass, role: "img", "aria-label": label },
    ...[1, 2, 3, 4, 5].map((position) => star(fillOf(position, rounded))),
  );
};

export const avatar = (initials: string, photo: string | null): HTMLElement => {
  const circle = h("span", { class: "avatar", "aria-hidden": "true" });
  if (!photo) {
    circle.textContent = initials;
    return circle;
  }
  const image = h("img", {
    src: photo,
    alt: "",
    width: 36,
    height: 36,
    loading: "lazy",
    decoding: "async",
    referrerpolicy: "no-referrer",
  });
  image.addEventListener("error", () => image.replaceWith(initials), { once: true });
  circle.append(image);
  return circle;
};

/**
 * The author: the name, the title, « Avis du …, achat en … », and on PULSACITY's wall the beta testers' mention. The
 * avatar of 36 sits at the top of these lines (maquettes 3.6).
 */
const who = (testimonial: PublicTestimonial): HTMLElement =>
  h(
    "p",
    { class: "who" },
    h("span", { class: "name" }, testimonial.name),
    testimonial.title ? h("span", { class: "meta" }, testimonial.title) : null,
    testimonial.date
      ? h("time", { class: "dates", datetime: testimonial.date }, describeDates(testimonial.date, testimonial.purchase))
      : null,
    testimonial.mention ? h("span", { class: "dates" }, testimonial.mention) : null,
  );

/** Charte v2, Widget, « Carte »: the stars, the quote, then the author, in the wall as in the carousel (maquettes 3.6). */
const card = (testimonial: PublicTestimonial, starsSize: "regular" | "large"): HTMLElement =>
  h(
    "article",
    { class: "card" },
    testimonial.rating === null ? null : stars(testimonial.rating, describeRating(testimonial.rating), starsSize),
    h("blockquote", { class: "quote" }, quoteInFrench(testimonial.text)),
    h("div", { class: "author" }, avatar(testimonial.initials, testimonial.photo), who(testimonial)),
  );

export const wallCard = (testimonial: PublicTestimonial): HTMLElement => card(testimonial, "regular");

export const carouselCard = (testimonial: PublicTestimonial): HTMLElement => card(testimonial, "large");

/** « À propos de ces avis », a page of pulsacity.com, distinct from « Propulsé par » (positionnement.md, point 3). */
export const aboutLink = (href: string): HTMLElement =>
  h("a", { class: "about", href, target: "_blank", rel: "noopener" }, ABOUT_REVIEWS);

export const incentiveNote = (): HTMLElement => h("p", { class: "incentive" }, INCENTIVE_NOTE);

/**
 * Charte v2, Widget, ajouts (3.6): under a wall or a carousel, the selection announced, the counterpart when there is
 * one, then « À propos de ces avis », on every plan; then « Propulsé par », beside them when wide, below when narrow.
 */
export const notes = (payload: WidgetPayload): HTMLElement | null => {
  const lines = h(
    "div",
    { class: "mentions" },
    payload.space ? h("p", null, describeSelection(payload.space)) : null,
    payload.incentive ? incentiveNote() : null,
    payload.about ? aboutLink(payload.about) : null,
  );
  const powered = payload.poweredBy ? poweredBy(payload.poweredBy) : null;
  if (lines.childElementCount === 0 && !powered) return null;
  return h("div", { class: "notes" }, lines.childElementCount > 0 ? lines : null, powered);
};

let mentionCount = 0;

/** pulsacity-mention-mono.svg, its paths as is, in the secondary colour. Each copy has its own mask. */
const brandMention = (): SVGElement => {
  mentionCount += 1;
  const maskId = `pz-mention-${mentionCount}`;
  return svg(
    "svg",
    { viewBox: `0 0 ${MENTION_WIDTH} ${MENTION_HEIGHT}`, fill: "currentColor", "aria-hidden": "true", focusable: "false" },
    svg(
      "defs",
      null,
      svg(
        "mask",
        { id: maskId, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 64, height: 64 },
        svg("rect", { width: 64, height: 64, fill: "white" }),
        svg("path", { d: MENTION_STAR, fill: "black", stroke: "black", "stroke-width": 13, "stroke-linejoin": "round" }),
      ),
    ),
    svg(
      "g",
      { transform: `scale(${MENTION_SYMBOL_SCALE})` },
      svg("g", { mask: `url(#${maskId})` }, svg("path", { d: MENTION_ROCKET })),
      svg("path", { d: MENTION_STAR, stroke: "currentColor", "stroke-width": 3.5, "stroke-linejoin": "round" }),
    ),
    svg("path", { d: MENTION_LOGOTYPE }),
  );
};

/** « Propulsé par PULSACITY », with the referral link of the space: 12/16 and the drawn mention, no font loaded. */
export const poweredBy = (href: string): HTMLElement =>
  h(
    "a",
    { class: "powered", href, target: "_blank", rel: "noopener" },
    "Propulsé par",
    brandMention(),
    h("span", { class: "sr-only" }, "Pulsacity"),
  );

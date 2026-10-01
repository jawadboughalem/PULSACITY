import { h, svg } from "./dom";
import { describeRating, formatDay, quoteInFrench } from "./format";
import type { PublicTestimonial } from "./payload";

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

/** Five stars, rounded to the nearest half for an average, always with their value in words. */
export const stars = (rating: number, label: string, size: "small" | "regular" | "large" = "regular"): HTMLElement => {
  const rounded = Math.round(rating * 2) / 2;
  const sizeClass = size === "regular" ? "stars" : `stars ${size}`;
  return h(
    "span",
    { class: sizeClass, role: "img", "aria-label": label },
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
    width: 44,
    height: 44,
    loading: "lazy",
    decoding: "async",
    referrerpolicy: "no-referrer",
  });
  image.addEventListener("error", () => image.replaceWith(initials), { once: true });
  circle.append(image);
  return circle;
};

const dateElement = (isoDay: string, className: string | null = null): HTMLElement =>
  h("time", { class: className, datetime: isoDay }, formatDay(isoDay));

/** Maquette 2, wall: the author, the stars, the quote, then the date. */
export const wallCard = (testimonial: PublicTestimonial): HTMLElement =>
  h(
    "article",
    { class: "card" },
    h(
      "div",
      { class: "author" },
      avatar(testimonial.initials, testimonial.photo),
      h(
        "p",
        { class: "who" },
        h("span", { class: "name" }, testimonial.name),
        testimonial.title ? h("span", { class: "meta" }, testimonial.title) : null,
      ),
    ),
    testimonial.rating === null ? null : stars(testimonial.rating, describeRating(testimonial.rating)),
    h("blockquote", { class: "quote" }, quoteInFrench(testimonial.text)),
    testimonial.date ? h("p", { class: "date" }, dateElement(testimonial.date)) : null,
  );

/** Maquette 2, carousel: the stars, the quote, then the author with their title and the date. */
export const carouselCard = (testimonial: PublicTestimonial): HTMLElement => {
  const meta = [testimonial.title, testimonial.date ? formatDay(testimonial.date) : null].filter(Boolean).join(" · ");
  return h(
    "article",
    { class: "card" },
    testimonial.rating === null ? null : stars(testimonial.rating, describeRating(testimonial.rating), "large"),
    h("blockquote", { class: "quote" }, quoteInFrench(testimonial.text)),
    h(
      "div",
      { class: "author" },
      avatar(testimonial.initials, testimonial.photo),
      h(
        "p",
        { class: "who" },
        h("span", { class: "name" }, testimonial.name),
        meta ? h("span", { class: "meta" }, meta) : null,
      ),
    ),
  );
};

const SYMBOL_STAR =
  "M16.00 18.40 L17.94 22.33 L22.28 22.96 L19.14 26.02 L19.88 30.34 L16.00 28.30 L12.12 30.34 L12.86 26.02 L9.72 22.96 L14.06 22.33Z";
const SYMBOL_BODY = "M16 0.8C20.6 3.6 22.2 8 22.2 12.6V21H9.8V12.6C9.8 8 11.4 3.6 16 0.8Z";
const SYMBOL_FINS = "M10.6 12.8L5.6 17.4V22.4L10.6 20.2Z M21.4 12.8L26.4 17.4V22.4L21.4 20.2Z";

let symbolCount = 0;

/** pulsacity-symbole-petit-mono.svg, its paths as is. Each copy has its own mask, or two copies would share one. */
const brandSymbol = (): SVGElement => {
  symbolCount += 1;
  const maskId = `pz-symbol-${symbolCount}`;
  return svg(
    "svg",
    { viewBox: "0 0 32 32", "aria-hidden": "true", focusable: "false" },
    svg(
      "defs",
      null,
      svg(
        "mask",
        { id: maskId, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 32, height: 32 },
        svg("rect", { width: 32, height: 32, fill: "white" }),
        svg("path", { d: SYMBOL_STAR, fill: "black", stroke: "black", "stroke-width": 3, "stroke-linejoin": "round" }),
      ),
    ),
    svg(
      "g",
      { mask: `url(#${maskId})`, fill: "currentColor" },
      svg("path", { d: SYMBOL_BODY }),
      svg("path", { d: SYMBOL_FINS }),
    ),
    svg("path", {
      d: SYMBOL_STAR,
      fill: "currentColor",
      stroke: "currentColor",
      "stroke-width": 0.6,
      "stroke-linejoin": "round",
    }),
  );
};

/** « Propulsé par PULSACITY », with the referral link of the space. */
export const poweredBy = (href: string): HTMLElement =>
  h(
    "a",
    { class: "powered", href, target: "_blank", rel: "noopener" },
    "Propulsé par",
    h("span", { class: "brand" }, brandSymbol(), "Pulsacity"),
  );

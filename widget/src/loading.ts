import { h } from "./dom";
import type { WidgetType } from "./payload";

const LOADING_TEXT = "Chargement des avis…";

type SkeletonCard = { height: number; lines: Array<"full" | "short">; hasPhoto?: boolean };

/** The proportions of maquette 2, « Mur · chargement »: three columns on a wide page, two on a narrow one. */
const WALL_COLUMNS: Record<"wide" | "narrow", SkeletonCard[][]> = {
  wide: [
    [
      { height: 300, lines: ["full", "full", "short"] },
      { height: 240, lines: ["full", "short"] },
    ],
    [
      { height: 260, lines: ["full", "short"] },
      { height: 280, lines: ["full", "full", "short"] },
    ],
    [{ height: 420, lines: ["full", "short"], hasPhoto: true }],
  ],
  narrow: [
    [
      { height: 250, lines: ["full", "full", "short"] },
      { height: 200, lines: ["full", "short"] },
    ],
    [
      { height: 330, lines: ["full", "short"], hasPhoto: true },
      { height: 190, lines: ["full"] },
    ],
  ],
};

const bar = (className: string) => h("span", { class: `bar ${className}` });

/** Heights go through the CSSOM: a page whose security policy forbids style attributes still lets them through. */
const skeletonCard = ({ height, lines, hasPhoto }: SkeletonCard) => {
  const card = h(
    "div",
    { class: "sk-card" },
    h("div", { class: "sk-author" }, bar("sk-avatar"), h("div", { class: "sk-lines" }, bar("sk-name"), bar("sk-title"))),
    bar("sk-stars"),
    ...lines.map((line) => bar(line === "short" ? "sk-text short" : "sk-text")),
    hasPhoto ? bar("sk-photo") : null,
  );
  card.style.height = `${height}px`;
  return card;
};

const status = (isVisible: boolean) =>
  h("p", { class: isVisible ? "status" : "sr-only", role: "status" }, LOADING_TEXT);

const repeat = (count: number, make: () => HTMLElement) => Array.from({ length: count }, make);

/** Maquette 2, « Carrousel · chargement »: the stars and the quote on top, the author at the bottom. */
const carouselSkeletonCard = () =>
  h(
    "div",
    { class: "sk-card sk-slide" },
    h("div", { class: "sk-stars-row" }, ...repeat(5, () => bar("sk-star"))),
    bar("sk-text"),
    bar("sk-text long"),
    bar("sk-text short"),
    h("div", { class: "sk-author sk-bottom" }, bar("sk-avatar"), h("div", { class: "sk-lines" }, bar("sk-name"), bar("sk-title"))),
  );

/**
 * The arrows and the points sit where the carousel will put them, so that nothing moves when it arrives: three points
 * on a wide page, four on a phone, as in maquette 2.
 */
const carouselSkeleton = (isWide: boolean) =>
  h(
    "div",
    { class: "sk-carousel" },
    h("div", { class: "sk-track" }, h("div", { class: "sk-row" }, ...repeat(isWide ? 3 : 1, carouselSkeletonCard))),
    h("span", { class: "sk-arrow prev" }),
    h("span", { class: "sk-arrow next" }),
    h("div", { class: "sk-dots" }, ...repeat(isWide ? 3 : 4, () => h("span", { class: "sk-dot" }))),
  );

/** Maquette 2, « Badge · chargement »: the pill keeps its place next to the buy button. */
const badgeSkeleton = () =>
  h(
    "div",
    { class: "sk-badge" },
    h("span", { class: "sk-faces" }, ...repeat(3, () => bar("sk-face"))),
    bar("sk-badge-stars"),
    bar("sk-badge-text"),
  );

/** A space of fixed height while the testimonials load, so that the page does not jump when they arrive. */
export const renderLoadingState = (type: WidgetType, isWide: boolean): HTMLElement => {
  if (type === "badge") {
    return h("div", { class: "loading badge-loading", "aria-busy": "true" }, status(false), badgeSkeleton());
  }
  if (type === "carousel") {
    return h("div", { class: "loading carousel-loading", "aria-busy": "true" }, status(true), carouselSkeleton(isWide));
  }
  const columns = WALL_COLUMNS[isWide ? "wide" : "narrow"];
  return h(
    "div",
    { class: "loading", "aria-busy": "true" },
    bar("summary-bar"),
    status(true),
    h("div", { class: "sk-grid" }, ...columns.map((cards) => h("div", { class: "sk-column" }, ...cards.map(skeletonCard)))),
  );
};

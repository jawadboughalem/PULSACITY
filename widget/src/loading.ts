import { h } from "./dom";
import type { WidgetType } from "./payload";

const LOADING_TEXT = "Chargement des avis…";

type SkeletonCard = { height: number; lines: number };

/**
 * Maquettes 3.6, « Chargement des trois types »: three columns of two cards on a wide page, two columns on a narrow
 * one (one under 340 px, the same cards one under the other). The heights of the cards of the maquette.
 */
const WALL_COLUMNS: Record<"wide" | "narrow", SkeletonCard[][]> = {
  wide: [
    [
      { height: 260, lines: 3 },
      { height: 196, lines: 3 },
    ],
    [
      { height: 218, lines: 3 },
      { height: 248, lines: 3 },
    ],
    [
      { height: 298, lines: 3 },
      { height: 156, lines: 3 },
    ],
  ],
  narrow: [
    [
      { height: 238, lines: 3 },
      { height: 216, lines: 3 },
    ],
    [
      { height: 216, lines: 3 },
      { height: 238, lines: 3 },
    ],
  ],
};

const bar = (className: string) => h("span", { class: `bar ${className}` });

const repeat = <T>(count: number, make: (index: number) => T) => Array.from({ length: count }, (_, index) => make(index));

/** A card as it will come (charte v2, Widget, « Carte »): the stars, the quote, then the author at the bottom. */
const cardContent = (lines: number) => [
  bar("sk-stars"),
  ...repeat(lines, (index) => bar(index === lines - 1 ? "sk-text short" : "sk-text")),
  h("div", { class: "sk-author sk-bottom" }, bar("sk-avatar"), h("div", { class: "sk-lines" }, bar("sk-name"), bar("sk-title"))),
];

/** Heights go through the CSSOM: a page whose security policy forbids style attributes still lets them through. */
const skeletonCard = ({ height, lines }: SkeletonCard) => {
  const card = h("div", { class: "sk-card" }, ...cardContent(lines));
  card.style.height = `${height}px`;
  return card;
};

/** « Chargement des avis… »: shown for the wall and the carousel, only read aloud for the badge. */
const status = (isVisible: boolean) =>
  h("p", { class: isVisible ? "status" : "sr-only", role: "status" }, LOADING_TEXT);

const carouselSkeletonCard = () => h("div", { class: "sk-card sk-slide" }, ...cardContent(3));

/**
 * The arrows and the points sit where the carousel will put them, so that nothing moves when it arrives: two points
 * on a wide page, four on a phone.
 */
const carouselSkeleton = (isWide: boolean) =>
  h(
    "div",
    { class: "sk-carousel" },
    h("div", { class: "sk-track" }, h("div", { class: "sk-row" }, ...repeat(isWide ? 3 : 1, carouselSkeletonCard))),
    h("span", { class: "sk-arrow prev" }),
    h("span", { class: "sk-arrow next" }),
    h("div", { class: "sk-dots" }, ...repeat(isWide ? 2 : 4, () => h("span", { class: "sk-dot" }))),
  );

/** The pill keeps its place next to the buy button: three faces, the stars, the figures. */
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

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

/** A space of fixed height while the testimonials load, so that the page does not jump when they arrive. */
export const renderLoadingState = (type: WidgetType, isWide: boolean): HTMLElement => {
  if (type === "badge") {
    return h("div", { class: "loading badge-loading", "aria-busy": "true" }, status(false), bar("sk-pill"));
  }
  if (type === "carousel") {
    const cards = Array.from({ length: isWide ? 3 : 1 }, () =>
      h("div", { class: "sk-card" }, bar("sk-stars"), bar("sk-text"), bar("sk-text"), bar("sk-text short")),
    );
    return h("div", { class: "loading carousel-loading", "aria-busy": "true" }, status(true), h("div", { class: "sk-row" }, ...cards));
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

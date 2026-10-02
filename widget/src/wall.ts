import type { LayoutContext } from "./context";
import { h } from "./dom";
import { describeMore, describeSummary, summarize } from "./format";
import { poweredBy, stars, wallCard } from "./parts";
import type { PublicTestimonial, WidgetPayload } from "./payload";

const MORE_FAILED = "Les autres avis n'ont pas pu s'afficher. Réessayez.";

/**
 * Masonry without reordering: one list on a grid of 1 px rows, each card spanning its own height plus the gap.
 * The grid places each card in the shortest column, and the reading order stays the order of the list.
 */
const arrangeMasonry = (grid: HTMLElement, context: LayoutContext) => {
  const arrange = () => {
    const gap = Number.parseFloat(getComputedStyle(grid).columnGap) || 0;
    const cells = [...grid.children] as HTMLElement[];
    const heights = cells.map((cell) => (cell.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0);
    cells.forEach((cell, index) => {
      cell.style.gridRowEnd = `span ${Math.max(1, Math.ceil(heights[index] + gap))}`;
    });
  };
  if (typeof ResizeObserver !== "function") return { arrange, watch: () => undefined };

  let frame = 0;
  const observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(arrange);
  });
  context.onDestroy(() => {
    cancelAnimationFrame(frame);
    observer.disconnect();
  });
  const watch = () => {
    for (const cell of grid.children) {
      if (cell.firstElementChild) observer.observe(cell.firstElementChild);
    }
  };
  return { arrange, watch };
};

const cellsFor = (testimonials: PublicTestimonial[]) =>
  testimonials.map((testimonial) => h("li", { class: "cell" }, wallCard(testimonial)));

export const renderWall = (payload: WidgetPayload, context: LayoutContext): HTMLElement => {
  const wall = h("div", { class: "wall" });
  if (payload.average !== null) {
    wall.append(
      h(
        "p",
        { class: "summary" },
        stars(payload.average, describeSummary(payload.average, payload.total), "large"),
        h("span", { "aria-hidden": "true" }, summarize(payload.average, payload.total)),
      ),
    );
  }

  const grid = h("ul", { class: "grid" }, ...cellsFor(payload.testimonials));
  wall.append(grid);
  const masonry = arrangeMasonry(grid, context);
  context.onLayout(() => {
    masonry.arrange();
    masonry.watch();
  });

  const footer = h("div", { class: "footer" });
  let shown = payload.testimonials.length;
  let next = payload.next;
  const { loadMore } = context;
  if (next !== null && loadMore) {
    const more = h("button", { type: "button", class: "more" }, describeMore(payload.total - shown));
    const failure = h("p", { class: "more-error", role: "alert" });
    more.addEventListener("click", () => {
      if (next === null) return;
      more.disabled = true;
      more.textContent = "Chargement des avis…";
      failure.remove();
      void loadMore(next).then((page) => {
        more.disabled = false;
        if (!page) {
          more.textContent = describeMore(payload.total - shown);
          failure.textContent = MORE_FAILED;
          more.after(failure);
          return;
        }
        const cells = cellsFor(page.testimonials);
        grid.append(...cells);
        shown += page.testimonials.length;
        next = page.next;
        masonry.arrange();
        masonry.watch();
        const firstNew = cells[0]?.firstElementChild as HTMLElement | undefined;
        if (next === null) more.remove();
        else more.textContent = describeMore(payload.total - shown);
        if (firstNew) {
          firstNew.tabIndex = -1;
          firstNew.focus({ preventScroll: true });
        }
      });
    });
    footer.append(more);
  }
  if (payload.poweredBy) footer.append(poweredBy(payload.poweredBy));
  if (footer.childElementCount > 0) wall.append(footer);
  return wall;
};

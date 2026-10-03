import type { PageContext } from "./page";
import type { WidgetPayload } from "./payload";
import type { ReviewsDirectory } from "./reviews";

/** At least this wide, a widget takes the desktop sizes of the charter: three columns, three cards. */
export const WIDE_FROM = 1024;

/**
 * Narrower than this, the wall takes one column: two would leave each card too little room for a name such as
 * « Camille R. » (Design, October 2). Like WIDE_FROM, the width of the widget itself, not of the screen.
 */
export const ONE_COLUMN_BELOW = 340;

/** « wide » and « one-column » on the root, from the widget's width. Unknown before layout (0), it stays two columns. */
export const applyWidthClasses = (root: HTMLElement, width: number): void => {
  root.classList.toggle("wide", width >= WIDE_FROM);
  root.classList.toggle("one-column", width > 0 && width < ONE_COLUMN_BELOW);
};

export type LayoutContext = {
  root: HTMLElement;
  host: HTMLElement;
  page: PageContext;
  isWide: () => boolean;
  prefersReducedMotion: () => boolean;
  loadMore: ((offset: number) => Promise<WidgetPayload | null>) | null;
  reviews: ReviewsDirectory | null;
  /** Runs once the widget is in the page, then each time it changes width. */
  onLayout: (callback: () => void) => void;
  onDestroy: (callback: () => void) => void;
};

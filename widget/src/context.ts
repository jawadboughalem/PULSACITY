import type { PageContext } from "./page";
import type { WidgetPayload } from "./payload";
import type { ReviewsDirectory } from "./reviews";

/** At least this wide, a widget takes the desktop sizes of the charter: three columns, three cards. */
export const WIDE_FROM = 1024;

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

import { loadWidgetPayload } from "./load";
import { MOUNT_SELECTOR_ATTRIBUTE, TYPE_HINT_ATTRIBUTE } from "./mount-attribute";
import { readLinkColor } from "./page";
import { WIDGET_TYPES, type WidgetPayload, type WidgetType } from "./payload";
import { type RenderedWidget, clearWidget, renderLoading, renderWidget } from "./render";
import { createReviewsDirectory } from "./reviews";

export const MOUNT_SELECTOR = `[${MOUNT_SELECTOR_ATTRIBUTE}]`;

export type MountEnvironment = {
  /** Where the script comes from: https://pulsacity.com, or the address of a preview. */
  origin: string;
};

const mounted = new WeakSet<HTMLElement>();

const reviews = createReviewsDirectory();

const hasSomethingToShow = (payload: WidgetPayload) =>
  payload.total > 0 && (payload.type === "badge" ? payload.avatars.length > 0 : payload.testimonials.length > 0);

/**
 * The code copied since October 2026 names the widget's type, so its loading state holds the right place anywhere.
 * An older code does not: below the visible part of the page, the wall's loading state holds the place, out of
 * sight. In view, it could be a badge: a wall's place, then a badge's, would make the page jump under the visitor's
 * eyes, so nothing shows until the testimonials arrive.
 */
const isBelowTheFold = (host: HTMLElement) => host.getBoundingClientRect().top >= window.innerHeight;

const readTypeHint = (host: HTMLElement): WidgetType | null =>
  WIDGET_TYPES.find((type) => type === host.getAttribute(TYPE_HINT_ATTRIBUTE)?.trim()) ?? null;

const loadingTypeFor = (host: HTMLElement): WidgetType | null =>
  readTypeHint(host) ?? (isBelowTheFold(host) ? "wall" : null);

/** A widget with nothing validated to show stays invisible: an empty box never reaches a sales page. */
const mountWidget = (host: HTMLElement, widgetId: string, { origin }: MountEnvironment) => {
  mounted.add(host);
  const linkColor = readLinkColor(host);
  const shadow = host.attachShadow({ mode: "open" });
  const options = { host, linkColor };
  const loadingType = loadingTypeFor(host);
  let rendered: RenderedWidget | null = loadingType ? renderLoading(shadow, loadingType, options) : null;

  void loadWidgetPayload(origin, widgetId).then((payload) => {
    rendered?.destroy();
    if (!payload || !hasSomethingToShow(payload)) {
      clearWidget(shadow);
      return;
    }
    rendered = renderWidget(shadow, payload, {
      ...options,
      loadMore: (offset) => loadWidgetPayload(origin, widgetId, offset),
      reviews,
      logotypeUrl: `${origin}/fonts/pulsacity-logotype.woff2`,
    });
    const shownRoot = rendered.root;
    if (payload.type !== "badge") {
      reviews.register({
        host,
        type: payload.type,
        focus: () => {
          shownRoot.tabIndex = -1;
          shownRoot.focus({ preventScroll: true });
        },
      });
    }
  });
};

export const mountWidgets = (environment: MountEnvironment, root: ParentNode = document): number => {
  let count = 0;
  for (const host of root.querySelectorAll<HTMLElement>(MOUNT_SELECTOR)) {
    const widgetId = host.getAttribute(MOUNT_SELECTOR_ATTRIBUTE)?.trim();
    if (!widgetId || mounted.has(host) || host.shadowRoot) continue;
    mountWidget(host, widgetId, environment);
    count += 1;
  }
  return count;
};

import { renderBadge } from "./badge";
import { renderCarousel } from "./carousel";
import { type LayoutContext, WIDE_FROM } from "./context";
import { h } from "./dom";
import { renderLoadingState } from "./loading";
import { loadLogotype } from "./logotype";
import { readPageContext } from "./page";
import type { WidgetCardStyle, WidgetPayload, WidgetTheme, WidgetType } from "./payload";
import type { ReviewsDirectory } from "./reviews";
import { WIDGET_CSS } from "./styles";
import { buildColorVariables } from "./theme";
import { renderWall } from "./wall";

export type RenderOptions = {
  host: HTMLElement;
  /** The colour of the page's links, read before the shadow root was attached. */
  linkColor: string | null;
  loadMore?: (offset: number) => Promise<WidgetPayload | null>;
  reviews?: ReviewsDirectory;
  logotypeUrl?: string;
};

export type RenderedWidget = {
  root: HTMLElement;
  destroy: () => void;
};

type Look = {
  theme: WidgetTheme;
  cardStyle: WidgetCardStyle;
  accentColor: string | null;
};

let sharedSheet: CSSStyleSheet | null | undefined;

/** One parsed sheet for every widget of the page, adopted by each shadow root; a <style> where it is not supported. */
const adoptStyles = (shadow: ShadowRoot) => {
  if (sharedSheet === undefined) {
    try {
      sharedSheet = new CSSStyleSheet();
      sharedSheet.replaceSync(WIDGET_CSS);
    } catch {
      sharedSheet = null;
    }
  }
  if (sharedSheet && Array.isArray(shadow.adoptedStyleSheets)) {
    if (!shadow.adoptedStyleSheets.includes(sharedSheet)) {
      shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, sharedSheet];
    }
    return;
  }
  if (!shadow.querySelector("style")) shadow.prepend(h("style", null, WIDGET_CSS));
};

const renderInto = (
  shadow: ShadowRoot,
  options: RenderOptions,
  look: Look,
  build: (context: LayoutContext) => HTMLElement,
): RenderedWidget => {
  adoptStyles(shadow);
  const { host } = options;
  const page = readPageContext(host);
  const root = h("div", { class: look.cardStyle === "soft" ? "root soft" : "root" });
  for (const [name, value] of Object.entries(buildColorVariables(look.theme, look.accentColor, options.linkColor, page))) {
    root.style.setProperty(name, value);
  }
  root.classList.toggle("wide", host.offsetWidth >= WIDE_FROM);

  const layoutCallbacks: Array<() => void> = [];
  const destroyCallbacks: Array<() => void> = [];
  const reducedMotion = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  const context: LayoutContext = {
    root,
    host,
    page,
    isWide: () => root.classList.contains("wide"),
    prefersReducedMotion: () => reducedMotion?.matches ?? false,
    loadMore: options.loadMore ?? null,
    reviews: options.reviews ?? null,
    onLayout: (callback) => layoutCallbacks.push(callback),
    onDestroy: (callback) => destroyCallbacks.push(callback),
  };
  root.append(build(context));
  for (const previous of shadow.querySelectorAll(".root")) previous.remove();
  shadow.append(root);

  const layout = () => {
    for (const callback of layoutCallbacks) callback();
  };
  layout();
  if (typeof ResizeObserver === "function") {
    let width = host.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (host.offsetWidth === width) return;
      width = host.offsetWidth;
      root.classList.toggle("wide", width >= WIDE_FROM);
      layout();
    });
    observer.observe(host);
    destroyCallbacks.push(() => observer.disconnect());
  }

  return {
    root,
    destroy: () => {
      for (const callback of destroyCallbacks) callback();
      root.remove();
    },
  };
};

export const renderWidget = (shadow: ShadowRoot, payload: WidgetPayload, options: RenderOptions): RenderedWidget => {
  const rendered = renderInto(shadow, options, payload, (context) => {
    if (payload.type === "wall") return renderWall(payload, context);
    if (payload.type === "carousel") return renderCarousel(payload, context);
    return renderBadge(payload, context);
  });
  if (payload.poweredBy && options.logotypeUrl) loadLogotype(options.logotypeUrl);
  return rendered;
};

export const renderLoading = (shadow: ShadowRoot, type: WidgetType, options: RenderOptions, look?: Look): RenderedWidget =>
  renderInto(shadow, options, look ?? { theme: "auto", cardStyle: "sharp", accentColor: null }, (context) =>
    renderLoadingState(type, context.isWide()),
  );

export const clearWidget = (shadow: ShadowRoot): void => {
  for (const previous of shadow.querySelectorAll(".root")) previous.remove();
};

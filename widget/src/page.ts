import { type Rgba, luminance, parseColor } from "./colors";

export type Tone = "light" | "dark";

export type PageContext = {
  tone: Tone;
  background: Rgba;
  text: Rgba | null;
  isCentered: boolean;
};

const WHITE: Rgba = { r: 255, g: 255, b: 255, a: 1 };

/** A colour this opaque hides what is behind it: it is the background the widget sits on. */
const OPAQUE_ENOUGH = 0.5;

const parentAcrossShadows = (element: Element): Element | null => {
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return root instanceof ShadowRoot ? root.host : null;
};

const readBackground = (host: HTMLElement): Rgba => {
  for (let element: Element | null = host; element; element = parentAcrossShadows(element)) {
    const background = parseColor(getComputedStyle(element).backgroundColor);
    if (background && background.a >= OPAQUE_ENOUGH) return background;
  }
  return WHITE;
};

/** The charter's auto theme: dark when the background of the page under the widget has a luminance below 0.5. */
export const readPageContext = (host: HTMLElement): PageContext => {
  const background = readBackground(host);
  const style = getComputedStyle(host);
  return {
    tone: luminance(background) < 0.5 ? "dark" : "light",
    background,
    text: parseColor(style.color),
    isCentered: style.textAlign === "center" || style.textAlign === "-webkit-center",
  };
};

/**
 * The colour of a link at the widget's place in the page, by default the accent colour. Read on a link
 * placed inside the host before its shadow root exists: nothing is rendered, nothing moves in the page.
 */
export const readLinkColor = (host: HTMLElement): string | null => {
  if (host.shadowRoot) return null;
  const probe = document.createElement("a");
  probe.href = "#";
  host.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color || null;
};

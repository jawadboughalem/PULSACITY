/** Where a widget goes on the host page: `<div data-pulsacity-widget="…"></div>`. */
export const MOUNT_SELECTOR = "[data-pulsacity-widget]";

/**
 * Renders into every mount point not rendered yet, and returns how many it
 * rendered. Each widget lives in its own shadow root: host styles cannot reach
 * it and its styles cannot leak out, while fonts and colours are still
 * inherited from the host element.
 */
export function mountWidgets(root: ParentNode = document): number {
  let mounted = 0;
  for (const host of root.querySelectorAll<HTMLElement>(MOUNT_SELECTOR)) {
    if (host.shadowRoot) continue;
    host.attachShadow({ mode: "open" }).textContent = "PULSACITY widget OK";
    mounted += 1;
  }
  return mounted;
}

export const MOUNT_SELECTOR = "[data-pulsacity-widget]";

export function mountWidgets(root: ParentNode = document): number {
  let mounted = 0;
  for (const host of root.querySelectorAll<HTMLElement>(MOUNT_SELECTOR)) {
    if (host.shadowRoot) continue;
    host.attachShadow({ mode: "open" }).textContent = "PULSACITY widget OK";
    mounted += 1;
  }
  return mounted;
}

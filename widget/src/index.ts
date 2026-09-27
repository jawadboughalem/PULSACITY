import { mountWidgets } from "./mount";

// The embed code may load the script anywhere on the page, async or not.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => mountWidgets(), { once: true });
} else {
  mountWidgets();
}

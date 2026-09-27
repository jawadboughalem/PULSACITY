import { mountWidgets } from "./mount";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => mountWidgets(), { once: true });
} else {
  mountWidgets();
}

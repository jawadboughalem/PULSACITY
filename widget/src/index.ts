import { mountWidgets } from "./mount";

const RUNTIME_KEY = "__pulsacityWidgets";

const DEFAULT_ORIGIN = "https://pulsacity.com";

type Runtime = { scan: () => void };

type PageWindow = Window & { [RUNTIME_KEY]?: Runtime };

/** The script and the testimonials come from the same address: pulsacity.com, or a preview of it. */
const readScriptOrigin = (): string => {
  const script = document.currentScript;
  if (script instanceof HTMLScriptElement && script.src) {
    try {
      return new URL(script.src).origin;
    } catch {
      return DEFAULT_ORIGIN;
    }
  }
  return DEFAULT_ORIGIN;
};

/**
 * Each pasted code brings its own <script>: the first one starts, the others only look for new widgets.
 * Widgets added later (a builder rendering in the browser, a popup) are found as they appear.
 */
const start = (origin: string): Runtime => {
  let isScheduled = false;
  const scan = () => {
    isScheduled = false;
    mountWidgets({ origin });
  };
  const scheduleScan = () => {
    if (isScheduled) return;
    isScheduled = true;
    window.setTimeout(scan, 0);
  };

  scan();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan, { once: true });
  new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length > 0)) scheduleScan();
  }).observe(document.documentElement, { childList: true, subtree: true });
  return { scan };
};

const pageWindow = window as PageWindow;
const runtime = pageWindow[RUNTIME_KEY];
if (runtime) runtime.scan();
else pageWindow[RUNTIME_KEY] = start(readScriptOrigin());

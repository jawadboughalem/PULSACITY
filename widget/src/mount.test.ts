// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { MOUNT_SELECTOR, mountWidgets } from "./mount";

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("mountWidgets", () => {
  it("renders inside a shadow root of every mount point", () => {
    document.body.innerHTML =
      '<div data-pulsacity-widget="a"></div><p>Page</p><div data-pulsacity-widget="b"></div>';

    expect(mountWidgets()).toBe(2);

    for (const host of document.querySelectorAll(MOUNT_SELECTOR)) {
      expect(host.shadowRoot?.textContent).toBe("PULSACITY widget OK");
      // Nothing is added to the host page's own DOM.
      expect(host.childNodes).toHaveLength(0);
    }
  });

  it("renders each mount point once, however many times it runs", () => {
    document.body.innerHTML = '<div data-pulsacity-widget="a"></div>';

    expect(mountWidgets()).toBe(1);
    expect(mountWidgets()).toBe(0);
    expect(document.querySelector(MOUNT_SELECTOR)?.shadowRoot?.childNodes).toHaveLength(1);
  });

  it("leaves a page without mount point untouched", () => {
    document.body.innerHTML = "<p>Page</p>";

    expect(mountWidgets()).toBe(0);
    expect(document.body.innerHTML).toBe("<p>Page</p>");
  });
});

describe("widget entry point", () => {
  it("renders right away once the page is parsed", async () => {
    document.body.innerHTML = '<div data-pulsacity-widget="a"></div>';
    vi.resetModules();

    await import("./index");

    expect(document.querySelector(MOUNT_SELECTOR)?.shadowRoot?.textContent).toBe(
      "PULSACITY widget OK",
    );
  });

  it("waits for the page to be parsed when loaded early", async () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
    vi.resetModules();

    await import("./index");
    document.body.innerHTML = '<div data-pulsacity-widget="a"></div>';
    expect(document.querySelector(MOUNT_SELECTOR)?.shadowRoot).toBeNull();

    document.dispatchEvent(new Event("DOMContentLoaded"));
    expect(document.querySelector(MOUNT_SELECTOR)?.shadowRoot?.textContent).toBe(
      "PULSACITY widget OK",
    );
  });
});

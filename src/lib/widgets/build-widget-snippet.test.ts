// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { MOUNT_SELECTOR } from "../../../widget/src/mount";
import { buildWidgetSnippet } from "./build-widget-snippet";

describe("buildWidgetSnippet", () => {
  it("gives the element the widget mounts on, and the script that mounts it", () => {
    const snippet = buildWidgetSnippet("https://pulsacity.com", "0f8d1c2e");

    expect(snippet).toBe(
      '<div data-pulsacity-widget="0f8d1c2e"></div>\n<script src="https://pulsacity.com/w.js" async></script>',
    );
    const host = new DOMParser().parseFromString(snippet, "text/html").querySelector(MOUNT_SELECTOR);
    expect(host?.getAttribute("data-pulsacity-widget")).toBe("0f8d1c2e");
  });
});

// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { MOUNT_SELECTOR } from "../../../widget/src/mount";
import { buildWidgetSnippet } from "./build-widget-snippet";

describe("buildWidgetSnippet", () => {
  it("gives the element the widget mounts on, with its type for the loading state, and the script that mounts it", () => {
    const snippet = buildWidgetSnippet("https://pulsacity.com", { id: "0f8d1c2e", type: "badge" });

    expect(snippet).toBe(
      '<div data-pulsacity-widget="0f8d1c2e" data-pulsacity-type="badge"></div><script async src="https://pulsacity.com/w.js"></script>',
    );
    expect(snippet).not.toContain("\n");
    const host = new DOMParser().parseFromString(snippet, "text/html").querySelector(MOUNT_SELECTOR);
    expect(host?.getAttribute("data-pulsacity-widget")).toBe("0f8d1c2e");
    expect(host?.getAttribute("data-pulsacity-type")).toBe("badge");
  });
});

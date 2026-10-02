// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOUNT_SELECTOR } from "./mount";
import { SAMPLE_PAYLOAD } from "./sample-payload";

const fetchMock = vi.fn(async () => new Response(JSON.stringify(SAMPLE_PAYLOAD)));

const startScript = async () => {
  vi.resetModules();
  await import("./index");
};

beforeEach(() => {
  delete (window as Window & { __pulsacityWidgets?: unknown }).__pulsacityWidgets;
  fetchMock.mockClear();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("the w.js script", () => {
  it("mounts the widgets already on the page, and those that appear later", async () => {
    document.body.innerHTML = '<div data-pulsacity-widget="entry-a"></div>';
    await startScript();
    expect(document.querySelector(MOUNT_SELECTOR)?.shadowRoot).not.toBeNull();

    const later = document.createElement("div");
    later.setAttribute("data-pulsacity-widget", "entry-b");
    document.body.append(later);

    await vi.waitFor(() => expect(later.shadowRoot).not.toBeNull());
  });

  it("starts once when the code is pasted several times, each paste bringing its script", async () => {
    document.body.innerHTML = '<div data-pulsacity-widget="entry-c"></div><div data-pulsacity-widget="entry-d"></div>';

    await startScript();
    await startScript();
    await startScript();

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    for (const host of document.querySelectorAll(MOUNT_SELECTOR)) expect(host.shadowRoot).not.toBeNull();
  });

  it("asks pulsacity.com when it cannot tell where it was loaded from", async () => {
    document.body.innerHTML = '<div data-pulsacity-widget="entry-e"></div>';

    await startScript();

    expect(fetchMock).toHaveBeenCalledWith("https://pulsacity.com/api/widget/entry-e", expect.anything());
  });
});

// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { MOUNT_SELECTOR, mountWidgets } from "./mount";
import type { WidgetPayload } from "./payload";
import { SAMPLE_BADGE_PAYLOAD, SAMPLE_PAYLOAD } from "./sample-payload";
import { LOGOTYPE_FAMILY } from "./styles";

const ORIGIN = "https://pulsacity.com";

let widgetCount = 0;

/** Each test asks for widgets of its own: the script keeps one answer per widget for the whole page. */
const newWidgetId = () => {
  widgetCount += 1;
  return `widget-${widgetCount}`;
};

const serve = (payloads: Record<string, WidgetPayload>) => {
  const fetchMock = vi.fn(async (url: string) => {
    const widgetId = new URL(url).pathname.split("/").at(-1) ?? "";
    const payload = payloads[widgetId];
    return payload
      ? new Response(JSON.stringify(payload), { status: 200 })
      : new Response(JSON.stringify({ error: "not-found" }), { status: 404 });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

const shownRoot = (host: Element | null | undefined) => host?.shadowRoot?.querySelector(".root") ?? null;

afterEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("mountWidgets", () => {
  it("renders every widget of the page in its own shadow root, from the address of the script", async () => {
    const [wall, badge] = [newWidgetId(), newWidgetId()];
    const fetchMock = serve({ [wall]: SAMPLE_PAYLOAD, [badge]: SAMPLE_BADGE_PAYLOAD });
    document.body.innerHTML = `<div data-pulsacity-widget="${wall}"></div><p>Page</p><div data-pulsacity-widget="${badge}"></div>`;

    expect(mountWidgets({ origin: ORIGIN })).toBe(2);
    await settle();

    const [wallHost, badgeHost] = document.querySelectorAll(MOUNT_SELECTOR);
    expect(shownRoot(wallHost)?.querySelector(".wall")).not.toBeNull();
    expect(shownRoot(badgeHost)?.querySelector(".badge")).not.toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(`${ORIGIN}/api/widget/${wall}`, { mode: "cors", credentials: "omit" });
  });

  it("mounts each widget once, however many times the script runs", async () => {
    const widgetId = newWidgetId();
    const fetchMock = serve({ [widgetId]: SAMPLE_PAYLOAD });
    document.body.innerHTML = `<div data-pulsacity-widget="${widgetId}"></div>`;

    expect(mountWidgets({ origin: ORIGIN })).toBe(1);
    expect(mountWidgets({ origin: ORIGIN })).toBe(0);
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(document.querySelector(MOUNT_SELECTOR)?.shadowRoot?.querySelectorAll(".root")).toHaveLength(1);
  });

  it("asks once for a widget pasted twice on the same page", async () => {
    const widgetId = newWidgetId();
    const fetchMock = serve({ [widgetId]: SAMPLE_PAYLOAD });
    document.body.innerHTML = `<div data-pulsacity-widget="${widgetId}"></div><div data-pulsacity-widget="${widgetId}"></div>`;

    mountWidgets({ origin: ORIGIN });
    await settle();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    for (const host of document.querySelectorAll(MOUNT_SELECTOR)) expect(shownRoot(host)).not.toBeNull();
  });

  it("stays invisible for an unknown widget, or one with nothing validated to show", async () => {
    const [unknown, empty] = [newWidgetId(), newWidgetId()];
    serve({ [empty]: { ...SAMPLE_PAYLOAD, total: 0, average: null, testimonials: [], next: null } });
    document.body.innerHTML = `<div data-pulsacity-widget="${unknown}"></div><div data-pulsacity-widget="${empty}"></div>`;

    mountWidgets({ origin: ORIGIN });
    await settle();

    for (const host of document.querySelectorAll(MOUNT_SELECTOR)) expect(shownRoot(host)).toBeNull();
  });

  it("holds the place of a wall below the visible part of the page while its testimonials load", async () => {
    const widgetId = newWidgetId();
    let answer: (response: Response) => void = () => undefined;
    vi.stubGlobal("fetch", () => new Promise<Response>((resolve) => (answer = resolve)));
    document.body.innerHTML = `<div data-pulsacity-widget="${widgetId}"></div>`;
    const host = document.querySelector<HTMLElement>(MOUNT_SELECTOR);
    if (host) host.getBoundingClientRect = () => new DOMRect(0, window.innerHeight + 200, 800, 0);

    mountWidgets({ origin: ORIGIN });

    expect(shownRoot(host)?.querySelector(".loading")?.getAttribute("aria-busy")).toBe("true");
    expect(shownRoot(host)?.querySelector("[role=status]")?.textContent).toBe("Chargement des avis…");
    answer(new Response(JSON.stringify(SAMPLE_PAYLOAD)));
    await vi.waitFor(() => expect(shownRoot(host)?.querySelector(".wall")).not.toBeNull());
    expect(host?.shadowRoot?.querySelector(".loading")).toBeNull();
  });

  it("holds the place of the type named in the pasted code, even in view, until the testimonials arrive", async () => {
    const widgetId = newWidgetId();
    let answer: (response: Response) => void = () => undefined;
    vi.stubGlobal("fetch", () => new Promise<Response>((resolve) => (answer = resolve)));
    document.body.innerHTML = `<div data-pulsacity-widget="${widgetId}" data-pulsacity-type="badge"></div>`;
    const host = document.querySelector(MOUNT_SELECTOR);

    mountWidgets({ origin: ORIGIN });

    expect(shownRoot(host)?.querySelector(".badge-loading .sk-badge .sk-faces")?.childElementCount).toBe(3);
    answer(new Response(JSON.stringify(SAMPLE_BADGE_PAYLOAD)));
    await vi.waitFor(() => expect(shownRoot(host)?.querySelector(".badge")).not.toBeNull());
    expect(host?.shadowRoot?.querySelector(".loading")).toBeNull();
  });

  it("ignores a type it does not know, and shows the type the testimonials come with", async () => {
    const widgetId = newWidgetId();
    serve({ [widgetId]: { ...SAMPLE_PAYLOAD, type: "carousel", next: null } });
    document.body.innerHTML = `<div data-pulsacity-widget="${widgetId}" data-pulsacity-type="slider"></div>`;
    const host = document.querySelector(MOUNT_SELECTOR);

    mountWidgets({ origin: ORIGIN });

    expect(shownRoot(host)).toBeNull();
    await vi.waitFor(() => expect(shownRoot(host)?.querySelector(".carousel")).not.toBeNull());
  });

  it("shows nothing in view until the testimonials arrive: a badge must never take the place of a wall", async () => {
    const widgetId = newWidgetId();
    let answer: (response: Response) => void = () => undefined;
    vi.stubGlobal("fetch", () => new Promise<Response>((resolve) => (answer = resolve)));
    document.body.innerHTML = `<div data-pulsacity-widget="${widgetId}"></div>`;
    const host = document.querySelector(MOUNT_SELECTOR);

    mountWidgets({ origin: ORIGIN });

    expect(shownRoot(host)).toBeNull();
    answer(new Response(JSON.stringify(SAMPLE_BADGE_PAYLOAD)));
    await vi.waitFor(() => expect(shownRoot(host)?.querySelector(".badge")).not.toBeNull());
  });
});

describe("isolation from the page", () => {
  it("adds no style, no link and no element to the page: everything stays in the shadow root", async () => {
    const widgetId = newWidgetId();
    serve({ [widgetId]: SAMPLE_PAYLOAD });
    document.head.innerHTML = '<link rel="stylesheet" href="/site.css"><style>.card { color: red; }</style>';
    document.body.innerHTML = `<main><div class="card">Carte de la page</div><div data-pulsacity-widget="${widgetId}"></div></main>`;
    const headBefore = document.head.innerHTML;
    const bodyBefore = document.body.innerHTML;

    mountWidgets({ origin: ORIGIN });
    await settle();

    const host = document.querySelector(MOUNT_SELECTOR);
    expect(shownRoot(host)).not.toBeNull();
    expect(document.head.innerHTML).toBe(headBefore);
    expect(document.body.innerHTML).toBe(bodyBefore);
    expect(host?.childNodes).toHaveLength(0);
    expect(document.querySelectorAll(".card")).toHaveLength(1);
    expect(host?.shadowRoot?.querySelector("style")?.textContent).toContain(":host { display: block !important; }");
  });

  it("gives the page's fonts only the logotype, under a family no page uses", async () => {
    const added: Array<{ family: string }> = [];
    vi.stubGlobal(
      "FontFace",
      class {
        constructor(readonly family: string) {}
      },
    );
    Object.defineProperty(document, "fonts", { configurable: true, value: { add: (face: { family: string }) => added.push(face) } });
    const widgetId = newWidgetId();
    serve({ [widgetId]: SAMPLE_PAYLOAD });
    document.body.innerHTML = `<div data-pulsacity-widget="${widgetId}"></div>`;

    mountWidgets({ origin: ORIGIN });
    await settle();

    expect(added.map((face) => face.family)).toEqual([LOGOTYPE_FAMILY]);
  });
});

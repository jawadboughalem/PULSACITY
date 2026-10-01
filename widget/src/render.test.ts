// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import type { WidgetPayload } from "./payload";
import { type RenderOptions, renderLoading, renderWidget } from "./render";
import { createReviewsDirectory } from "./reviews";
import { SAMPLE_BADGE_PAYLOAD, SAMPLE_PAYLOAD } from "./sample-payload";

type Setup = { width?: number; background?: string; color?: string; textAlign?: string };

const createHost = ({ width = 0, background, color, textAlign }: Setup = {}) => {
  const section = document.createElement("section");
  if (background) section.style.backgroundColor = background;
  if (color) section.style.color = color;
  const host = document.createElement("div");
  if (textAlign) host.style.textAlign = textAlign;
  Object.defineProperty(host, "offsetWidth", { configurable: true, get: () => width });
  section.append(host);
  document.body.append(section);
  return host;
};

const render = (payload: WidgetPayload, setup: Setup = {}, options: Partial<RenderOptions> = {}) => {
  const host = createHost(setup);
  const shadow = host.attachShadow({ mode: "open" });
  const rendered = renderWidget(shadow, payload, { host, linkColor: null, ...options });
  return { host, shadow, root: rendered.root, rendered };
};

const texts = (elements: Iterable<Element>) => [...elements].map((element) => element.textContent);

const variable = (root: HTMLElement, name: string) => root.style.getPropertyValue(name);

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("the wall", () => {
  it("shows each card as in maquette 2: author, stars, quote in French quotes, then the date", () => {
    const { root } = render(SAMPLE_PAYLOAD);

    const cards = root.querySelectorAll(".grid > li > article.card");
    expect(cards).toHaveLength(4);
    const first = cards[0];
    expect(first.querySelector(".name")?.textContent).toBe("Camille R.");
    expect(first.querySelector(".meta")?.textContent).toBe("Enseignante");
    expect(first.querySelector(".avatar")?.textContent).toBe("CR");
    expect(first.querySelector(".stars")?.getAttribute("aria-label")).toBe("5 sur 5");
    expect(first.querySelectorAll(".stars .full")).toHaveLength(5);
    expect(first.querySelector("blockquote")?.textContent).toBe(
      "« En 30 jours j'ai arrêté de grignoter le soir. Julie explique sans culpabiliser, c'est la première fois qu'un programme tient dans ma vraie vie. »",
    );
    expect(first.querySelector("time")?.getAttribute("datetime")).toBe("2026-09-12");
    expect(first.querySelector("time")?.textContent).toBe("12 sept. 2026");
    expect(cards[3].querySelectorAll(".stars .empty")).toHaveLength(1);
  });

  it("puts the photo the customer sent in the avatar, loaded lazily", () => {
    const { root } = render(SAMPLE_PAYLOAD);

    const photo = root.querySelectorAll(".card")[2].querySelector(".avatar img");
    expect(photo?.getAttribute("src")).toBe("https://photos.exemple.fr/sophie.jpg");
    expect(photo?.getAttribute("loading")).toBe("lazy");
    expect(photo?.getAttribute("alt")).toBe("");
  });

  it("sums up the rating of every testimonial above the cards", () => {
    const { root } = render(SAMPLE_PAYLOAD);

    const summary = root.querySelector(".summary");
    expect(summary?.textContent).toBe("4,8/5 · 47 avis");
    expect(summary?.querySelector(".stars")?.getAttribute("aria-label")).toBe("Note moyenne 4,8 sur 5, 47 avis");
  });

  it("offers the other testimonials, and brings them in place", async () => {
    const loadMore = vi.fn(async (): Promise<WidgetPayload> => ({
      ...SAMPLE_PAYLOAD,
      testimonials: [{ ...SAMPLE_PAYLOAD.testimonials[0], name: "Inès V.", initials: "IV" }],
      next: null,
    }));
    const { root } = render(SAMPLE_PAYLOAD, {}, { loadMore });

    const more = root.querySelector<HTMLButtonElement>("button.more");
    expect(more?.textContent).toBe("Voir les 43 autres avis");
    more?.click();
    expect(more?.textContent).toBe("Chargement des avis…");
    await vi.waitFor(() => expect(root.querySelectorAll(".card")).toHaveLength(5));

    expect(loadMore).toHaveBeenCalledWith(4);
    expect(texts(root.querySelectorAll(".name")).at(-1)).toBe("Inès V.");
    expect(root.querySelector("button.more")).toBeNull();
  });

  it("says when the other testimonials could not come, and lets the visitor try again", async () => {
    const { root } = render(SAMPLE_PAYLOAD, {}, { loadMore: async () => null });

    root.querySelector<HTMLButtonElement>("button.more")?.click();

    await vi.waitFor(() =>
      expect(root.querySelector("[role=alert]")?.textContent).toBe("Les autres avis n'ont pas pu s'afficher. Réessayez."),
    );
    expect(root.querySelector<HTMLButtonElement>("button.more")?.disabled).toBe(false);
  });

  it("leaves out the stars and the summary when the creator hides the ratings", () => {
    const { root } = render({
      ...SAMPLE_PAYLOAD,
      average: null,
      testimonials: SAMPLE_PAYLOAD.testimonials.map((testimonial) => ({ ...testimonial, rating: null })),
    });

    expect(root.querySelector(".stars")).toBeNull();
    expect(root.querySelector(".summary")).toBeNull();
  });

  it("takes the desktop sizes from 1024 px wide", () => {
    expect(render(SAMPLE_PAYLOAD, { width: 1200 }).root.classList.contains("wide")).toBe(true);
    expect(render(SAMPLE_PAYLOAD, { width: 342 }).root.classList.contains("wide")).toBe(false);
  });

  it("writes a testimonial as text, never as markup", () => {
    const { root } = render({
      ...SAMPLE_PAYLOAD,
      testimonials: [{ ...SAMPLE_PAYLOAD.testimonials[0], name: "<b>Pirate</b>", text: '<img src=x onerror="alert(1)">' }],
    });

    expect(root.querySelector("img")).toBeNull();
    expect(root.querySelector("b")).toBeNull();
    expect(root.querySelector("blockquote")?.textContent).toBe('« <img src=x onerror="alert(1)"> »');
  });
});

describe("the carousel", () => {
  const carousel: WidgetPayload = { ...SAMPLE_PAYLOAD, type: "carousel", next: null };

  it("shows the stars, the quote, then the author with their title and the date", () => {
    const { root } = render(carousel);

    const slides = root.querySelectorAll(".slides > .slide");
    expect(slides).toHaveLength(4);
    expect(slides[0].getAttribute("aria-label")).toBe("1 sur 4");
    const card = slides[0].querySelector(".card");
    expect([...(card?.children ?? [])].map((child) => child.className)).toEqual(["stars large", "quote", "author"]);
    expect(card?.querySelector(".meta")?.textContent).toBe("Enseignante · 12 sept. 2026");
  });

  it("moves one card at a time with accessible arrows and points", () => {
    const { root } = render(carousel);
    const track = root.querySelector<HTMLElement>(".track");
    const scrollTo = vi.fn();
    if (track) track.scrollTo = scrollTo;

    const previous = root.querySelector<HTMLButtonElement>("button.prev");
    const next = root.querySelector<HTMLButtonElement>("button.next");
    expect(previous?.getAttribute("aria-label")).toBe("Avis précédent");
    expect(next?.getAttribute("aria-label")).toBe("Avis suivant");
    expect(previous?.disabled).toBe(true);
    expect(root.querySelectorAll(".dot")).toHaveLength(4);

    next?.click();

    expect(scrollTo).toHaveBeenCalled();
    expect(previous?.disabled).toBe(false);
    expect(root.querySelector("[aria-live]")?.textContent).toBe("Avis 2 sur 4");
    expect(texts(root.querySelectorAll(".dot[aria-current=true]"))).toHaveLength(1);
    expect(root.querySelectorAll(".dot")[1].getAttribute("aria-current")).toBe("true");
  });

  it("shows three cards at a time on a wide page, so four testimonials make two positions", () => {
    const { root } = render(carousel, { width: 1200 });

    expect(root.querySelectorAll(".dot")).toHaveLength(2);
    expect(root.querySelectorAll(".dot")[1].getAttribute("aria-label")).toBe("Afficher les avis 2 à 4");
  });

  it("hides the arrows when every testimonial already shows", () => {
    const { root } = render({ ...carousel, testimonials: carousel.testimonials.slice(0, 2) }, { width: 1200 });

    expect(root.querySelector(".carousel")?.classList.contains("is-still")).toBe(true);
  });
});

describe("the badge", () => {
  it("shows three faces, the stars and the average, with its value in words", () => {
    const { root } = render(SAMPLE_BADGE_PAYLOAD);

    expect(root.querySelector(".badge .sr-only")?.textContent).toBe("Note moyenne 4,8 sur 5, 47 avis");
    expect(texts(root.querySelectorAll(".faces .avatar")).slice(0, 2)).toEqual(["CR", "TL"]);
    expect(root.querySelector(".faces .avatar img")?.getAttribute("src")).toBe("https://photos.exemple.fr/sophie.jpg");
    expect(root.querySelector(".badge-text")?.textContent).toBe("4,8/5 · 47 avis");
    expect(root.querySelectorAll(".badge .stars svg")).toHaveLength(5);
    for (const shown of root.querySelectorAll(".badge > :not(.sr-only)")) {
      expect(shown.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("links to the wall of the page once there is one", () => {
    const reviews = createReviewsDirectory();
    const { root } = render(SAMPLE_BADGE_PAYLOAD, {}, { reviews });
    expect(root.querySelector("a.badge")).toBeNull();

    const wallHost = document.createElement("div");
    wallHost.scrollIntoView = vi.fn();
    document.body.append(wallHost);
    const focus = vi.fn();
    reviews.register({ host: wallHost, type: "wall", focus });
    root.querySelector<HTMLAnchorElement>("a.badge")?.click();

    expect(wallHost.scrollIntoView).toHaveBeenCalled();
    expect(focus).toHaveBeenCalled();
  });

  it("puts « Propulsé par » beside the badge on a wide screen, below it on a centred page or a phone", () => {
    const stubScreen = (isWide: boolean) =>
      vi.stubGlobal("matchMedia", (query: string) => ({
        matches: isWide && query.includes("min-width"),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

    stubScreen(true);
    expect(render(SAMPLE_BADGE_PAYLOAD).root.querySelector(".badge-wrap")?.classList.contains("stacked")).toBe(false);
    expect(render(SAMPLE_BADGE_PAYLOAD, { textAlign: "center" }).root.querySelector(".badge-wrap.stacked")).not.toBeNull();
    stubScreen(false);
    expect(render(SAMPLE_BADGE_PAYLOAD).root.querySelector(".badge-wrap.stacked")).not.toBeNull();
    vi.unstubAllGlobals();
  });
});

describe("« Propulsé par PULSACITY »", () => {
  it("links to pulsacity.com with the space's referral code, under every type", () => {
    for (const type of ["wall", "carousel", "badge"] as const) {
      const payload = type === "badge" ? SAMPLE_BADGE_PAYLOAD : { ...SAMPLE_PAYLOAD, type };
      const link = render(payload).root.querySelector<HTMLAnchorElement>("a.powered");
      expect(link?.getAttribute("href")).toBe("https://pulsacity.com/?ref=julie42");
      expect(link?.textContent).toBe("Propulsé parPulsacity");
      expect(link?.getAttribute("target")).toBe("_blank");
    }
  });

  it("disappears only when the payload removes it, as for a Pro space", () => {
    expect(render({ ...SAMPLE_PAYLOAD, poweredBy: null }).root.querySelector(".powered")).toBeNull();
  });

  it("gives each logo its own mask, so that two widgets never share one", () => {
    const first = render(SAMPLE_PAYLOAD).root.querySelector("mask")?.id;
    const second = render(SAMPLE_PAYLOAD).root.querySelector("mask")?.id;

    expect(first).toBeTruthy();
    expect(first).not.toBe(second);
  });
});

describe("the colours", () => {
  it("follows a light page with white cards, the page's text colour and the accent", () => {
    const { root } = render(SAMPLE_PAYLOAD, { background: "#F3F3F0", color: "#1F2A22" });

    expect(variable(root, "--card-bg")).toBe("#FFFFFF");
    expect(variable(root, "--card-text")).toBe("rgb(31, 42, 34)");
    expect(variable(root, "--card-accent")).toBe("rgb(79, 111, 82)");
  });

  it("turns dark on a dark page in the auto theme", () => {
    const { root } = render({ ...SAMPLE_PAYLOAD, accentColor: "#F5873B" }, { background: "#1B1E24", color: "#EDEEF0" });

    expect(variable(root, "--card-bg")).toBe("#22262D");
    expect(variable(root, "--card-text")).toBe("#EDEEF0");
    expect(variable(root, "--page-muted")).toBe("#A4A8B1");
    expect(variable(root, "--card-accent")).toBe("rgb(245, 135, 59)");
  });

  it("keeps the summary and « Propulsé par » readable on a light page when the cards are forced dark", () => {
    const { root } = render({ ...SAMPLE_PAYLOAD, theme: "dark" }, { background: "#F3F3F0", color: "#1F2A22" });

    expect(variable(root, "--card-bg")).toBe("#22262D");
    expect(variable(root, "--page-text")).toBe("rgb(31, 42, 34)");
    expect(variable(root, "--page-muted")).toBe("#5A5F6E");
  });

  it("takes the colour of the page's links when no accent is set", () => {
    const { root } = render({ ...SAMPLE_PAYLOAD, accentColor: null }, {}, { linkColor: "rgb(79, 111, 82)" });

    expect(variable(root, "--card-accent")).toBe("rgb(79, 111, 82)");
  });

  it("falls back on Encre when the accent would be unreadable on white cards", () => {
    const { root } = render({ ...SAMPLE_PAYLOAD, accentColor: "#F5F5F5" }, { background: "#FFFFFF" });

    expect(variable(root, "--card-accent")).toBe("#16213E");
  });

  it("falls back on Encre for a text colour unreadable on white cards", () => {
    const { root } = render({ ...SAMPLE_PAYLOAD, theme: "light" }, { background: "#14161A", color: "#FFFFFF" });

    expect(variable(root, "--card-text")).toBe("#16213E");
  });
});

describe("the loading state", () => {
  it("holds the place of the wall with grey blocks and a status", () => {
    const host = createHost();
    const shadow = host.attachShadow({ mode: "open" });

    const { root } = renderLoading(shadow, "wall", { host, linkColor: null });

    const loading = root.querySelector(".loading");
    expect(loading?.getAttribute("aria-busy")).toBe("true");
    expect(root.querySelector("[role=status]")?.textContent).toBe("Chargement des avis…");
    expect(root.querySelectorAll(".sk-card")).toHaveLength(4);
  });
});

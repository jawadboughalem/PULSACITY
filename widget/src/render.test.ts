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

/** The widget holds its pieces together with no-break spaces: compared here with plain ones. */
const plain = (text: string | null | undefined) => text?.replace(/\u00a0/g, " ");

const variable = (root: HTMLElement, name: string) => root.style.getPropertyValue(name);

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("the wall", () => {
  it("shows each card as in maquette 2: the author with the date of the review, the stars, the quote in French quotes", () => {
    const { root } = render(SAMPLE_PAYLOAD);

    const cards = root.querySelectorAll(".grid > li > article.card");
    expect(cards).toHaveLength(4);
    const first = cards[0];
    expect(first.querySelector(".name")?.textContent).toBe("Camille R.");
    expect(first.querySelector(".meta")?.textContent).toBe("Enseignante");
    expect(first.querySelector(".avatar")?.textContent).toBe("CR");
    expect(first.querySelector(".stars")?.getAttribute("aria-label")).toBe("5 sur 5");
    expect(first.querySelectorAll(".stars .full")).toHaveLength(5);
    expect(plain(first.querySelector("blockquote")?.textContent)).toBe(
      "« En 30 jours j'ai arrêté de grignoter le soir. Julie explique sans culpabiliser, c'est la première fois qu'un programme tient dans ma vraie vie. »",
    );
    expect(first.querySelector(".who time")?.getAttribute("datetime")).toBe("2026-09-12");
    expect(plain(first.querySelector(".who time")?.textContent)).toBe("Avis du 12 sept. 2026");
    expect(cards[3].querySelectorAll(".stars .empty")).toHaveLength(1);
  });

  it("adds the month of the purchase to the date of the review, when PULSACITY knows it", () => {
    const [first, ...others] = SAMPLE_PAYLOAD.testimonials;
    const payload = { ...SAMPLE_PAYLOAD, testimonials: [{ ...first, purchase: "2026-08" }, ...others] };

    const card = render(payload).root.querySelector(".grid > li > article.card");
    const dates = card?.querySelector(".who .dates")?.textContent ?? "";
    expect(plain(dates)).toBe("Avis du 12 sept. 2026, achat en août 2026");
    // Two unbreakable pieces: a narrow card cuts the line at the comma, never inside a date.
    expect(dates.split(", ").every((piece) => !piece.includes(" "))).toBe(true);
  });

  it("writes the first of a month « 1er »", () => {
    const [first, ...others] = SAMPLE_PAYLOAD.testimonials;
    const payload = { ...SAMPLE_PAYLOAD, testimonials: [{ ...first, date: "2026-07-01" }, ...others] };

    const card = render(payload).root.querySelector(".grid > li > article.card");
    expect(plain(card?.querySelector(".who .dates")?.textContent)).toBe("Avis du 1er juil. 2026");
  });

  it("announces its selection, the counterpart and « À propos de ces avis », apart from « Propulsé par »", () => {
    const payload: WidgetPayload = {
      ...SAMPLE_PAYLOAD,
      space: "Julie Nutrition",
      incentive: true,
      about: "https://pulsacity.com/a-propos-des-avis",
    };

    const notes = render(payload).root.querySelector(".wall > .notes");
    expect(texts(notes?.querySelectorAll(".mentions > *") ?? []).map(plain)).toEqual([
      "Sélection de Julie Nutrition : avis mis en avant, puis les plus récents.",
      "Certains clients ont reçu une contrepartie pour leur avis.",
      "À propos de ces avis",
    ]);
    expect(notes?.querySelector("a.about")?.getAttribute("href")).toBe("https://pulsacity.com/a-propos-des-avis");
    expect(notes?.querySelector(".powered")).not.toBeNull();

    const withoutBadge = render({ ...payload, incentive: false, poweredBy: null }).root.querySelector(".wall > .notes");
    expect(withoutBadge?.querySelector("a.about")).not.toBeNull();
    expect(withoutBadge?.querySelector(".powered")).toBeNull();
    expect(texts(withoutBadge?.querySelectorAll(".mentions > *") ?? [])).toHaveLength(2);
  });

  it("rates every review received when the answer says so, and shows only those validated", () => {
    const { root } = render({ ...SAMPLE_PAYLOAD, count: 23, average: 4.7 });

    expect(root.querySelector(".summary .stars")?.getAttribute("aria-label")).toBe("Note moyenne 4,7 sur 5, 23 avis");
  });

  it("adds the mention of a testimonial under its author: PULSACITY's beta testers", () => {
    const mention = "Bêta-testeur · plan Essentiel offert pendant la bêta";
    const [first, ...others] = SAMPLE_PAYLOAD.testimonials;
    const payload = { ...SAMPLE_PAYLOAD, testimonials: [{ ...first, mention }, ...others] };

    const wall = render(payload).root.querySelectorAll(".grid > li > article.card");
    expect(texts(wall[0].querySelectorAll(".who > *")).map(plain)).toEqual([
      "Camille R.",
      "Enseignante",
      "Avis du 12 sept. 2026",
      mention,
    ]);
    expect(texts(wall[1].querySelectorAll(".who > *"))).not.toContain(mention);

    const carousel = render({ ...payload, type: "carousel" }).root.querySelector("article.card");
    expect(texts(carousel?.querySelectorAll(".who > *") ?? [])).toContain(mention);
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
    expect(summary?.textContent).toBe("4,8/5\u00a0· 47\u00a0avis");
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

  it("takes one column under 340 px wide, and two from 340 px, as Design set on October 2", () => {
    const columns = (width: number) => render(SAMPLE_PAYLOAD, { width }).root.classList.contains("one-column");

    expect(columns(320)).toBe(true);
    expect(columns(339)).toBe(true);
    expect(columns(340)).toBe(false);
    expect(columns(1200)).toBe(false);
    expect(columns(0)).toBe(false);
  });

  it("follows a change of width: a phone turned sideways gets its two columns back", () => {
    let width = 320;
    const observers: Array<() => void> = [];
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: () => void) {
          observers.push(callback);
        }
        observe() {}
        disconnect() {}
      },
    );
    const host = createHost();
    Object.defineProperty(host, "offsetWidth", { configurable: true, get: () => width });
    const { root } = renderWidget(host.attachShadow({ mode: "open" }), SAMPLE_PAYLOAD, { host, linkColor: null });

    expect(root.classList.contains("one-column")).toBe(true);
    width = 640;
    for (const observer of observers) observer();
    expect(root.classList.contains("one-column")).toBe(false);
  });

  it("writes a testimonial as text, never as markup", () => {
    const { root } = render({
      ...SAMPLE_PAYLOAD,
      testimonials: [{ ...SAMPLE_PAYLOAD.testimonials[0], name: "<b>Pirate</b>", text: '<img src=x onerror="alert(1)">' }],
    });

    expect(root.querySelector("img")).toBeNull();
    expect(root.querySelector("b")).toBeNull();
    expect(plain(root.querySelector("blockquote")?.textContent)).toBe('« <img src=x onerror="alert(1)"> »');
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
    expect(card?.querySelector(".meta")?.textContent).toBe("Enseignante");
    expect(plain(card?.querySelector(".dates")?.textContent)).toBe("Avis du 12 sept. 2026");
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

  it("counts the positions in words when their points no longer fit between the arrows", () => {
    vi.spyOn(Element.prototype, "clientWidth", "get").mockReturnValue(345);
    const ten = Array.from({ length: 10 }, (_, index) => ({ ...carousel.testimonials[index % 4], name: `Client ${index}` }));
    const { root } = render({ ...carousel, testimonials: ten }, { width: 345 });
    const track = root.querySelector<HTMLElement>(".track");
    if (track) track.scrollTo = vi.fn();

    expect(root.querySelectorAll(".dot")).toHaveLength(0);
    expect(root.querySelector(".dots .count")?.textContent).toBe("1 sur 10");
    root.querySelector<HTMLButtonElement>("button.next")?.click();
    expect(root.querySelector(".dots .count")?.textContent).toBe("2 sur 10");
  });

  it("keeps showing where an arrow goes while the track scrolls there", () => {
    vi.spyOn(Element.prototype, "clientWidth", "get").mockReturnValue(345);
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
    const ten = Array.from({ length: 10 }, (_, index) => ({ ...carousel.testimonials[index % 4], name: `Client ${index}` }));
    const { root } = render({ ...carousel, testimonials: ten }, { width: 345 });
    const track = root.querySelector<HTMLElement>(".track");
    if (!track) throw new Error("No track");
    track.scrollTo = vi.fn();
    root.querySelectorAll<HTMLElement>(".slide").forEach((slide, index) => {
      Object.defineProperty(slide, "offsetLeft", { configurable: true, get: () => index * 333 });
    });
    Object.defineProperty(track, "scrollWidth", { configurable: true, get: () => 3330 });
    const scrollTo = (left: number) => {
      track.scrollLeft = left;
      track.dispatchEvent(new Event("scroll"));
    };

    root.querySelector<HTMLButtonElement>("button.next")?.click();
    scrollTo(8);
    expect(root.querySelector(".dots .count")?.textContent).toBe("2 sur 10");
    scrollTo(333);
    scrollTo(666);
    expect(root.querySelector(".dots .count")?.textContent).toBe("3 sur 10");
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
    expect(root.querySelector(".badge-text")?.textContent).toBe("4,8/5\u00a0· 47\u00a0avis");
    expect(root.querySelectorAll(".badge .stars svg")).toHaveLength(5);
    for (const shown of root.querySelectorAll(".badge > :not(.sr-only)")) {
      expect(shown.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("puts « À propos de ces avis » beside the pill, the counterpart below, and rates every review received", () => {
    const { root } = render({
      ...SAMPLE_BADGE_PAYLOAD,
      count: 52,
      incentive: true,
      about: "https://pulsacity.com/a-propos-des-avis",
    });

    expect(root.querySelector(".badge .sr-only")?.textContent).toBe("Note moyenne 4,8 sur 5, 52 avis");
    expect(root.querySelector(".badge-links a.about")?.getAttribute("href")).toBe("https://pulsacity.com/a-propos-des-avis");
    expect(root.querySelector(".badge-links .powered")).not.toBeNull();
    expect(root.querySelector(".badge-wrap > .incentive")?.textContent).toBe(
      "Certains clients ont reçu une contrepartie pour leur avis.",
    );
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

  it("holds the place of a one-column wall on a narrow page, like the wall that follows", () => {
    const host = createHost({ width: 320 });

    const { root } = renderLoading(host.attachShadow({ mode: "open" }), "wall", { host, linkColor: null });

    expect(root.classList.contains("one-column")).toBe(true);
  });

  it("holds the place of a carousel with its cards, its arrows and its points, as in maquette 2", () => {
    const wide = createHost({ width: 1200 });
    const narrow = createHost({ width: 360 });

    const wideRoot = renderLoading(wide.attachShadow({ mode: "open" }), "carousel", { host: wide, linkColor: null }).root;
    const narrowRoot = renderLoading(narrow.attachShadow({ mode: "open" }), "carousel", { host: narrow, linkColor: null }).root;

    expect(wideRoot.querySelector("[role=status]")?.textContent).toBe("Chargement des avis…");
    expect(wideRoot.querySelectorAll(".sk-slide")).toHaveLength(3);
    expect(narrowRoot.querySelectorAll(".sk-slide")).toHaveLength(1);
    expect(wideRoot.querySelectorAll(".sk-arrow")).toHaveLength(2);
    expect(wideRoot.querySelectorAll(".sk-dot")).toHaveLength(3);
    expect(narrowRoot.querySelectorAll(".sk-arrow")).toHaveLength(2);
    expect(narrowRoot.querySelectorAll(".sk-dot")).toHaveLength(4);
  });

  it("holds the place of a badge with a pill of three faces, its status only read aloud", () => {
    const host = createHost();

    const { root } = renderLoading(host.attachShadow({ mode: "open" }), "badge", { host, linkColor: null });

    expect(root.querySelectorAll(".sk-badge .sk-face")).toHaveLength(3);
    expect(root.querySelector("[role=status]")?.className).toBe("sr-only");
  });
});

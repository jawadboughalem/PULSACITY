import type { LayoutContext } from "./context";
import { h, svg } from "./dom";
import { carouselCard, poweredBy } from "./parts";
import type { WidgetPayload } from "./payload";

const CHEVRON_LEFT = "M15 6l-6 6 6 6";
const CHEVRON_RIGHT = "M9 6l6 6-6 6";

const arrowButton = (className: string, label: string, chevron: string) =>
  h(
    "button",
    { type: "button", class: `arrow ${className}`, "aria-label": label },
    svg("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" }, svg("path", { d: chevron })),
  );

const lastShown = (first: number, visible: number, total: number) => Math.min(total, first + visible - 1);

const describeView = (first: number, visible: number, total: number) =>
  visible === 1 ? `Avis ${first} sur ${total}` : `Avis ${first} à ${lastShown(first, visible, total)} sur ${total}`;

const describeDot = (first: number, visible: number, total: number) =>
  visible === 1 ? `Afficher l'avis ${first}` : `Afficher les avis ${first} à ${lastShown(first, visible, total)}`;

/** « 2 sur 10 », in place of the points when they no longer fit. */
const describeCount = (first: number, visible: number, total: number) =>
  visible === 1 ? `${first} sur ${total}` : `${first} à ${lastShown(first, visible, total)} sur ${total}`;

/** The charter gives each point a 44 × 44 zone, and the arrows 48 with 8 between them and the points. */
const DOT_ZONE = 44;
const ARROW_ZONE = 48 + 8;

/** Maquette 2: three cards from 1024 px, one below. Swiped by finger, moved one card at a time by the arrows. */
export const renderCarousel = (payload: WidgetPayload, context: LayoutContext): HTMLElement => {
  const total = payload.testimonials.length;
  const slides = payload.testimonials.map((testimonial, index) =>
    h(
      "div",
      { class: "slide", role: "group", "aria-roledescription": "avis", "aria-label": `${index + 1} sur ${total}` },
      carouselCard(testimonial),
    ),
  );
  const track = h(
    "div",
    { class: "track", role: "region", "aria-roledescription": "carrousel", "aria-label": "Avis clients", tabindex: 0 },
    h("div", { class: "slides" }, ...slides),
  );
  const previous = arrowButton("prev", "Avis précédent", CHEVRON_LEFT);
  const next = arrowButton("next", "Avis suivant", CHEVRON_RIGHT);
  const dots = h("div", { class: "dots" });
  const announcer = h("p", { class: "sr-only", "aria-live": "polite" });
  const footer = h("div", { class: "carousel-footer" }, dots, payload.poweredBy ? poweredBy(payload.poweredBy) : null);
  const carousel = h("div", { class: "carousel" }, track, previous, next, footer, announcer);

  let position = 0;
  const visibleCount = () => (context.isWide() ? 3 : 1);
  const positionCount = () => Math.max(1, total - visibleCount() + 1);
  const step = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : (slides[0]?.offsetWidth ?? 0));

  /** Wide, the points share their row with « Propulsé par »; narrow, they sit between the arrows. */
  const dotsFit = (count: number) => {
    const room = context.isWide() ? track.clientWidth / 2 : carousel.clientWidth - 2 * ARROW_ZONE;
    return room <= 0 || count * DOT_ZONE <= room;
  };

  const show = () => {
    const count = positionCount();
    carousel.classList.toggle("is-still", count <= 1);
    previous.disabled = position <= 0;
    next.disabled = position >= count - 1;
    if (!dotsFit(count)) {
      const counter = dots.querySelector(".count") ?? h("p", { class: "count", "aria-hidden": "true" });
      counter.textContent = describeCount(position + 1, visibleCount(), total);
      if (dots.firstChild !== counter || dots.childElementCount !== 1) dots.replaceChildren(counter);
      return;
    }
    if (dots.querySelector(".count") || dots.childElementCount !== count) {
      dots.replaceChildren(
        ...Array.from({ length: count }, (_, index) => {
          const dot = h("button", {
            type: "button",
            class: "dot",
            "aria-label": describeDot(index + 1, visibleCount(), total),
          });
          dot.addEventListener("click", () => goTo(index));
          return dot;
        }),
      );
    }
    [...dots.children].forEach((dot, index) => dot.setAttribute("aria-current", String(index === position)));
  };

  /** Where an arrow or a point is taking the track: the points show it until the track gets there. */
  let destination: number | null = null;

  const goTo = (target: number) => {
    position = Math.min(Math.max(target, 0), positionCount() - 1);
    destination = position;
    track.scrollTo({ left: position * step(), behavior: context.prefersReducedMotion() ? "auto" : "smooth" });
    announcer.textContent = describeView(position + 1, visibleCount(), total);
    show();
  };

  const isAt = (target: number, distance: number) =>
    Math.abs(track.scrollLeft - Math.min(target * distance, track.scrollWidth - track.clientWidth)) <= 2;
  const letGo = () => {
    destination = null;
  };

  previous.addEventListener("click", () => goTo(position - 1));
  next.addEventListener("click", () => goTo(position + 1));
  track.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    goTo(position + (event.key === "ArrowLeft" ? -1 : 1));
  });

  let frame = 0;
  track.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distance = step();
        if (distance <= 0) return;
        if (destination !== null) {
          if (!isAt(destination, distance)) return;
          letGo();
        }
        position = Math.min(Math.round(track.scrollLeft / distance), positionCount() - 1);
        show();
      });
    },
    { passive: true },
  );
  // A finger or a wheel takes the track back, and so does the end of any scroll.
  for (const type of ["pointerdown", "touchstart", "wheel", "scrollend"]) {
    track.addEventListener(type, letGo, { passive: true });
  }
  context.onDestroy(() => cancelAnimationFrame(frame));
  context.onLayout(() => {
    position = Math.min(position, positionCount() - 1);
    track.scrollLeft = position * step();
    show();
  });
  show();
  return carousel;
};

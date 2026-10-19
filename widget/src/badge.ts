import { WIDE_FROM, type LayoutContext } from "./context";
import { h } from "./dom";
import { describeSummary, summarize } from "./format";
import { aboutLink, avatar, incentiveNote, poweredBy, stars } from "./parts";
import type { WidgetPayload } from "./payload";

/**
 * Maquette 2: next to the buy button, three faces, the stars and « 4,8/5 · 47 avis », every review received but those
 * refused for a declared reason. It links to the wall of the page when there is one; « À propos de ces avis » and
 * « Propulsé par » go beside it, or below it when the page is centred or narrow.
 */
export const renderBadge = (payload: WidgetPayload, context: LayoutContext): HTMLElement => {
  // Read « Note moyenne 4,8 sur 5, 47 avis » rather than the figures shown, which only repeat it.
  const content = () => [
    h("span", { class: "sr-only" }, describeSummary(payload.average, payload.count ?? payload.total)),
    h(
      "span",
      { class: "faces", "aria-hidden": "true" },
      ...payload.avatars.map((face) => avatar(face.initials, face.photo)),
    ),
    payload.average === null ? null : stars(payload.average, null, "small"),
    h("span", { class: "badge-text", "aria-hidden": "true" }, summarize(payload.average, payload.count ?? payload.total)),
  ];

  const buildBadge = (): HTMLElement => {
    const target = context.reviews?.find() ?? null;
    if (!target) return h("div", { class: "badge" }, ...content());
    const link = h("a", { class: "badge", href: "#" }, ...content());
    link.addEventListener("click", (event) => {
      event.preventDefault();
      target.host.scrollIntoView({ behavior: context.prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      target.focus();
    });
    return link;
  };

  let badge = buildBadge();
  // Charte v2, Widget, ajouts: « À propos de ces avis » and « Propulsé par » beside the pill, the counterpart below.
  const links =
    payload.about || payload.poweredBy
      ? h(
          "span",
          { class: "badge-links" },
          payload.about ? aboutLink(payload.about) : null,
          payload.poweredBy ? poweredBy(payload.poweredBy) : null,
        )
      : null;
  const wrap = h("div", { class: "badge-wrap" }, badge, links, payload.incentive ? incentiveNote() : null);

  const media = typeof matchMedia === "function" ? matchMedia(`(min-width: ${WIDE_FROM}px)`) : null;
  const place = () => wrap.classList.toggle("stacked", context.page.isCentered || !media?.matches);
  place();
  media?.addEventListener("change", place);
  context.onDestroy(() => media?.removeEventListener("change", place));

  const unsubscribe = context.reviews?.subscribe(() => {
    const rebuilt = buildBadge();
    badge.replaceWith(rebuilt);
    badge = rebuilt;
  });
  if (unsubscribe) context.onDestroy(unsubscribe);
  return wrap;
};

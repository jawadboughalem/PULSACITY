import { WIDE_FROM, type LayoutContext } from "./context";
import { h } from "./dom";
import { describeSummary, summarize } from "./format";
import { avatar, poweredBy, stars } from "./parts";
import type { WidgetPayload } from "./payload";

/**
 * Maquette 2: next to the buy button, three faces, the stars and « 4,8/5 · 47 avis ». It links to the wall of the
 * page when there is one, and « Propulsé par » goes beside it, or below it when the page is centred or narrow.
 */
export const renderBadge = (payload: WidgetPayload, context: LayoutContext): HTMLElement => {
  const label = describeSummary(payload.average, payload.total);
  const content = () => [
    h("span", { class: "faces" }, ...payload.avatars.map((face) => avatar(face.initials, face.photo))),
    payload.average === null ? null : stars(payload.average, label, "small"),
    h("span", { class: "badge-text" }, summarize(payload.average, payload.total)),
  ];

  const buildBadge = (): HTMLElement => {
    const target = context.reviews?.find() ?? null;
    if (!target) return h("div", { class: "badge", role: "img", "aria-label": label }, ...content());
    const link = h("a", { class: "badge", href: "#", "aria-label": label }, ...content());
    link.addEventListener("click", (event) => {
      event.preventDefault();
      target.host.scrollIntoView({ behavior: context.prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      target.focus();
    });
    return link;
  };

  let badge = buildBadge();
  const wrap = h("div", { class: "badge-wrap" }, badge, payload.poweredBy ? poweredBy(payload.poweredBy) : null);

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

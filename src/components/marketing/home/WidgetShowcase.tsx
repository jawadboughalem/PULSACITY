"use client";

import { useEffect, useRef } from "react";
import { readLinkColor } from "../../../../widget/src/page";
import type { PublicTestimonial, WidgetPayload } from "../../../../widget/src/payload";
import { renderWidget } from "../../../../widget/src/render";

const LOGOTYPE_URL = "/fonts/pulsacity-logotype.woff2";

/** The green of Julie Nutrition, the example page of maquettes 2, 6 and 7. */
const JULIE_ACCENT = "#4F6F52";

/** Maquette 7: the order of the carousel, then Sophie D., fourth on a phone. */
const TESTIMONIALS: PublicTestimonial[] = [
  {
    name: "Camille R.",
    initials: "CR",
    title: "Enseignante",
    photo: null,
    rating: 5,
    text: "En 30 jours j'ai arrêté de grignoter le soir. Julie explique sans culpabiliser, c'est la première fois qu'un programme tient dans ma vraie vie.",
    date: "2026-09-12",
  },
  {
    name: "Thomas L.",
    initials: "TL",
    title: "Développeur",
    photo: null,
    rating: 5,
    text: "Les recettes sont rapides et le groupe motive vraiment. J'ai perdu 4 kg sans me priver.",
    date: "2026-09-03",
  },
  {
    name: "Nadia B.",
    initials: "NB",
    title: "Infirmière de nuit",
    photo: null,
    rating: 4,
    text: "Enfin des conseils adaptés aux horaires décalés. J'aurais aimé plus de recettes végétariennes.",
    date: "2026-09-26",
  },
  {
    name: "Sophie D.",
    initials: "SD",
    title: "Maman de 3 enfants",
    photo: null,
    rating: 5,
    text: "Toute la famille mange mieux. Les menus de la semaine m'ont sauvé la vie.",
    date: "2026-09-27",
  },
];

const BASE_PAYLOAD: Omit<WidgetPayload, "type" | "testimonials" | "avatars"> = {
  v: 1,
  theme: "light",
  accentColor: JULIE_ACCENT,
  cardStyle: "sharp",
  total: 47,
  average: 4.8,
  next: null,
  // On our own page, « Propulsé par » leads home.
  poweredBy: "/",
};

const CAROUSEL: WidgetPayload = { ...BASE_PAYLOAD, type: "carousel", testimonials: TESTIMONIALS, avatars: [] };

const BADGE: WidgetPayload = {
  ...BASE_PAYLOAD,
  type: "badge",
  testimonials: [],
  avatars: TESTIMONIALS.slice(0, 2)
    .concat(TESTIMONIALS[3])
    .map(({ initials }) => ({ initials, photo: null })),
};

/** The renderer of w.js in its own shadow root, as on a creator's page. */
const LiveWidget = ({ payload }: { payload: WidgetPayload }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const linkColor = readLinkColor(host);
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    const rendered = renderWidget(shadow, payload, { host, linkColor, logotypeUrl: LOGOTYPE_URL });
    return () => rendered.destroy();
  }, [payload]);

  return <div ref={hostRef} />;
};

/**
 * Maquette 7, « Chez vous, avec vos couleurs »: the sales page of Julie Nutrition, with her font and her green, and the
 * real widget on it: the badge near the top, then the carousel. On a phone, the page keeps narrow margins so that the
 * widget has the width of a real page of 360 px: the whole badge, and the points under the carousel.
 */
export const WidgetShowcase = () => (
  <figure className="border border-hairline-200 bg-white font-[Georgia,'Times_New_Roman',serif] text-ink-900">
    <figcaption className="sr-only font-sans text-legal text-slate-600 desktop:not-sr-only desktop:flex desktop:h-[40px] desktop:items-center desktop:gap-4 desktop:border-b desktop:border-hairline-200 desktop:px-4">
      <span aria-hidden="true" className="hidden gap-2 desktop:flex">
        <span className="size-[8px] rounded-full bg-hairline-200" />
        <span className="size-[8px] rounded-full bg-hairline-200" />
        <span className="size-[8px] rounded-full bg-hairline-200" />
      </span>
      Page de vente de Julie Nutrition · exemple
    </figcaption>
    <div className="min-h-[104px] px-1 py-4 desktop:min-h-[56px] desktop:px-9 desktop:py-2">
      <LiveWidget payload={BADGE} />
    </div>
    <div className="bg-paper-100 px-2 py-7 desktop:px-9 desktop:py-9">
      <p className="mb-5 px-4 text-[28px] leading-[34px] font-semibold desktop:mb-6 desktop:px-[0] desktop:text-[36px] desktop:leading-[44px]">
        Ils ont suivi le programme
      </p>
      <div className="min-h-[440px] desktop:min-h-[360px]">
        <LiveWidget payload={CAROUSEL} />
      </div>
    </div>
    <div className="h-[32px]" />
  </figure>
);

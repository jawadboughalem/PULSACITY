"use client";

import { useEffect, useRef, useState } from "react";
import { EXAMPLE_AVERAGE, EXAMPLE_COUNT, EXAMPLE_REVIEWS } from "@/content/home-examples";
import { cn } from "@/lib/cn";
import { readLinkColor } from "../../../../widget/src/page";
import type { PublicTestimonial, WidgetPayload, WidgetType } from "../../../../widget/src/payload";
import { renderWidget } from "../../../../widget/src/render";
import { ChoiceButtons } from "../ChoiceButtons";
import { ExampleMention } from "../ExampleMention";
import { JULIE_ACCENT, JULIE_PAGE_BACKGROUNDS, JULIE_PAGE_FONT_CLASSES } from "./julie-page";

/** On a dark card, Julie's green stands out too little: the stars take Soleil (maquettes 3.5, widget sombre). */
const DARK_ACCENT = "#FFBE3B";

type Look = "light" | "dark";

const TESTIMONIALS: PublicTestimonial[] = EXAMPLE_REVIEWS.map((review) => ({
  name: review.name,
  initials: review.name.charAt(0),
  title: review.offer,
  photo: null,
  rating: review.rating,
  text: review.text,
  date: review.date,
}));

const buildPayload = (type: WidgetType, look: Look): WidgetPayload => ({
  v: 1,
  type,
  theme: look,
  accentColor: look === "dark" ? DARK_ACCENT : JULIE_ACCENT,
  cardStyle: "soft",
  total: EXAMPLE_COUNT,
  count: EXAMPLE_COUNT,
  average: EXAMPLE_AVERAGE,
  testimonials: type === "badge" ? [] : TESTIMONIALS,
  avatars: TESTIMONIALS.map(({ initials }) => ({ initials, photo: null })),
  next: null,
  // On our own page, « Propulsé par » leads home.
  poweredBy: "/",
});

/** The renderer of w.js in its own shadow root, as on a creator's page. */
const LiveWidget = ({ payload }: { payload: WidgetPayload }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const linkColor = readLinkColor(host);
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    const rendered = renderWidget(shadow, payload, { host, linkColor });
    return () => rendered.destroy();
  }, [payload]);

  return <div ref={hostRef} />;
};

const TYPE_OPTIONS = [
  { value: "wall", label: "Mur" },
  { value: "carousel", label: "Carrousel" },
  { value: "badge", label: "Badge" },
] as const;

const LOOK_OPTIONS = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" },
] as const;

/**
 * Room kept for the widget, so that switching its type moves nothing below (recette of lot 4.7): on a computer, one
 * height for the three, the tallest; on a phone, the height of each, a wall's height left under a badge being most of
 * a screen. The widget turns wide (three columns, three cards) when it reaches 1024 px itself, on a screen of 1316 px:
 * below, the two-column wall is the tallest; above, the wall and the carousel are alike. Measured from 320 to 1920 px
 * with the widget of lot 4.8, plus a margin.
 */
const RESERVED_HEIGHTS: Record<WidgetType, string> = {
  wall: "min-h-[732px] desktop:min-h-[460px] min-[1316px]:min-h-[320px]",
  carousel: "min-h-[352px] desktop:min-h-[460px] min-[1316px]:min-h-[320px]",
  badge: "min-h-[96px] desktop:min-h-[460px] min-[1316px]:min-h-[320px]",
};

/**
 * Maquettes 3.5, Accueil, section 5: the sales page of Julie Nutrition, with her font and her green, and the real
 * widget on it, which the visitor switches between wall, carousel and badge, light and dark. The page itself goes dark
 * with the widget. The reviews are those of positionnement.md, marked as examples.
 */
export const WidgetShowcase = () => {
  const [type, setType] = useState<WidgetType>("wall");
  const [look, setLook] = useState<Look>("light");
  const [payload, setPayload] = useState(() => buildPayload("wall", "light"));

  const show = (nextType: WidgetType, nextLook: Look) => {
    setType(nextType);
    setLook(nextLook);
    setPayload(buildPayload(nextType, nextLook));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 desktop:flex-row desktop:gap-4">
        <ChoiceButtons
          label="Type de widget"
          options={TYPE_OPTIONS}
          value={type}
          onChoose={(value) => show(value, look)}
          announcement={(value) => `${TYPE_OPTIONS.find((option) => option.value === value)?.label} affiché.`}
        />
        <ChoiceButtons
          label="Thème du widget"
          options={LOOK_OPTIONS}
          value={look}
          onChoose={(value) => show(type, value)}
          announcement={(value) => `Thème ${value === "dark" ? "sombre" : "clair"} affiché.`}
        />
      </div>
      <figure className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-panel border-2 border-gray-light">
          <p aria-hidden="true" className="hidden h-[40px] items-center gap-4 bg-white px-4 text-legal text-gray desktop:flex">
            <span className="flex gap-2">
              <span className="size-[8px] rounded-full bg-gray-light" />
              <span className="size-[8px] rounded-full bg-gray-light" />
              <span className="size-[8px] rounded-full bg-gray-light" />
            </span>
            Page de vente de Julie Nutrition · exemple
          </p>
          <div
            style={{ backgroundColor: JULIE_PAGE_BACKGROUNDS[look] }}
            className={cn("px-4 py-6 desktop:px-12 desktop:py-10", look === "dark" ? "text-white" : "text-ink")}
          >
            {/* Not through cn: tailwind-merge would read the font family as a weight, and drop it for font-bold. */}
            <p
              className={`${JULIE_PAGE_FONT_CLASSES} mb-5 text-[24px] leading-[30px] font-bold desktop:mb-6 desktop:text-[36px] desktop:leading-[44px]`}
            >
              Ils ont suivi le programme
            </p>
            <div className={RESERVED_HEIGHTS[type]}>
              <LiveWidget payload={payload} />
            </div>
          </div>
        </div>
        <figcaption>
          <span className="sr-only">Page de vente de Julie Nutrition, avec un widget PULSACITY. </span>
          <ExampleMention />
        </figcaption>
      </figure>
    </div>
  );
};

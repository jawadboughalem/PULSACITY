"use client";

import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { readLinkColor } from "../../../widget/src/page";
import type { WidgetPayload } from "../../../widget/src/payload";
import { type RenderedWidget, renderWidget } from "../../../widget/src/render";

/**
 * On a computer, a sales page 1280 px wide reduced to the frame. On a phone, the page at the phone's own size, but
 * never under the 390 px of maquette 2 on mobile: narrower, the wall's two columns break short names such as
 * « Camille R. » before their initial.
 */
const DESKTOP_PAGE_WIDTH = 1280;
const PHONE_PAGE_MIN_WIDTH = 390;

const PHONE_FRAME_BELOW = 600;

const LOGOTYPE_URL = "/fonts/pulsacity-logotype.woff2";

const INK = "#16213E";

type WidgetHostProps = {
  payload: WidgetPayload;
  loadMore: (offset: number) => Promise<WidgetPayload | null>;
};

/** The very renderer of w.js, in its own shadow root, redrawn on each change of the settings. */
const WidgetHost = ({ payload, loadMore }: WidgetHostProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const linkColor = useRef<string | null>(null);
  const rendered = useRef<RenderedWidget | null>(null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (!host.shadowRoot) linkColor.current = readLinkColor(host);
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    rendered.current?.destroy();
    rendered.current = renderWidget(shadow, payload, {
      host,
      linkColor: linkColor.current,
      loadMore,
      logotypeUrl: LOGOTYPE_URL,
    });
  }, [payload, loadMore]);

  useEffect(
    () => () => {
      rendered.current?.destroy();
      rendered.current = null;
    },
    [],
  );

  return <div ref={hostRef} />;
};

type WidgetPreviewProps = {
  payload: WidgetPayload;
  isEmpty: boolean;
  spaceName: string;
  pageTitle: string;
  pageAccent: string | null;
  loadMore: (offset: number) => Promise<WidgetPayload | null>;
};

const FakeSection = ({ isPhone, children }: { isPhone: boolean; children: ReactNode }) => (
  <section className={cn("bg-paper-100", isPhone ? "px-5 py-7" : "px-[80px] py-8")}>
    <h2
      className={cn("font-semibold text-ink-900", isPhone ? "mb-5 text-[28px] leading-[34px]" : "mb-6 text-[36px] leading-[44px]")}
    >
      Ce qu&apos;en disent mes clients
    </h2>
    {children}
  </section>
);

/** Maquette 6: « Aperçu en direct », the creator's sales page reduced, with the widget where it would sit. */
export const WidgetPreview = ({ payload, isEmpty, spaceName, pageTitle, pageAccent, loadMore }: WidgetPreviewProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ frameWidth: 0, pageHeight: 0 });

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const page = pageRef.current;
    if (!frame || !page) return;
    const measure = () => setSize({ frameWidth: frame.clientWidth, pageHeight: page.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(page);
    return () => observer.disconnect();
  }, []);

  const isPhone = size.frameWidth > 0 && size.frameWidth < PHONE_FRAME_BELOW;
  const pageWidth = isPhone ? Math.max(size.frameWidth, PHONE_PAGE_MIN_WIDTH) : DESKTOP_PAGE_WIDTH;
  const scale = size.frameWidth > 0 ? size.frameWidth / pageWidth : 0;
  // Maquette 6 on a phone goes straight to the testimonials; a badge stays next to its buy button.
  const showsHero = !isPhone || payload.type === "badge";
  const brandColor = pageAccent ?? INK;
  const widget = isEmpty ? null : <WidgetHost payload={payload} loadMore={loadMore} />;

  return (
    <div
      ref={frameRef}
      aria-hidden={isEmpty || undefined}
      className="overflow-hidden border border-hairline-200 bg-white desktop:h-[861px] desktop:overflow-y-auto"
    >
      <div style={{ height: size.pageHeight * scale }} className="overflow-hidden">
        <div
          ref={pageRef}
          style={{ width: pageWidth, transform: `scale(${scale})`, transformOrigin: "0 0" }}
          className="bg-white font-[Georgia,'Times_New_Roman',serif] text-ink-900"
        >
          <header
            className={cn(
              "flex items-center justify-between border-b border-hairline-200",
              isPhone ? "h-[64px] px-5" : "h-[80px] px-[80px]",
            )}
          >
            <span className={cn("font-semibold", isPhone ? "text-[18px]" : "text-[20px]")} style={{ color: brandColor }}>
              {spaceName}
            </span>
            {isPhone ? null : (
              <span className="flex gap-6 text-[15px] text-slate-600">
                <span>Accueil</span>
                <span>Offres</span>
                <span>Contact</span>
              </span>
            )}
          </header>
          <div className={cn(isPhone ? "px-5 py-7" : "px-[80px] py-8", !showsHero && "hidden")}>
            <p
              className={cn("max-w-[900px] font-semibold", isPhone ? "text-[32px] leading-[38px]" : "text-[52px] leading-[64px]")}
            >
              {pageTitle}
            </p>
            <p
              className={cn(
                "mt-5 max-w-[760px] text-slate-600",
                isPhone ? "text-[17px] leading-[26px]" : "text-[18px] leading-[28px]",
              )}
            >
              Le texte de votre page de vente.
            </p>
            <span
              className={cn(
                "mt-6 inline-flex items-center justify-center rounded-sm px-6 font-semibold text-white",
                isPhone ? "h-[52px] w-full text-[17px]" : "h-[52px] text-[16px]",
              )}
              style={{ backgroundColor: brandColor }}
            >
              Je m&apos;inscris
            </span>
            {payload.type === "badge" ? <div className="mt-6">{widget}</div> : null}
          </div>
          {payload.type === "badge" ? null : <FakeSection isPhone={isPhone}>{widget}</FakeSection>}
        </div>
      </div>
    </div>
  );
};

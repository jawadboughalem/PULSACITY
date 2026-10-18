import Script from "next/script";
import { MOUNT_SELECTOR_ATTRIBUTE, TYPE_HINT_ATTRIBUTE } from "../../../widget/src/mount-attribute";
import type { WidgetType } from "../../../widget/src/payload";
import { MarketingSection, SectionTitle } from "./MarketingSection";

/** The code a creator pastes, on our own pages: w.js reads its testimonials from the same address. */
const PulsacityWidget = ({ widgetId, type }: { widgetId: string; type: WidgetType }) => (
  <>
    <div {...{ [MOUNT_SELECTOR_ATTRIBUTE]: widgetId, [TYPE_HINT_ATTRIBUTE]: type }} />
    <Script src="/w.js" strategy="afterInteractive" />
  </>
);

/**
 * Said where the testimonials show (decisions/positionnement.md, points 5 and 7): the selection, and the counterpart
 * of the beta testers (Essentiel offered). To leave to the widget once it says them itself (lots 4.8 and 4.13).
 */
const COUNTERPART_NOTE = "Certains clients ont reçu une contrepartie pour leur avis.";

/** Maquette 3.6, « Le mur de PULSACITY »: on the home page, the testimonials of the first creators, all real. */
export const PulsacityWall = ({ widgetId }: { widgetId: string }) => (
  <MarketingSection labelledBy="first-creators">
    <SectionTitle id="first-creators">Les avis des premiers créateurs</SectionTitle>
    <div className="mt-8 desktop:mt-10">
      <PulsacityWidget widgetId={widgetId} type="wall" />
    </div>
    <p className="mt-6 text-small text-gray">
      Sélection de PULSACITY : avis mis en avant, puis les plus récents.
      <br />
      {COUNTERPART_NOTE}
    </p>
  </MarketingSection>
);

/** Maquette 3.6, « Le badge de PULSACITY sur Tarifs ». */
export const PulsacityBadge = ({ widgetId }: { widgetId: string }) => (
  <div className="flex flex-col gap-2">
    <PulsacityWidget widgetId={widgetId} type="badge" />
    <p className="text-small text-gray">{COUNTERPART_NOTE}</p>
  </div>
);

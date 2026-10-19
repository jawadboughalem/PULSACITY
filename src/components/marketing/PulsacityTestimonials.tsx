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
 * Maquette 3.6, « Le mur de PULSACITY »: on the home page, the testimonials of the first creators, all real. The widget
 * itself announces its selection and the beta testers' counterpart (lot 4.13).
 */
export const PulsacityWall = ({ widgetId }: { widgetId: string }) => (
  <MarketingSection labelledBy="first-creators">
    <SectionTitle id="first-creators">Les avis des premiers créateurs</SectionTitle>
    <div className="mt-8 desktop:mt-10">
      <PulsacityWidget widgetId={widgetId} type="wall" />
    </div>
  </MarketingSection>
);

/** Maquette 3.6, « Le badge de PULSACITY sur Tarifs ». */
export const PulsacityBadge = ({ widgetId }: { widgetId: string }) => <PulsacityWidget widgetId={widgetId} type="badge" />;

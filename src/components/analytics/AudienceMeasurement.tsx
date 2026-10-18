import Script from "next/script";

/** Umami Cloud's tracker, unless the environment names another (decisions/commercialisation.md, « Outil de mesure »). */
const DEFAULT_SCRIPT_URL = "https://cloud.umami.is/script.js";

/** Only pulsacity.com counts: a preview with the variable loads the tracker, which sends nothing. */
const COUNTED_DOMAINS = "pulsacity.com";

/** The pages never measured, even reached from a public page without reloading: the space, the clients' pages. */
export const UNMEASURED_PATHS = ["/app", "/t", "/desinscription", "/espace-supprime"];

export const BEFORE_SEND_FUNCTION = "pulsacityBeforeSend";

/** Umami calls it before each send: null drops the page view or the event (data-before-send). */
export const BEFORE_SEND_SCRIPT = `window.${BEFORE_SEND_FUNCTION} = function (type, payload) {
  try {
    var path = new URL(payload.url, window.location.origin).pathname;
    var hidden = ${JSON.stringify(UNMEASURED_PATHS)};
    for (var index = 0; index < hidden.length; index += 1) {
      if (path === hidden[index] || path.indexOf(hidden[index] + "/") === 0) return null;
    }
  } catch (error) {}
  return payload;
};`;

/**
 * The audience of the public pages, without cookie (Umami Cloud): loaded only where NEXT_PUBLIC_UMAMI_WEBSITE_ID is set.
 * Do Not Track is respected. Events are named on their elements (data-umami-event); one is sent by code (track-event).
 */
export const AudienceMeasurement = () => {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();
  if (!websiteId) return null;
  return (
    <>
      <Script id="umami-before-send" strategy="afterInteractive">
        {BEFORE_SEND_SCRIPT}
      </Script>
      <Script
        src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL?.trim() || DEFAULT_SCRIPT_URL}
        data-website-id={websiteId}
        data-domains={COUNTED_DOMAINS}
        data-do-not-track="true"
        data-before-send={BEFORE_SEND_FUNCTION}
        strategy="afterInteractive"
      />
    </>
  );
};

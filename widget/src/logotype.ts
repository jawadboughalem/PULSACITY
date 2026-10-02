import { LOGOTYPE_FAMILY } from "./styles";

let isRequested = false;

/**
 * Newsreader 600, cut down to the letters of « Pulsacity » (1.6 KB), for the mention only. Fonts declared inside a
 * shadow root are ignored by browsers, so the face joins the page's fonts under a name no page uses.
 */
export const loadLogotype = (url: string): void => {
  if (isRequested || typeof FontFace !== "function" || !document.fonts) return;
  isRequested = true;
  try {
    document.fonts.add(new FontFace(LOGOTYPE_FAMILY, `url("${url}") format("woff2")`, { weight: "600", display: "swap" }));
  } catch {
    isRequested = false;
  }
};

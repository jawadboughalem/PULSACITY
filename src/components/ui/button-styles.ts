import { cn } from "@/lib/cn";

/** Charte v2, Bordures: focus-ring, on every interactive element reached with the keyboard. */
export const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink";

/** The same ring on an Encre background (footer, floating message): Soleil. */
export const FOCUS_RING_ON_INK = "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-sun";

/** Colour changes in 120 ms, the 1 px press (pulsacity-motion.css), and no press once disabled. */
const MOTION = "pz-couleur pz-appui disabled:active:translate-y-[0] aria-disabled:active:translate-y-[0]";

const BUTTON_BASE = `${MOTION} inline-flex items-center justify-center gap-2 rounded-full text-body font-bold whitespace-nowrap cursor-pointer ${FOCUS_RING} disabled:cursor-not-allowed aria-disabled:cursor-not-allowed aria-busy:cursor-progress`;

/**
 * Bouton principal: 56 high, Soleil, Encre text. One per screen. While it sends (aria-busy, and disabled so that it
 * cannot be clicked twice), it keeps its colours, with the spinner and « Envoi… ».
 */
export const PRIMARY_BUTTON_CLASSES = `${BUTTON_BASE} h-[56px] bg-sun px-7 text-ink hover:bg-sun-hover active:bg-sun-pressed disabled:bg-gray-light disabled:text-gray aria-disabled:bg-gray-light aria-disabled:text-gray aria-busy:bg-sun aria-busy:text-ink`;

/** Bouton secondaire: 52 high, white, a 2 px Encre border; Ciel on hover, Ciel appui when pressed. */
export const SECONDARY_BUTTON_CLASSES = `${BUTTON_BASE} h-[52px] border-2 border-ink bg-white px-6 text-ink hover:bg-sky active:bg-sky-pressed disabled:border-disabled-border disabled:bg-white disabled:text-gray aria-disabled:border-disabled-border aria-disabled:bg-white aria-disabled:text-gray aria-busy:border-ink aria-busy:text-ink`;

/** Its compact variant, in the rows of a table: 44 high. */
export const SECONDARY_COMPACT_BUTTON_CLASSES = cn(SECONDARY_BUTTON_CLASSES, "h-[44px] px-[18px]");

/** Bouton discret: Encre text underlined 2 px, 4 px below; 44 high to be easy to touch. No loading state. */
export const DISCREET_BUTTON_CLASSES = `pz-couleur inline-flex min-h-[44px] items-center gap-2 rounded-full px-[10px] text-body font-bold text-ink underline decoration-2 underline-offset-4 cursor-pointer hover:text-ink-800 hover:decoration-[3px] active:bg-sky ${FOCUS_RING} disabled:cursor-not-allowed disabled:text-gray disabled:no-underline aria-disabled:text-gray aria-disabled:no-underline`;

/** Bouton danger: in a confirmation window only. */
export const DANGER_BUTTON_CLASSES = `${BUTTON_BASE} h-[52px] bg-error px-6 text-white hover:bg-error-hover active:bg-error-hover disabled:bg-gray-light disabled:text-gray aria-disabled:bg-gray-light aria-disabled:text-gray aria-busy:bg-error aria-busy:text-white`;

/** Bouton icône: 44 × 44, no background until hovered. Its aria-label is mandatory. */
export const ICON_BUTTON_CLASSES = `pz-couleur inline-flex size-[44px] shrink-0 items-center justify-center rounded-full text-ink cursor-pointer hover:bg-sky active:bg-sky-pressed ${FOCUS_RING} disabled:cursor-not-allowed disabled:text-disabled-border disabled:hover:bg-transparent`;

/** A link inside a sentence: Encre, underlined, Encre 800 when hovered. */
export const INLINE_LINK_CLASSES = `pz-couleur font-semibold text-ink underline decoration-2 underline-offset-4 hover:text-ink-800 hover:decoration-[3px] ${FOCUS_RING}`;

import { FOCUS_RING } from "./button-styles";

/**
 * Charte v2, Onglets de panneau (role="tablist") and Bascule à deux choix (aria-pressed): a Ciel pill, padding 4; the
 * chosen option in Encre with white text, the others Ciel appui when hovered.
 */
export const SEGMENTED_CLASSES = "flex rounded-full bg-sky p-1";

export const SEGMENTED_OPTION_CLASSES = `pz-couleur flex h-[44px] flex-1 cursor-pointer items-center justify-center rounded-full px-6 text-body font-bold whitespace-nowrap ${FOCUS_RING}`;

export const SEGMENTED_OPTION_CHOSEN_CLASSES = "bg-ink text-white";

export const SEGMENTED_OPTION_IDLE_CLASSES = "text-ink hover:bg-sky-pressed";

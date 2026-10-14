import { FOCUS_RING } from "./button-styles";

/**
 * Charte v2, Pastille de filtre: 40 high in a 44 zone, a 2 px Encre border; chosen, Soleil with a check 16 on the left
 * (aria-pressed="true", or aria-current on a link). One choice per group.
 */
export const FILTER_CHIP_CLASSES = `pz-couleur relative inline-flex h-[40px] shrink-0 cursor-pointer items-center gap-2 rounded-full border-2 border-ink bg-white px-4 text-small font-bold whitespace-nowrap text-ink after:absolute after:inset-x-[0] after:-inset-y-[4px] after:content-[''] hover:bg-sky active:bg-sky-pressed ${FOCUS_RING}`;

export const FILTER_CHIP_CHOSEN_CLASSES = "bg-sun pl-3 hover:bg-sun-hover active:bg-sun-pressed";

import { cn } from "@/lib/cn";
import { FOCUS_RING } from "./button-styles";

/** Variants merge with tailwind-merge: the last value of a property wins, whatever the order of the stylesheet. */

/** Charte v2, Champ de texte: 56 high, radius-field, a 2 px Gris border, Encre when hovered or focused. */
export const FIELD_CLASSES = `pz-couleur h-[56px] w-full min-w-[0] rounded-field border-2 border-gray bg-white px-4 text-body text-ink placeholder:text-gray enabled:hover:border-ink focus:border-ink ${FOCUS_RING} aria-invalid:border-error disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-gray-light disabled:text-gray`;

/** Zone de texte: 160 high at least, padding 16 18. */
export const TEXTAREA_CLASSES = cn(FIELD_CLASSES, "h-auto min-h-[160px] px-[18px] py-4");

/** A link to copy: read only, on Nuage. */
export const READ_ONLY_FIELD_CLASSES = cn(FIELD_CLASSES, "bg-cloud");

/** Liste déroulante: the field's box, room on the right for its chevron (SelectControl). */
export const SELECT_CLASSES = cn(FIELD_CLASSES, "pz-select cursor-pointer appearance-none pr-12");

/** The label above a field: 15/22 700, 8 px above it. */
export const FIELD_LABEL_CLASSES = "text-small font-bold text-ink";

/** « (facultatif) » inside a label. */
export const OPTIONAL_MARK_CLASSES = "font-normal text-gray";

/** The help below a field. */
export const FIELD_HINT_CLASSES = "text-small text-gray";

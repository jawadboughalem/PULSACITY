import { cn } from "@/lib/cn";
import { FOCUS_RING } from "./button-styles";

/** Charte v2, Menu: white, radius-card, padding 8, the floating shadow, 232 wide at least. Opens with pz-flottant. */
export const MENU_PANEL_CLASSES =
  "pz-flottant z-20 flex min-w-[232px] flex-col rounded-card bg-white p-2 text-ink shadow-float";

/**
 * An option: 48 high, padding 0 14, radius-field, its icon 20 at 12 px; Ciel when hovered or reached with the keys. On
 * one line: the menu widens to its longest option.
 */
export const MENU_ITEM_CLASSES = `pz-couleur flex min-h-[48px] w-full cursor-pointer items-center gap-3 rounded-field px-[14px] text-left text-body whitespace-nowrap text-ink hover:bg-sky focus-visible:bg-sky ${FOCUS_RING}`;

/** The account menu's options are 15 px. */
export const ACCOUNT_MENU_ITEM_CLASSES = cn(MENU_ITEM_CLASSES, "text-small");

/** A destructive action, always last: Erreur 700, Erreur fond when hovered. It always opens a confirmation. */
export const MENU_ITEM_DANGER_CLASSES = cn(
  MENU_ITEM_CLASSES,
  "font-bold text-error hover:bg-error-surface focus-visible:bg-error-surface",
);

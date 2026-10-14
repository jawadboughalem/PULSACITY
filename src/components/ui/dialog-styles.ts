import type { MouseEvent } from "react";

/**
 * Charte v2, Fenêtre de dialogue: white, radius-panel, padding 32, 520 wide at most, the floating shadow, on the veil.
 * On a phone, a sheet anchored at the bottom: radius 24 at the top only, padding 24 20 28. It opens with the
 * charter's entrance (pz-flottant, data-ouvert="true").
 */
export const DIALOG_CLASSES =
  "pz-flottant m-auto max-h-[calc(100dvh-40px)] w-[calc(100%-40px)] max-w-[520px] overflow-y-auto rounded-panel bg-white p-8 text-ink shadow-float backdrop:bg-veil max-desktop:mb-[0] max-desktop:w-full max-desktop:max-w-full max-desktop:rounded-b-[0] max-desktop:px-5 max-desktop:pt-6 max-desktop:pb-7";

/** The title of a window: h3, tied to it by aria-labelledby. */
export const DIALOG_TITLE_CLASSES = "font-display text-h3";

/** Its actions: on a computer, on the right, « Annuler » first; on a phone, full width, the action on top. */
export const DIALOG_ACTIONS_CLASSES = "flex flex-col-reverse gap-3 desktop:flex-row desktop:justify-end";

/** A click on the veil, outside the window itself, closes it. */
export const isClickOnVeil = (event: MouseEvent<HTMLDialogElement>) => {
  if (event.target !== event.currentTarget) return false;
  const box = event.currentTarget.getBoundingClientRect();
  return (
    event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom
  );
};

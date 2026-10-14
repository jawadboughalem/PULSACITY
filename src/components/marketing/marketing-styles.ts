import { PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";

/** m7: the call to create a space, in the hero and at the end of a page, 56 high; full width on a phone. */
export const LARGE_BUTTON_CLASSES = `${PRIMARY_BUTTON_CLASSES} h-[56px] w-full desktop:w-auto`;

/** A link inside a sentence: Carmin, underlined, on the line of the text. */
export const INLINE_LINK_CLASSES =
  "font-semibold text-ink underline underline-offset-[3px] hover:text-ink-800 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink";

/** A link in a text of the public site: Carmin, underlined, 44 high to be easy to touch. */
export const TEXT_LINK_CLASSES =
  "inline-flex min-h-[44px] items-center font-semibold text-ink underline underline-offset-[3px] hover:text-ink-800 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ink";

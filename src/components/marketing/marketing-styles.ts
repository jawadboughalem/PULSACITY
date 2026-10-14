import { DISCREET_BUTTON_CLASSES, INLINE_LINK_CLASSES, PRIMARY_BUTTON_CLASSES } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

/** m7: the call to create a space, in the hero and at the end of a page; full width on a phone. */
export const LARGE_BUTTON_CLASSES = cn(PRIMARY_BUTTON_CLASSES, "w-full desktop:w-auto");

/** A link of the public site that stands on its own (« Voir toutes les intégrations »): charte v2, Bouton discret. */
export const TEXT_LINK_CLASSES = DISCREET_BUTTON_CLASSES;

/** The first step of a breadcrumb: a link in the line of the text, 44 high to be easy to touch. */
export const BREADCRUMB_LINK_CLASSES = cn(INLINE_LINK_CLASSES, "inline-flex min-h-[44px] items-center");

import { HEX_COLOR_PATTERN } from "./contrast-ratio";

/** A colour typed by hand: « 4f6f52 », without its « # », still reads as « #4F6F52 ». Anything else: null. */
export const readTypedColor = (typed: string): string | null => {
  const trimmed = typed.trim();
  const color = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return HEX_COLOR_PATTERN.test(color) ? color.toUpperCase() : null;
};

/** Where a title of the text sits in the window: its top, in pixels from the top of the window. */
export type HeadingPosition = { id: string; top: number };

export type ReadingView = {
  height: number;
  /** The page cannot scroll any further. */
  isAtEnd: boolean;
  /** « #cookies » after a link of the contents or of the footer, or an empty string. */
  hash: string;
};

/** The title read last above this line of the window is the one being read. */
export const READING_LINE = 120;

/**
 * The title the contents mark (m22, m23): the last one above the reading line; at the end of the page, the last one
 * in view, which may never reach the line; and a title just reached by a link while it sits in the top half.
 */
export const pickCurrentHeading = (positions: HeadingPosition[], view: ReadingView): string | null => {
  let current = positions[0]?.id ?? null;
  for (const position of positions) if (position.top <= READING_LINE) current = position.id;

  const last = positions.at(-1);
  if (view.isAtEnd && last && last.top < view.height) current = last.id;

  const target = positions.find((position) => `#${position.id}` === view.hash);
  if (target && target.top >= -1 && target.top < view.height / 2) current = target.id;
  return current;
};

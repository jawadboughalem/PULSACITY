export type DiffSegment = { text: string; isChanged: boolean };

/** Words and the spaces between them, each its own token: a changed word is marked without its spaces. */
const tokenize = (text: string): string[] => text.split(/(\s+)/).filter((token) => token !== "");

const isSpace = (token: string) => /^\s+$/.test(token);

/**
 * The corrected text cut into what the author wrote and what changed (maquette 3.6, « Demande d'accord pour une
 * correction »: the passage changed in bold, underlined). A longest common subsequence of words: a testimonial holds a
 * few hundred words at most.
 */
export const diffWords = (from: string, to: string): DiffSegment[] => {
  const before = tokenize(from);
  const after = tokenize(to);
  const lengths = Array.from({ length: before.length + 1 }, () => new Array<number>(after.length + 1).fill(0));
  for (let i = 1; i <= before.length; i += 1) {
    for (let j = 1; j <= after.length; j += 1) {
      lengths[i][j] =
        before[i - 1] === after[j - 1] ? lengths[i - 1][j - 1] + 1 : Math.max(lengths[i - 1][j], lengths[i][j - 1]);
    }
  }

  // Walked back from the end: a word repeated in the change is matched with its last occurrence, so that the words
  // added read as one passage (« fringales de » to « envies de sucre de »: « envies de sucre », not « envies » and
  // « sucre de »).
  const kept = new Array<boolean>(after.length).fill(false);
  for (let i = before.length, j = after.length; i > 0 && j > 0; ) {
    if (before[i - 1] === after[j - 1]) {
      kept[j - 1] = true;
      i -= 1;
      j -= 1;
    } else if (lengths[i - 1][j] >= lengths[i][j - 1]) {
      i -= 1;
    } else {
      j -= 1;
    }
  }

  // A space between two changed words belongs to the change; any other space is kept as written.
  const isChanged = after.map((token, index) => {
    if (!isSpace(token)) return !kept[index];
    return index > 0 && index < after.length - 1 && !kept[index - 1] && !kept[index + 1];
  });

  const segments: DiffSegment[] = [];
  after.forEach((token, index) => {
    const last = segments.at(-1);
    if (last && last.isChanged === isChanged[index]) last.text += token;
    else segments.push({ text: token, isChanged: isChanged[index] });
  });
  return segments;
};

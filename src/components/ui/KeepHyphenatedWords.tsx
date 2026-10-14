const HYPHENATED_WORD = /(\S*[\p{L}\d]-[\p{L}\d]\S*)/u;

/**
 * A text whose hyphenated words (« e-mail ») never break at their hyphen: Figtree has no non-breaking hyphen, so
 * each such word is kept on one line.
 */
export const KeepHyphenatedWords = ({ text }: { text: string }) =>
  text.split(HYPHENATED_WORD).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );

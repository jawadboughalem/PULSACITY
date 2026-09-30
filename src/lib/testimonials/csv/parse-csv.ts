const DELIMITERS = [";", ",", "\t"] as const;

const QUOTE = '"';

const countOutsideQuotes = (line: string, delimiter: string): number => {
  let isQuoted = false;
  let found = 0;
  for (const character of line) {
    if (character === QUOTE) isQuoted = !isQuoted;
    else if (character === delimiter && !isQuoted) found += 1;
  }
  return found;
};

export const detectDelimiter = (text: string): string => {
  const firstLine = text.split(/\r\n|\n|\r/, 1)[0] ?? "";
  return DELIMITERS.reduce((best, delimiter) =>
    countOutsideQuotes(firstLine, delimiter) > countOutsideQuotes(firstLine, best) ? delimiter : best,
  );
};

/** Rows as a spreadsheet shows them: a quoted cell may hold line breaks, and row n is at index n - 1. */
export const parseCsv = (text: string, delimiter = detectDelimiter(text)): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let isQuoted = false;

  const endCell = () => {
    row.push(cell);
    cell = "";
  };
  const endRow = () => {
    endCell();
    rows.push(row);
    row = [];
  };

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (isQuoted) {
      if (character === QUOTE && text[index + 1] === QUOTE) {
        cell += QUOTE;
        index += 1;
      } else if (character === QUOTE) {
        isQuoted = false;
      } else {
        cell += character;
      }
    } else if (character === QUOTE && cell.trim() === "") {
      cell = "";
      isQuoted = true;
    } else if (character === delimiter) {
      endCell();
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      endRow();
    } else {
      cell += character;
    }
  }
  if (cell !== "" || row.length > 0) endRow();
  return rows;
};

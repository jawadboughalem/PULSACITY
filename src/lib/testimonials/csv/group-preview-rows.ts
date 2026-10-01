import type { CsvRow } from "./read-testimonial-csv";

export type PreviewItem =
  | { kind: "row"; row: CsvRow }
  | { kind: "ready-run"; fromLine: number; toLine: number; count: number };

/**
 * The first rows in full, then every row to fix in full, and the ready rows between them folded into one line:
 * the preview of a long file stays short without hiding a problem.
 */
export const groupPreviewRows = (rows: readonly CsvRow[], shownFirst: number): PreviewItem[] => {
  const items: PreviewItem[] = [];
  let run: CsvRow[] = [];
  const closeRun = () => {
    if (run.length === 0) return;
    items.push({ kind: "ready-run", fromLine: run[0].line, toLine: run[run.length - 1].line, count: run.length });
    run = [];
  };
  rows.forEach((row, index) => {
    if (index < shownFirst || row.status !== "ready") {
      closeRun();
      items.push({ kind: "row", row });
      return;
    }
    run.push(row);
  });
  closeRun();
  return items;
};

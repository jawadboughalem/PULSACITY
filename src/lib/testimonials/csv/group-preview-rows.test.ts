import { describe, expect, it } from "vitest";
import { groupPreviewRows } from "./group-preview-rows";
import type { CsvRow } from "./read-testimonial-csv";

const row = (line: number, status: CsvRow["status"] = "ready") => ({ line, status }) as CsvRow;

describe("groupPreviewRows", () => {
  it("shows the first rows and every row to fix, and folds the ready rows between them", () => {
    const rows = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((line) => row(line, line === 12 ? "invalid" : "ready"));

    expect(groupPreviewRows(rows, 4).map((item) => (item.kind === "row" ? item.row.line : [item.fromLine, item.toLine, item.count]))).toEqual([
      2,
      3,
      4,
      5,
      [6, 11, 6],
      12,
      [13, 14, 2],
    ]);
  });

  it("folds nothing when the file is short", () => {
    expect(groupPreviewRows([row(2), row(3)], 4).every((item) => item.kind === "row")).toBe(true);
  });
});

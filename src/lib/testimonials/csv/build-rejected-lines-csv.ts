import { CSV_COLUMNS, type CsvRow } from "./read-testimonial-csv";

const quoteCell = (cell: string) => (/[;"\r\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell);

/** The lines that were not imported, as they were written, ready to fix and import again. */
export const buildRejectedLinesCsv = (rows: readonly CsvRow[]): string =>
  `﻿${[CSV_COLUMNS.join(";"), ...rows.map((row) => CSV_COLUMNS.map((column) => quoteCell(row.cells[column])).join(";"))].join("\r\n")}\r\n`;

import { describe, expect, it } from "vitest";
import { calendarDateToTimestamp, isAfterDay, readCsvDate, readCsvRating } from "./read-csv-cells";

describe("readCsvRating", () => {
  it("reads a whole number from 1 to 5, written in several ways", () => {
    expect(readCsvRating("5")).toBe(5);
    expect(readCsvRating(" 4 ")).toBe(4);
    expect(readCsvRating("4/5")).toBe(4);
    expect(readCsvRating("3,0")).toBe(3);
    expect(readCsvRating("★★★★")).toBe(4);
  });

  it("refuses anything else", () => {
    for (const cell of ["0", "6", "4,5", "cinq", "", "10/10", "★★★★★★"]) expect(readCsvRating(cell)).toBeNull();
  });
});

describe("readCsvDate", () => {
  it("reads French and ISO dates", () => {
    expect(readCsvDate("14/03/2026")).toEqual({ year: 2026, month: 3, day: 14 });
    expect(readCsvDate("4/3/26")).toEqual({ year: 2026, month: 3, day: 4 });
    expect(readCsvDate("14.03.2026")).toEqual({ year: 2026, month: 3, day: 14 });
    expect(readCsvDate("2026-03-14")).toEqual({ year: 2026, month: 3, day: 14 });
    expect(readCsvDate("2026-03-14T09:30:00Z")).toEqual({ year: 2026, month: 3, day: 14 });
  });

  it("refuses a day that does not exist or an unknown shape", () => {
    for (const cell of ["31/02/2026", "13/13/2026", "mars 2026", "2026/03/14", "14 03 2026"]) {
      expect(readCsvDate(cell)).toBeNull();
    }
  });

  it("stores the day at noon UTC and spots the future", () => {
    expect(calendarDateToTimestamp({ year: 2026, month: 3, day: 14 }).toISOString()).toBe("2026-03-14T12:00:00.000Z");
    expect(isAfterDay({ year: 2026, month: 10, day: 1 }, { year: 2026, month: 9, day: 30 })).toBe(true);
    expect(isAfterDay({ year: 2026, month: 9, day: 30 }, { year: 2026, month: 9, day: 30 })).toBe(false);
  });
});

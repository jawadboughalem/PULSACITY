import { describe, expect, it } from "vitest";
import { compareCalendarDates, readParisDate, startOfParisMonth } from "./paris-date";

describe("startOfParisMonth", () => {
  it("starts the month at midnight in Paris, in winter and in summer time", () => {
    expect(startOfParisMonth(new Date("2026-01-15T12:00:00Z")).toISOString()).toBe("2025-12-31T23:00:00.000Z");
    expect(startOfParisMonth(new Date("2026-09-30T12:00:00Z")).toISOString()).toBe("2026-08-31T22:00:00.000Z");
  });

  it("already counts the next month in Paris before midnight in London", () => {
    expect(startOfParisMonth(new Date("2026-09-30T22:30:00Z")).toISOString()).toBe("2026-09-30T22:00:00.000Z");
  });
});

describe("readParisDate", () => {
  it("gives the calendar day in Paris", () => {
    expect(readParisDate(new Date("2026-03-28T23:30:00Z"))).toEqual({ year: 2026, month: 3, day: 29 });
  });

  it("orders calendar days", () => {
    expect(compareCalendarDates({ year: 2026, month: 3, day: 29 }, { year: 2026, month: 4, day: 1 })).toBeLessThan(0);
    expect(compareCalendarDates({ year: 2026, month: 4, day: 1 }, { year: 2026, month: 4, day: 1 })).toBe(0);
  });
});

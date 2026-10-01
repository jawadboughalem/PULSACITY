import { describe, expect, it } from "vitest";
import { formatDateTime, formatDayMonth, formatDayMonthYear } from "./format-french-date";

describe("French dates", () => {
  it("writes the day in Paris, as the space shows it", () => {
    const date = new Date("2026-09-26T19:47:00Z");

    expect(formatDayMonth(date)).toBe("26 sept.");
    expect(formatDayMonthYear(date)).toBe("26 sept. 2026");
    expect(formatDateTime(date)).toBe("26 sept. 2026 à 21:47");
    expect(formatDayMonth(new Date("2026-06-30T22:30:00Z"))).toBe("1 juil.");
  });
});

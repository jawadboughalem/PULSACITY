import { describe, expect, it } from "vitest";
import { formatListTime, formatSince } from "./format-relative-time";

const NOW = new Date("2026-10-03T12:00:00Z");

describe("formatSince", () => {
  it("counts the minutes of the last hour, then names the day in Paris", () => {
    expect(formatSince(new Date("2026-10-03T11:59:30Z"), NOW)).toBe("à l'instant");
    expect(formatSince(new Date("2026-10-03T11:57:00Z"), NOW)).toBe("il y a 3 min");
    expect(formatSince(new Date("2026-10-03T07:10:00Z"), NOW)).toBe("aujourd'hui à 09:10");
    expect(formatSince(new Date("2026-10-02T16:42:00Z"), NOW)).toBe("hier à 18:42");
    expect(formatSince(new Date("2026-09-25T08:05:00Z"), NOW)).toBe("le 25 sept. à 10:05");
  });

  it("puts a sale of 23:30 in Paris on its own day", () => {
    expect(formatSince(new Date("2026-10-02T21:30:00Z"), new Date("2026-10-03T08:00:00Z"))).toBe("hier à 23:30");
  });
});

describe("formatListTime", () => {
  it("writes the times of maquette 5", () => {
    expect(formatListTime(new Date("2026-10-03T11:57:00Z"), NOW)).toBe("Il y a 3 min");
    expect(formatListTime(new Date("2026-10-02T16:42:00Z"), NOW)).toBe("Hier, 18:42");
    expect(formatListTime(new Date("2026-09-25T08:05:00Z"), NOW)).toBe("25 sept., 10:05");
  });
});

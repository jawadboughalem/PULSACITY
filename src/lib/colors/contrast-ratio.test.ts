import { describe, expect, it } from "vitest";
import { calculateContrastRatio } from "./contrast-ratio";

const roundToTenth = (ratio: number) => Math.round(ratio * 10) / 10;

describe("calculateContrastRatio", () => {
  it("finds the ratios the charter publishes", () => {
    expect(roundToTenth(calculateContrastRatio("#16213E", "#FFFFFF"))).toBe(15.9);
    expect(roundToTenth(calculateContrastRatio("#A3243B", "#FFFFFF"))).toBe(7.3);
    expect(roundToTenth(calculateContrastRatio("#7E8390", "#FFFFFF"))).toBe(3.8);
    expect(roundToTenth(calculateContrastRatio("#A3243B", "#16213E"))).toBe(2.2);
  });

  it("does not depend on the order of the two colours", () => {
    expect(calculateContrastRatio("#FFFFFF", "#5A5F6E")).toBe(calculateContrastRatio("#5A5F6E", "#FFFFFF"));
  });
});

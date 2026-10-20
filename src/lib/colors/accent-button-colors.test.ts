import { describe, expect, it } from "vitest";
import { readAccentButtonColors, readAccentStarColor, readAccentTint } from "./accent-button-colors";

describe("readAccentButtonColors", () => {
  it("writes in white on a dark accent, and darkens it by 8 % when hovered", () => {
    expect(readAccentButtonColors("#4f6f52")).toEqual({ background: "#4F6F52", text: "#FFFFFF", hover: "#49664B" });
  });

  it("writes in Encre on a light accent", () => {
    expect(readAccentButtonColors("#F2C94C")).toMatchObject({ text: "#16213E" });
  });

  it("keeps Soleil and Encre without an accent", () => {
    expect(readAccentButtonColors(null)).toBeNull();
    expect(readAccentButtonColors("vert")).toBeNull();
  });
});

describe("readAccentTint", () => {
  it("tints white with 9 % of the accent, for the background of the collect page", () => {
    expect(readAccentTint("#4F6F52")).toBe("#EFF2EF");
    expect(readAccentTint("#FFBE3B")).toBe("#FFF9ED");
  });

  it("has no tint without an accent, or with a colour it cannot read", () => {
    expect(readAccentTint(null)).toBeNull();
    expect(readAccentTint("vert")).toBeNull();
  });
});

describe("readAccentStarColor", () => {
  it("fills the stars with an accent readable at 3:1 on white, otherwise with Encre (maquettes 3.6)", () => {
    expect(readAccentStarColor("#4f6f52")).toBe("#4F6F52");
    expect(readAccentStarColor("#F2C94C")).toBe("#16213E");
  });

  it("leaves the stars in Soleil without an accent", () => {
    expect(readAccentStarColor(null)).toBeNull();
    expect(readAccentStarColor("vert")).toBeNull();
  });
});

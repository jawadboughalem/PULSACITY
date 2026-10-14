import { describe, expect, it } from "vitest";
import { readAccentButtonColors } from "./accent-button-colors";

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

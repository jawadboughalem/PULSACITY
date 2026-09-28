import { describe, expect, it } from "vitest";
import { formatExcerpt } from "./format-excerpt";

describe("formatExcerpt", () => {
  it("keeps a short testimonial whole", () => {
    expect(formatExcerpt("Merci pour tout.")).toBe("Merci pour tout.");
  });

  it("cuts a long testimonial on a word, as on the thank-you screen", () => {
    expect(
      formatExcerpt(
        "En 30 jours j'ai arrêté de grignoter le soir. Julie explique sans culpabiliser, c'est la première fois qu'un programme tient.",
      ),
    ).toBe("En 30 jours j'ai arrêté de grignoter le soir. Julie explique sans culpabiliser…");
  });

  it("never exceeds the length, even without any space", () => {
    expect(formatExcerpt("a".repeat(120), 80)).toBe(`${"a".repeat(80)}…`);
  });
});

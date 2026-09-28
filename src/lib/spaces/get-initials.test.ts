import { describe, expect, it } from "vitest";
import { getInitials } from "./get-initials";

describe("getInitials", () => {
  it("takes the first letter of the first two words", () => {
    expect(getInitials("Julie Nutrition")).toBe("JN");
    expect(getInitials("julie martin coaching")).toBe("JM");
    expect(getInitials("Élodie")).toBe("É");
  });

  it("skips punctuation and keeps apostrophes and dashes as separators", () => {
    expect(getInitials("L'atelier d'Anaïs")).toBe("LA");
    expect(getInitials("« Studio » 2.0")).toBe("S2");
    expect(getInitials("Jean-Pierre")).toBe("JP");
  });
});

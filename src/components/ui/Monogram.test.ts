import { describe, expect, it } from "vitest";
import { readMonogramLetters } from "./Monogram";

describe("readMonogramLetters", () => {
  it("takes the first letter of the first two words, as the maquettes draw them", () => {
    expect(readMonogramLetters("Systeme.io")).toBe("SI");
    expect(readMonogramLetters("Connecteur universel")).toBe("CU");
    expect(readMonogramLetters("Cal.com")).toBe("CC");
    expect(readMonogramLetters("Learnybox")).toBe("L");
    expect(readMonogramLetters("n8n")).toBe("N");
  });
});

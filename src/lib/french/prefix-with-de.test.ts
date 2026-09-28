import { describe, expect, it } from "vitest";
import { prefixWithDe } from "./prefix-with-de";

describe("prefixWithDe", () => {
  it("keeps « de » before a consonant", () => {
    expect(prefixWithDe("Camille")).toBe("de Camille");
    expect(prefixWithDe("Julie Nutrition")).toBe("de Julie Nutrition");
  });

  it("elides it before a vowel, accented or not", () => {
    expect(prefixWithDe("Inès")).toBe("d'Inès");
    expect(prefixWithDe("Élodie")).toBe("d'Élodie");
    expect(prefixWithDe("atelier zen")).toBe("d'atelier zen");
    expect(prefixWithDe("Œuvre Vive")).toBe("d'Œuvre Vive");
  });
});

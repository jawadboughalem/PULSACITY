import { describe, expect, it } from "vitest";
import { MAX_SLUG_LENGTH, SLUG_PATTERN, appendSlugSuffix, slugify } from "./slugify";

describe("slugify", () => {
  it("turns a French business name into a readable address", () => {
    expect(slugify("Julie Nutrition")).toBe("julie-nutrition");
    expect(slugify("  Élodie   Bien-Être, Lyon ! ")).toBe("elodie-bien-etre-lyon");
    expect(slugify("Cœur & Âme")).toBe("coeur-et-ame");
    expect(slugify("L'atelier d'Anaïs")).toBe("l-atelier-d-anais");
  });

  it("always produces an address the collection page accepts", () => {
    for (const name of ["Programme 30 jours", "---Yoga---", "Studio 2.0", "Ça va ?!"]) {
      expect(slugify(name)).toMatch(SLUG_PATTERN);
    }
  });

  it("stays within the maximum length without ending on a dash", () => {
    const slug = slugify("Une formation au nom vraiment très long pour tester la coupure propre");

    expect(slug.length).toBeLessThanOrEqual(MAX_SLUG_LENGTH);
    expect(slug).toMatch(SLUG_PATTERN);
  });

  it("returns nothing for a name without any letter or digit", () => {
    expect(slugify("!!! ???")).toBe("");
  });
});

describe("appendSlugSuffix", () => {
  it("adds the suffix while keeping the maximum length", () => {
    expect(appendSlugSuffix("julie-nutrition", "2")).toBe("julie-nutrition-2");

    const long = appendSlugSuffix("a".repeat(MAX_SLUG_LENGTH), "12");
    expect(long.length).toBe(MAX_SLUG_LENGTH);
    expect(long.endsWith("-12")).toBe(true);
  });
});

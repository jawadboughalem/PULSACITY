import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildCollectionUrl, displayUrl } from "./app-url";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com/");
});

describe("buildCollectionUrl", () => {
  it("points at the collection page of a space, or of one of its formations", () => {
    expect(buildCollectionUrl("julie-nutrition")).toBe("https://pulsacity.com/t/julie-nutrition");
    expect(buildCollectionUrl("julie-nutrition", "programme-30-jours")).toBe(
      "https://pulsacity.com/t/julie-nutrition/programme-30-jours",
    );
  });

  it("keeps the trailing slash of the prefix shown before an address being typed", () => {
    expect(displayUrl(buildCollectionUrl(""))).toBe("pulsacity.com/t/");
  });
});

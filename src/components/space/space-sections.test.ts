import { describe, expect, it } from "vitest";
import { DESKTOP_SECTIONS, MOBILE_SECTIONS, isSectionActive } from "./space-sections";

const activeLabels = (sections: typeof DESKTOP_SECTIONS, pathname: string) =>
  sections.filter((section) => isSectionActive(section, pathname)).map((section) => section.label);

describe("isSectionActive", () => {
  it("lights the section of the page, and of its sub-pages", () => {
    expect(activeLabels(DESKTOP_SECTIONS, "/app")).toEqual(["Accueil"]);
    expect(activeLabels(DESKTOP_SECTIONS, "/app/temoignages/0f8d1c2e")).toEqual(["Témoignages"]);
    expect(activeLabels(DESKTOP_SECTIONS, "/app/offres")).toEqual(["Offres"]);
  });

  it("lights Plus on mobile for every page it leads to", () => {
    expect(activeLabels(MOBILE_SECTIONS, "/app/plus")).toEqual(["Plus"]);
    expect(activeLabels(MOBILE_SECTIONS, "/app/offres")).toEqual(["Plus"]);
    expect(activeLabels(MOBILE_SECTIONS, "/app/temoignages")).toEqual(["Témoignages"]);
  });
});

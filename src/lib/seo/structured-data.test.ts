import { describe, expect, it } from "vitest";
import { buildBreadcrumbData, buildGuideData } from "./structured-data";

describe("buildBreadcrumbData", () => {
  it("gives each step its position and address, and the page itself none", () => {
    expect(
      buildBreadcrumbData("https://pulsacity.com", [
        { name: "Accueil", path: "/" },
        { name: "Intégrations", path: "/integrations" },
        { name: "Systeme.io" },
      ]).itemListElement,
    ).toEqual([
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://pulsacity.com" },
      { "@type": "ListItem", position: 2, name: "Intégrations", item: "https://pulsacity.com/integrations" },
      { "@type": "ListItem", position: 3, name: "Systeme.io" },
    ]);
  });
});

describe("buildGuideData", () => {
  it("describes the guide as an article by PULSACITY, dated from its last check", () => {
    const data = buildGuideData("https://pulsacity.com", {
      title: "Comment demander un témoignage",
      description: "Une méthode concrète.",
      updatedAt: "2026-10-20",
      path: "/guides/demander",
    });
    expect(data).toMatchObject({
      "@type": "Article",
      headline: "Comment demander un témoignage",
      dateModified: "2026-10-20",
      mainEntityOfPage: "https://pulsacity.com/guides/demander",
      author: { "@type": "Organization", name: "PULSACITY" },
    });
  });
});

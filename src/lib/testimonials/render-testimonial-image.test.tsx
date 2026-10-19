import { describe, expect, it } from "vitest";
import { cutAtWord, describeReviewDates, renderTestimonialImage } from "./render-testimonial-image";

const readPngSize = (bytes: Uint8Array) => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
};

describe("the image of a testimonial", () => {
  it("says the date of the review and the month of the purchase, as the widget will", () => {
    expect(describeReviewDates(new Date("2026-09-12T10:00:00Z"), new Date("2026-08-20T10:00:00Z"))).toBe(
      "Avis du 12 sept. 2026, achat en août 2026",
    );
    expect(describeReviewDates(new Date("2026-09-27T10:00:00Z"), null)).toBe("Avis du 27 sept. 2026");
  });

  it("cuts a quote too long for the landscape at a word, with « … »", () => {
    expect(cutAtWord("Une séance qui m'a vraiment apaisée.", 100)).toBe("Une séance qui m'a vraiment apaisée.");
    expect(cutAtWord("Les modules sont courts et concrets, j'ai lancé mon offre", 30)).toBe("Les modules sont courts et…");
  });

  it("draws a PNG at the size of each format", async () => {
    for (const [format, size] of [
      ["portrait", { width: 1080, height: 1350 }],
      ["paysage", { width: 1200, height: 630 }],
    ] as const) {
      const response = await renderTestimonialImage({
        format,
        spaceName: "Julie Nutrition",
        logoUrl: null,
        accentColor: "#4F6F52",
        showsPoweredBy: true,
        declaresIncentive: true,
        authorName: "Camille R.",
        authorTitle: "Enseignante",
        rating: 4,
        text: "En 30 jours j'ai arrêté de grignoter le soir. Julie explique sans culpabiliser.",
        reviewedAt: new Date("2026-09-12T10:00:00Z"),
        purchasedAt: new Date("2026-08-20T10:00:00Z"),
      });
      const bytes = new Uint8Array(await response.arrayBuffer());
      expect(response.headers.get("content-type")).toBe("image/png");
      expect(readPngSize(bytes)).toEqual(size);
    }
  }, 30_000);
});

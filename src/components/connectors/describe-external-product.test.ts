import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/french/format-price";
import { describeExternalProduct } from "./describe-external-product";

const NOW = new Date("2026-10-03T12:00:00Z");

describe("describeExternalProduct", () => {
  it("gives the price and the first sale", () => {
    expect(
      describeExternalProduct(
        { priceCents: 29700, currency: "EUR", firstSeenAt: new Date("2026-08-28T10:00:00Z"), eventType: "sale" },
        NOW,
      ),
    ).toBe(`${formatPrice(29700, "EUR")} · première vente le 28 août 2026`);
  });

  it("says « première inscription » for a formation joined without a sale", () => {
    expect(
      describeExternalProduct(
        { priceCents: null, currency: null, firstSeenAt: new Date("2026-08-28T10:00:00Z"), eventType: "enrollment" },
        NOW,
      ),
    ).toBe("première inscription le 28 août 2026");
  });
});

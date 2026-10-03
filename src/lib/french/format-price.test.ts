import { describe, expect, it } from "vitest";
import { formatPrice } from "./format-price";

describe("formatPrice", () => {
  it("writes a price the French way, with its cents only when there are some", () => {
    expect(formatPrice(29700, "EUR")).toBe("297 €");
    expect(formatPrice(999, "EUR")).toBe("9,99 €");
    expect(formatPrice(129000, "EUR")).toBe("1 290 €");
  });
});

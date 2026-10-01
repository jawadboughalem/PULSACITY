import { describe, expect, it } from "vitest";
import { formatAverageRating, formatResponseRate, pluralize } from "./format-figures";

describe("dashboard figures", () => {
  it("writes the average and the response rate in French", () => {
    expect(formatAverageRating(4.8333)).toBe("4,8/5");
    expect(formatAverageRating(5)).toBe("5,0/5");
    expect(formatAverageRating(null)).toBe("–");
    expect(formatResponseRate(8, 38)).toBe("21 %");
    expect(formatResponseRate(0, 0)).toBe("–");
  });

  it("agrees the noun with the count", () => {
    expect(pluralize(1, "réponse", "réponses")).toBe("1 réponse");
    expect(pluralize(0, "réponse", "réponses")).toBe("0 réponse");
    expect(pluralize(6, "relance prévue", "relances prévues")).toBe("6 relances prévues");
  });
});

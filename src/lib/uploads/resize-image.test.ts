import { describe, expect, it } from "vitest";
import { computeResizedDimensions } from "./resize-image";

describe("computeResizedDimensions", () => {
  it("brings the longest side down to 400 px, keeping the proportions", () => {
    expect(computeResizedDimensions(3024, 4032)).toEqual({ width: 300, height: 400 });
    expect(computeResizedDimensions(4000, 3000)).toEqual({ width: 400, height: 300 });
    expect(computeResizedDimensions(1080, 1080)).toEqual({ width: 400, height: 400 });
  });

  it("never enlarges a small image", () => {
    expect(computeResizedDimensions(320, 240)).toEqual({ width: 320, height: 240 });
  });
});

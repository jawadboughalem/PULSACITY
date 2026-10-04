import { describe, expect, it } from "vitest";
import { pickCurrentHeading } from "./pick-current-heading";

const VIEW = { height: 900, isAtEnd: false, hash: "" };

describe("pickCurrentHeading", () => {
  it("marks the first title before any is read, then the last one above the reading line", () => {
    const below = [
      { id: "qui", top: 400 },
      { id: "droits", top: 1200 },
    ];
    expect(pickCurrentHeading(below, VIEW)).toBe("qui");
    expect(pickCurrentHeading([{ id: "qui", top: -800 }, { id: "droits", top: 100 }], VIEW)).toBe("droits");
  });

  it("marks the last title at the end of the page, even below the reading line (Cookies, m23)", () => {
    const end = [
      { id: "droits", top: 60 },
      { id: "cookies", top: 420 },
    ];
    expect(pickCurrentHeading(end, VIEW)).toBe("droits");
    expect(pickCurrentHeading(end, { ...VIEW, isAtEnd: true })).toBe("cookies");
  });

  it("keeps a title reached by a link marked while it sits in the top half of the window", () => {
    const end = [
      { id: "droits", top: 24 },
      { id: "cookies", top: 420 },
    ];
    expect(pickCurrentHeading(end, { ...VIEW, isAtEnd: true, hash: "#droits" })).toBe("droits");
    expect(pickCurrentHeading([{ id: "droits", top: -300 }, { id: "cookies", top: 100 }], { ...VIEW, hash: "#droits" })).toBe(
      "cookies",
    );
  });
});

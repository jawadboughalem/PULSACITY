import { describe, expect, it } from "vitest";
import { nameColor } from "./name-color";

describe("nameColor", () => {
  it("names the colours of the charter and of the onboarding swatches", () => {
    expect(nameColor("#4F6F52")).toBe("Vert");
    expect(nameColor("#16213E")).toBe("Bleu");
    expect(nameColor("#A3243B")).toBe("Rouge");
    expect(nameColor("#F5873B")).toBe("Orange");
    expect(nameColor("#E8C33A")).toBe("Jaune");
  });

  it("tells greys, browns and the extremes apart", () => {
    expect(nameColor("#7E8390")).toBe("Gris");
    expect(nameColor("#8B5A2B")).toBe("Brun");
    expect(nameColor("#050505")).toBe("Noir");
    expect(nameColor("#FAFAFA")).toBe("Blanc");
    expect(nameColor("#7B3FA0")).toBe("Violet");
    expect(nameColor("#E05A9B")).toBe("Rose");
  });
});

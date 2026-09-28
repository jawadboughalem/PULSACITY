import { describe, expect, it } from "vitest";
import { formatCustomerName, getFirstName } from "./format-customer-name";

describe("formatCustomerName", () => {
  it("shows the first name and the initial of the last name, as on the widgets", () => {
    expect(formatCustomerName({ firstName: "Camille", lastName: "roux" })).toBe("Camille R.");
  });

  it("uses whatever part of the name the purchase carries", () => {
    expect(formatCustomerName({ firstName: " Camille ", lastName: null })).toBe("Camille");
    expect(formatCustomerName({ firstName: null, lastName: "Roux" })).toBe("Roux");
    expect(formatCustomerName({ firstName: null, lastName: null })).toBe("");
  });
});

describe("getFirstName", () => {
  it("takes the first word of the name typed on the form", () => {
    expect(getFirstName("Camille R.")).toBe("Camille");
    expect(getFirstName("  Anne-Laure ")).toBe("Anne-Laure");
  });
});

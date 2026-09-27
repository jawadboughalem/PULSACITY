import { describe, expect, it } from "vitest";
import { getConnector } from "./registry";

describe("getConnector", () => {
  it("resolves nothing that is not a registered connector", () => {
    for (const id of ["", "unknown", "__proto__", "constructor", "toString"]) {
      expect(getConnector(id)).toBeNull();
    }
  });
});

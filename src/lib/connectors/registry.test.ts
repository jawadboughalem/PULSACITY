import { describe, expect, it } from "vitest";
import { getConnector, listConnectors } from "./registry";
import { CONNECTOR_IDS } from "./types";

describe("connector registry", () => {
  it("resolves nothing that is not a registered connector", () => {
    for (const id of ["", "unknown", "__proto__", "constructor", "toString", "hasOwnProperty"]) {
      expect(getConnector(id)).toBeNull();
    }
  });

  it("registers each connector under its own id", () => {
    for (const connector of listConnectors()) {
      expect(CONNECTOR_IDS).toContain(connector.id);
      expect(getConnector(connector.id)).toBe(connector);
    }
  });
});

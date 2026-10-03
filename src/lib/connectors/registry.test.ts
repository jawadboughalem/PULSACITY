import { describe, expect, it } from "vitest";
import { getConnector, getConnectorBySlug, listConnectors, readConnectorName } from "./registry";

describe("getConnector", () => {
  it("resolves nothing that is not a registered connector", () => {
    for (const id of ["", "unknown", "__proto__", "constructor", "toString"]) {
      expect(getConnector(id)).toBeNull();
    }
  });

  it("resolves Systeme.io by its id, and by its address in the space", () => {
    expect(getConnector("systeme")?.name).toBe("Systeme.io");
    expect(getConnectorBySlug("systeme-io")?.id).toBe("systeme");
    expect(getConnectorBySlug("systeme")).toBeNull();
  });

  it("keeps the registry's ids and addresses unique", () => {
    const connectors = listConnectors();
    expect(new Set(connectors.map((connector) => connector.id)).size).toBe(connectors.length);
    expect(new Set(connectors.map((connector) => connector.slug)).size).toBe(connectors.length);
  });

  it("names a connector that left the registry by its id", () => {
    expect(readConnectorName("systeme")).toBe("Systeme.io");
    expect(readConnectorName("ancien")).toBe("ancien");
  });
});

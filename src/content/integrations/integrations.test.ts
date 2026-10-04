import { describe, expect, it } from "vitest";
import { getConnectorBySlug, listConnectors } from "@/lib/connectors/registry";
import { UPCOMING_CONNECTOR_IDS } from "@/lib/connectors/upcoming-connectors";
import { findGuide } from "../guides";
import { INTEGRATIONS, findIntegration } from ".";

describe("INTEGRATIONS", () => {
  it("has one page per connector of the registry, at the same address as in the space", () => {
    for (const connector of listConnectors()) {
      const integration = findIntegration(connector.slug);
      expect(integration?.status).toBe("available");
      expect(integration?.name).toBe(connector.name);
    }
  });

  it("only calls available a connector the registry receives", () => {
    for (const integration of INTEGRATIONS.filter((page) => page.status === "available")) {
      expect(getConnectorBySlug(integration.slug)).not.toBeNull();
    }
  });

  it("puts a connector to come on the waiting list of the space", () => {
    for (const integration of INTEGRATIONS) {
      if (integration.status === "soon") expect(UPCOMING_CONNECTOR_IDS).toContain(integration.connector);
    }
  });

  it("keeps the addresses unique, and leads each available page to an existing guide", () => {
    expect(new Set(INTEGRATIONS.map((integration) => integration.slug)).size).toBe(INTEGRATIONS.length);
    for (const integration of INTEGRATIONS) {
      if (integration.status === "available") expect(findGuide(integration.relatedGuide)).not.toBeNull();
    }
  });

  it("titles the Systeme.io page as the lot asks", () => {
    expect(findIntegration("systeme-io")?.heading).toBe("Témoignages automatiques pour Systeme.io");
    expect(findIntegration("inconnu")).toBeNull();
  });
});

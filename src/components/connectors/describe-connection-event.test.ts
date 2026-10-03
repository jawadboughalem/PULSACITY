import { describe, expect, it } from "vitest";
import type { ConnectionEvent } from "@/lib/connectors/load-connection-overview";
import { describeConnectionEvent } from "./describe-connection-event";

const EVENT: ConnectionEvent = {
  id: "e1",
  receivedAt: new Date("2026-10-03T09:00:00Z"),
  kind: "sale",
  productName: "Programme 30 jours",
  customerName: "Léa M.",
  outcome: "request-scheduled",
  error: null,
  request: { status: "scheduled", scheduledAt: new Date("2026-10-27T09:00:00Z"), sentAt: null },
};

describe("describeConnectionEvent", () => {
  it("writes the lines of maquette 5", () => {
    expect(describeConnectionEvent(EVENT, "Systeme.io")).toEqual({
      label: "Nouvelle vente",
      subject: "Programme 30 jours · Léa M.",
      detail: "Demande d'avis prévue le 27 oct.",
      tone: "success",
      icon: "valid",
      canReplay: false,
    });
    expect(describeConnectionEvent({ ...EVENT, outcome: "awaiting-product", request: null }, "Systeme.io")).toMatchObject({
      detail: "En attente : associez ce produit à une offre",
      tone: "attention",
    });
    expect(
      describeConnectionEvent({ ...EVENT, request: { ...EVENT.request!, status: "cancelled" } }, "Systeme.io"),
    ).toMatchObject({ detail: "Demande d'avis annulée", icon: "cancelled" });
  });

  it("offers « Rejouer » on an event put aside, and only there", () => {
    expect(describeConnectionEvent({ ...EVENT, outcome: null, error: "invalid-signature" }, "Systeme.io")).toMatchObject({
      detail: "Clé secrète différente : gardée de côté. Corrigez la clé dans Systeme.io, puis rejouez la vente.",
      tone: "attention",
      canReplay: true,
    });
    expect(describeConnectionEvent({ ...EVENT, outcome: "duplicate" }, "Systeme.io").canReplay).toBe(false);
  });

  it("names an event it does not read without inventing a sale", () => {
    expect(
      describeConnectionEvent({ ...EVENT, kind: "other", productName: null, customerName: null, outcome: "unsupported" }, "Systeme.io"),
    ).toMatchObject({ label: "Autre événement", subject: "", detail: "Gardé de côté, sans demande d'avis" });
  });
});

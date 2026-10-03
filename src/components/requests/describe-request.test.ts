import { describe, expect, it } from "vitest";
import type { SpaceRequest } from "@/lib/requests/list-space-requests";
import { describeRequest, readRequestStatusFilter } from "./describe-request";

const NOW = new Date("2026-10-03T12:00:00Z");

const REQUEST: SpaceRequest = {
  id: "r1",
  status: "scheduled",
  customerName: "Léa M.",
  customerEmail: "lea@exemple.fr",
  isUnsubscribed: false,
  productName: "Programme 30 jours",
  scheduledAt: new Date("2026-10-27T09:00:00Z"),
  sentAt: null,
  reminderScheduledAt: null,
  reminderSentAt: null,
  completedAt: null,
  cancelledAt: null,
  failedAt: null,
  testimonialId: null,
};

const context = { now: NOW, heldUntil: null };

describe("describeRequest", () => {
  it("says when a planned request leaves", () => {
    expect(describeRequest(REQUEST, context)).toBe("Partira le 27 oct.");
    const due = { ...REQUEST, scheduledAt: new Date("2026-10-01T09:00:00Z") };
    expect(describeRequest(due, context)).toBe("Part au prochain envoi");
  });

  it("says when a request held by the plan's limit leaves", () => {
    const held = { now: NOW, heldUntil: new Date("2026-10-31T23:00:00Z") };
    expect(describeRequest({ ...REQUEST, scheduledAt: new Date("2026-10-06T09:00:00Z") }, held)).toBe(
      "Prévue le 6 oct. · partira le 1er nov.",
    );
    expect(describeRequest({ ...REQUEST, scheduledAt: new Date("2026-11-15T09:00:00Z") }, held)).toBe("Partira le 15 nov.");
  });

  it("follows a request from its sending to the answer", () => {
    const sent = {
      ...REQUEST,
      status: "sent" as const,
      sentAt: new Date("2026-10-03T09:00:00Z"),
      reminderScheduledAt: new Date("2026-10-07T09:00:00Z"),
    };
    expect(describeRequest(sent, context)).toBe("Envoyée le 3 oct. · relance prévue le 7 oct.");
    expect(describeRequest({ ...sent, reminderScheduledAt: null }, context)).toBe("Envoyée le 3 oct. · sans relance");
    expect(
      describeRequest({ ...sent, status: "reminded", reminderSentAt: new Date("2026-10-07T09:00:00Z") }, context),
    ).toBe("Envoyée le 3 oct. · relancée le 7 oct.");
    expect(describeRequest({ ...sent, status: "completed", completedAt: new Date("2026-10-05T09:00:00Z") }, context)).toBe(
      "Avis reçu le 5 oct.",
    );
  });

  it("says when a request was cancelled, or could not leave", () => {
    const cancelled = { ...REQUEST, status: "cancelled" as const, cancelledAt: new Date("2026-09-25T08:00:00Z") };
    expect(describeRequest(cancelled, context)).toBe("Annulée le 25 sept.");
    expect(describeRequest({ ...cancelled, isUnsubscribed: true }, context)).toBe(
      "Annulée le 25 sept. : le client s'est désinscrit.",
    );
    expect(describeRequest({ ...cancelled, cancelledAt: null }, context)).toBe("Annulée");
    expect(describeRequest({ ...REQUEST, status: "failed", failedAt: new Date("2026-10-02T07:45:00Z") }, context)).toBe(
      "Non envoyée le 2 oct., après trois essais. Vérifiez l'adresse e-mail.",
    );
  });
});

describe("readRequestStatusFilter", () => {
  it("reads the status from the address, and nothing else", () => {
    expect(readRequestStatusFilter("planifiees")).toBe("scheduled");
    expect(readRequestStatusFilter(["echecs"])).toBe("failed");
    expect(readRequestStatusFilter("scheduled")).toBeNull();
    expect(readRequestStatusFilter(undefined)).toBeNull();
  });
});

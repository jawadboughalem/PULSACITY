import { describe, expect, it } from "vitest";
import type { SpaceRequest } from "@/lib/requests/list-space-requests";
import { describeRequest, readRequestStatusFilter } from "./describe-request";

const NOW = new Date("2026-10-03T12:00:00Z");

const REQUEST: SpaceRequest = {
  id: "r1",
  status: "scheduled",
  customerName: "Léa M.",
  isUnsubscribed: false,
  productName: "Programme 30 jours",
  scheduledAt: new Date("2026-10-27T09:00:00Z"),
  sentAt: null,
  reminderScheduledAt: null,
  reminderSentAt: null,
  completedAt: null,
};

const context = { now: NOW, isPlanLimitReached: false };

describe("describeRequest", () => {
  it("says when a planned request leaves", () => {
    expect(describeRequest(REQUEST, context)).toBe("Partira le 27 oct.");
    const due = { ...REQUEST, scheduledAt: new Date("2026-10-01T09:00:00Z") };
    expect(describeRequest(due, context)).toBe("Part au prochain envoi");
    expect(describeRequest(due, { now: NOW, isPlanLimitReached: true })).toBe(
      "Partira le mois prochain : limite du plan atteinte",
    );
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
    expect(describeRequest({ ...REQUEST, status: "cancelled", isUnsubscribed: true }, context)).toBe(
      "Annulée : le client s'est désinscrit",
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

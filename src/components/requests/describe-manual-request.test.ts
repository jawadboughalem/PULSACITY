import { describe, expect, it } from "vitest";
import {
  describeEmailGreeting,
  describeEmailReason,
  describeExistingRequest,
  describeInvalidEmail,
} from "./describe-manual-request";

const NOW = new Date("2026-10-05T09:00:00Z");

const EXISTING = {
  status: "reminded" as const,
  scheduledAt: new Date("2026-09-18T08:00:00Z"),
  sentAt: new Date("2026-09-18T08:00:00Z"),
  reminderScheduledAt: new Date("2026-09-22T08:00:00Z"),
  reminderSentAt: new Date("2026-09-22T08:00:00Z"),
  completedAt: null,
  cancelledAt: null,
};

describe("describeInvalidEmail", () => {
  it("says what is missing, with the typed address completed", () => {
    expect(describeInvalidEmail("elodie.v@gmail")).toBe("Il manque la fin de l'adresse, par exemple elodie.v@gmail.com.");
    expect(describeInvalidEmail("elodie.v")).toBe("Il manque le « @ » de l'adresse, par exemple elodie.v@gmail.com.");
    expect(describeInvalidEmail(" ")).toBe("Indiquez l'adresse e-mail de cette personne : c'est là que part la demande.");
    expect(describeInvalidEmail("elodie v@@x")).toBe(
      "Cette adresse e-mail est incomplète. Écrivez-la en entier, par exemple elodie@exemple.fr.",
    );
  });
});

describe("the e-mail, as the form shows it", () => {
  it("greets the customer by first name, or says how it does without", () => {
    expect(describeEmailGreeting("Camille ")).toBe("L'e-mail commence par « Bonjour Camille, ».");
    expect(describeEmailGreeting("")).toBe("L'e-mail commence par « Bonjour Élodie, ». Sans prénom : « Bonjour, ».");
  });

  it("repeats the sentence that says why the customer receives it", () => {
    expect(describeEmailReason("Suivi individuel 3 mois", "Julie Nutrition", new Date("2026-10-02T12:00:00Z"))).toBe(
      "L'e-mail dira : « vous avez acheté Suivi individuel 3 mois auprès de Julie Nutrition le 2 oct. 2026 ».",
    );
    expect(describeEmailReason(null, "Julie Nutrition", null)).toBe(
      "L'e-mail dira : « vous avez acheté [l'offre] auprès de Julie Nutrition le [date] ».",
    );
  });
});

describe("describeExistingRequest", () => {
  it("tells what became of the first request", () => {
    expect(describeExistingRequest(EXISTING, NOW)).toEqual({
      detail:
        "Elle lui a été envoyée le 18 sept., puis relancée le 22 sept. Une seule demande par client et par offre : ainsi, personne ne reçoit plus de deux e-mails.",
      todo: "si cette personne vous a dit vouloir donner son avis, envoyez-lui vous-même votre lien de collecte.",
    });
    expect(
      describeExistingRequest({ ...EXISTING, status: "completed", completedAt: new Date("2026-09-25T08:00:00Z") }, NOW),
    ).toMatchObject({ todo: "rien de plus : son avis vous attend dans Témoignages." });
    expect(describeExistingRequest({ ...EXISTING, status: "scheduled", sentAt: null }, NOW).detail).toMatch(
      /^Elle part au prochain envoi\./,
    );
  });
});

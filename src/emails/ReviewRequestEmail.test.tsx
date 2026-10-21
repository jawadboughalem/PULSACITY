import { writeFileSync } from "node:fs";
import { render } from "react-email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ReviewRequestEmail, type ReviewRequestEmailProps, buildReviewEmailSubject, buildReviewEmailText } from "./ReviewRequestEmail";

const NO_BREAK_SPACE = " ";

const PROPS: Omit<ReviewRequestEmailProps, "kind"> = {
  space: { name: "Julie Nutrition", logoUrl: null, accentColor: null, senderPostalAddress: null },
  firstName: "Camille",
  productName: "Programme 30 jours",
  eventType: "sale",
  purchasedAt: new Date("2026-08-28T10:00:00Z"),
  reviewUrl: "https://pulsacity.com/t/julie-nutrition/programme-30-jours?r=abc",
  unsubscribeUrl: "https://pulsacity.com/desinscription/def",
};

/** The text of an e-mail as read: invisible joiners out, non-breaking spaces as spaces. */
const read = (text: string) => text.replaceAll("⁠", "").replaceAll(NO_BREAK_SPACE, " ");

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulsacity.com");
});

describe("buildReviewEmailSubject", () => {
  it("writes the subjects of maquettes 3.6, without a duration, with or without a first name", () => {
    expect(buildReviewEmailSubject("request", "Camille", "Programme 30 jours")).toBe(
      `Camille, votre avis sur Programme 30 jours${NO_BREAK_SPACE}?`,
    );
    expect(buildReviewEmailSubject("reminder", "Camille", "Programme 30 jours")).toBe(
      `Camille, un mot sur Programme 30 jours${NO_BREAK_SPACE}?`,
    );
    expect(buildReviewEmailSubject("request", null, "Atelier cuisine")).toBe(`Votre avis sur Atelier cuisine${NO_BREAK_SPACE}?`);
  });
});

describe("ReviewRequestEmail", () => {
  it("asks in the creator's name, with the button, its fallback link and the way out", async () => {
    const html = await render(<ReviewRequestEmail kind="request" {...PROPS} />);
    const text = read(await render(<ReviewRequestEmail kind="request" {...PROPS} />, { plainText: true }));
    if (process.env.EMAIL_PREVIEW_DIR) writeFileSync(`${process.env.EMAIL_PREVIEW_DIR}/demande.html`, html);

    expect(text).toContain("Bonjour Camille,");
    expect(text).toContain("Merci d'avoir suivi Programme 30 jours.");
    expect(text).toContain("Une note et quelques mots suffisent.");
    expect(text).toContain("Donner mon avis");
    expect(text).not.toContain("minute");
    expect(text).toContain("Le bouton ne s'affiche pas ? Ouvrez ce lien : https://pulsacity.com/t/julie-nutrition/programme-30-jours?r=abc");
    expect(text).toContain("Merci d'avance,");
    expect(text).toContain("Vous recevez cet e-mail parce que vous avez acheté Programme 30 jours auprès de Julie Nutrition le 28 août 2026.");
    expect(text).toContain("Ne plus recevoir ces e-mails https://pulsacity.com/desinscription/def");
    expect(text).toContain("Envoyé avec PULSACITY pour Julie Nutrition");
    expect(html).toContain(">JN<");
  });

  it("reminds once, without a duration, says it is the last message, and names an enrollment as such", async () => {
    const html = await render(<ReviewRequestEmail kind="reminder" {...PROPS} eventType="enrollment" />);
    const text = read(await render(<ReviewRequestEmail kind="reminder" {...PROPS} eventType="enrollment" />, { plainText: true }));
    if (process.env.EMAIL_PREVIEW_DIR) writeFileSync(`${process.env.EMAIL_PREVIEW_DIR}/relance.html`, html);

    expect(text).toContain("Je reviens vers vous une seule fois, sans insister. Votre avis sur Programme 30 jours m'aiderait beaucoup.");
    expect(text).not.toContain("minute");
    expect(text).toContain("Belle journée,");
    expect(text).toContain("C'est le dernier message à ce sujet. Vous le recevez parce que vous avez rejoint Programme 30 jours");
  });

  it("paints the button in the creator's accent, its text white at 4.5:1, otherwise Encre; Encre without an accent", async () => {
    const button = async (accentColor: string | null) => {
      const html = await render(<ReviewRequestEmail kind="request" {...PROPS} space={{ ...PROPS.space, accentColor }} />);
      return html.match(/<a[^>]*customer-email-button[^>]*style="([^"]*)"/)?.[1] ?? "";
    };

    expect(await button("#4F6F52")).toMatch(/background-color:#4F6F52;color:#FFFFFF/);
    expect(await button("#F2C94C")).toMatch(/background-color:#F2C94C;color:#16213E/);
    expect(await button(null)).toMatch(/background-color:#16213E;color:#FFFFFF/);
  });

  it("writes the sender's postal address on one line at the bottom, when the creator gave it", async () => {
    const address = "Julie Martin\n12 rue des Lilas\n69003 Lyon";
    const space = { ...PROPS.space, senderPostalAddress: address };
    const text = await render(<ReviewRequestEmail kind="request" {...PROPS} space={space} />, { plainText: true });

    expect(text).toContain("Julie Martin · 12 rue des Lilas · 69003 Lyon");
    expect(await render(<ReviewRequestEmail kind="request" {...PROPS} />, { plainText: true })).not.toContain("Lilas");
  });

  it("shows the creator's logo when the space has one", async () => {
    const space = { ...PROPS.space, logoUrl: "https://photos.exemple.fr/logo.png" };
    const html = await render(<ReviewRequestEmail kind="request" {...PROPS} space={space} />);
    expect(html).toContain('src="https://photos.exemple.fr/logo.png"');
  });
});

describe("buildReviewEmailText", () => {
  it("writes the text version by hand, in the order of the e-mail, each link once (maquettes 3.6)", () => {
    const space = { ...PROPS.space, senderPostalAddress: "Julie Martin\n12 rue des Lilas\n69003 Lyon" };
    expect(read(buildReviewEmailText({ kind: "request", ...PROPS, space }))).toBe(
      [
        "Bonjour Camille,",
        "Merci d'avoir suivi Programme 30 jours.",
        "Votre avis compte beaucoup pour moi : il m'aide à progresser, et il aide d'autres personnes à se lancer.",
        "Une note et quelques mots suffisent.",
        "Donner mon avis :\nhttps://pulsacity.com/t/julie-nutrition/programme-30-jours?r=abc",
        "Merci d'avance,\nJulie Nutrition",
        [
          "--",
          "Vous recevez cet e-mail parce que vous avez acheté Programme 30 jours auprès de Julie Nutrition le 28 août 2026.",
          "Ne plus recevoir ces e-mails :\nhttps://pulsacity.com/desinscription/def",
          "Envoyé avec PULSACITY pour Julie Nutrition",
          "Julie Martin · 12 rue des Lilas · 69003 Lyon",
        ].join("\n"),
      ].join("\n\n"),
    );
  });

  it("leaves out the invisible joiner of « e-mail », which an old reader may draw as a box", () => {
    expect(buildReviewEmailText({ kind: "request", ...PROPS })).not.toContain("\u2060");
    expect(buildReviewEmailText({ kind: "request", ...PROPS })).toContain("Ne plus recevoir ces e-mails");
  });

  it("says the reminder is the last message", () => {
    const text = read(buildReviewEmailText({ kind: "reminder", ...PROPS }));
    expect(text).toContain("Belle journée,\nJulie Nutrition");
    expect(text).toContain("C'est le dernier message à ce sujet. Vous le recevez parce que");
    expect(text).not.toContain("·");
  });
});

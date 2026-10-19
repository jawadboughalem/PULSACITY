import { describe, expect, it } from "vitest";
import { BEFORE_SEND_FUNCTION, BEFORE_SEND_SCRIPT } from "./AudienceMeasurement";

type BeforeSend = (type: string, payload: { url: string }) => { url: string } | null;

const loadBeforeSend = (): BeforeSend => {
  const window = { location: { origin: "https://pulsacity.com" } } as Record<string, unknown> & {
    location: { origin: string };
  };
  new Function("window", BEFORE_SEND_SCRIPT)(window);
  return window[BEFORE_SEND_FUNCTION] as BeforeSend;
};

describe("the audience's filter", () => {
  it("counts the public pages, with the source of the visit in their address", () => {
    const beforeSend = loadBeforeSend();
    for (const url of ["/", "/tarifs?utm_source=linkedin", "/inscription?ref=k7m2xq9p", "https://pulsacity.com/guides/x"]) {
      expect(beforeSend("event", { url })).toEqual({ url });
    }
  });

  it("never counts the space, the clients' pages, nor the way out of the e-mails", () => {
    const beforeSend = loadBeforeSend();
    for (const url of ["/app", "/app/temoignages", "/t/julie-nutrition", "/desinscription?etat=accueil", "/espace-supprime"]) {
      expect(beforeSend("event", { url })).toBeNull();
    }
    expect(beforeSend("event", { url: "/tarifs/app" })).toEqual({ url: "/tarifs/app" });
  });
});

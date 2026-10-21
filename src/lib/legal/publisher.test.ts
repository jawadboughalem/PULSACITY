import { afterEach, describe, expect, it, vi } from "vitest";
import { isLegalValidated } from "./is-legal-validated";
import { formatPublisherPostalLine, isLegalPublisherComplete, readLegalPublisher } from "./publisher";

afterEach(() => {
  vi.unstubAllEnvs();
});

const stubPublisher = (name: string, address: string, phone: string) => {
  vi.stubEnv("LEGAL_PUBLISHER_NAME", name);
  vi.stubEnv("LEGAL_PUBLISHER_ADDRESS", address);
  vi.stubEnv("LEGAL_PUBLISHER_PHONE", phone);
};

describe("readLegalPublisher", () => {
  it("reads the three Vercel variables, each on one line", () => {
    stubPublisher(" Julie  Martin ", "12 rue des Lilas\n69003 Lyon", "06 12 34 56 78");
    expect(readLegalPublisher()).toEqual({
      name: "Julie Martin",
      address: "12 rue des Lilas 69003 Lyon",
      phone: "06 12 34 56 78",
    });
  });

  it("says what is missing on a preview without them", () => {
    stubPublisher("Julie Martin", "  ", "");
    expect(readLegalPublisher()).toEqual({ name: "Julie Martin", address: null, phone: null });
    expect(isLegalPublisherComplete()).toBe(false);
    expect(formatPublisherPostalLine()).toBeNull();
  });

  it("writes the sender's line of PULSACITY's e-mails", () => {
    stubPublisher("Julie Martin", "12 rue des Lilas, 69003 Lyon", "06 12 34 56 78");
    expect(formatPublisherPostalLine()).toBe("Julie Martin · 12 rue des Lilas, 69003 Lyon");
  });
});

describe("isLegalValidated", () => {
  it("needs LEGAL_VALIDATED and the whole publisher", () => {
    stubPublisher("Julie Martin", "12 rue des Lilas, 69003 Lyon", "");
    vi.stubEnv("LEGAL_VALIDATED", "true");
    expect(isLegalValidated()).toBe(false);
    vi.stubEnv("LEGAL_PUBLISHER_PHONE", "06 12 34 56 78");
    expect(isLegalValidated()).toBe(true);
    vi.stubEnv("LEGAL_VALIDATED", "false");
    expect(isLegalValidated()).toBe(false);
  });
});

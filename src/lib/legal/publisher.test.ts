import { afterEach, describe, expect, it, vi } from "vitest";
import { isLegalValidated } from "./is-legal-validated";
import { readLegalPublisherName } from "./publisher";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("readLegalPublisherName", () => {
  it("reads the Vercel variable on one line", () => {
    vi.stubEnv("LEGAL_PUBLISHER_NAME", " Julie \n Martin ");
    expect(readLegalPublisherName()).toBe("Julie Martin");
  });

  it("gives nothing on a preview without it", () => {
    vi.stubEnv("LEGAL_PUBLISHER_NAME", "  ");
    expect(readLegalPublisherName()).toBeNull();
  });
});

describe("isLegalValidated", () => {
  it("needs LEGAL_VALIDATED and the publisher's name", () => {
    vi.stubEnv("LEGAL_VALIDATED", "true");
    vi.stubEnv("LEGAL_PUBLISHER_NAME", "");
    expect(isLegalValidated()).toBe(false);
    vi.stubEnv("LEGAL_PUBLISHER_NAME", "Julie Martin");
    expect(isLegalValidated()).toBe(true);
    vi.stubEnv("LEGAL_VALIDATED", "false");
    expect(isLegalValidated()).toBe(false);
  });
});

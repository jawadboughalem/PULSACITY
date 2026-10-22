import { afterEach, describe, expect, it, vi } from "vitest";
import { isLegalValidated } from "./is-legal-validated";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isLegalValidated", () => {
  it("follows LEGAL_VALIDATED alone: the texts name no one", () => {
    vi.stubEnv("LEGAL_VALIDATED", "true");
    expect(isLegalValidated()).toBe(true);
    vi.stubEnv("LEGAL_VALIDATED", "false");
    expect(isLegalValidated()).toBe(false);
    vi.stubEnv("LEGAL_VALIDATED", "");
    expect(isLegalValidated()).toBe(false);
  });
});

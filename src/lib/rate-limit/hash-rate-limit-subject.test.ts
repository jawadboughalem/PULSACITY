import { afterEach, describe, expect, it, vi } from "vitest";
import { MissingEnvironmentVariableError } from "@/lib/environment/missing-environment-variable-error";
import { hashRateLimitSubject } from "./hash-rate-limit-subject";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("hashRateLimitSubject", () => {
  it("never stores the address itself, and ignores case and spaces", () => {
    vi.stubEnv("BETTER_AUTH_SECRET", "a-test-secret-of-at-least-32-characters");

    const hashed = hashRateLimitSubject("Camille@Exemple.fr ");

    expect(hashed).not.toContain("camille");
    expect(hashed).toBe(hashRateLimitSubject("camille@exemple.fr"));
  });

  it("depends on the secret, so a stolen table cannot be reversed by brute force", () => {
    vi.stubEnv("BETTER_AUTH_SECRET", "a-test-secret-of-at-least-32-characters");
    const withFirstSecret = hashRateLimitSubject("203.0.113.7");
    vi.stubEnv("BETTER_AUTH_SECRET", "another-test-secret-of-32-characters");

    expect(hashRateLimitSubject("203.0.113.7")).not.toBe(withFirstSecret);
  });

  it("refuses to run without the secret", () => {
    vi.stubEnv("BETTER_AUTH_SECRET", "");

    expect(() => hashRateLimitSubject("203.0.113.7")).toThrow(MissingEnvironmentVariableError);
  });
});

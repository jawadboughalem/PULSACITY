import { describe, expect, it } from "vitest";
import { expandSignInLink, shortenSignInLink } from "./sign-in-link";

const verify = (newUser: string) =>
  `https://pulsacity.com/api/auth/magic-link/verify?token=AbC123&callbackURL=%2Fapp&newUserCallbackURL=${encodeURIComponent(newUser)}&errorCallbackURL=%2Fconnexion`;

describe("shortenSignInLink", () => {
  it("writes the link of /connexion without technical words", () => {
    expect(shortenSignInLink(verify("/app/onboarding"))).toBe("https://pulsacity.com/entrer/AbC123");
  });

  it("keeps the source of a sign-up in the address (lot 4.12)", () => {
    expect(shortenSignInLink(verify("/app/onboarding?utm_source=linkedin&connu=groupe"))).toBe(
      "https://pulsacity.com/entrer/AbC123?utm_source=linkedin&connu=groupe",
    );
  });

  it("leaves any other link as Better Auth wrote it", () => {
    const other = "https://pulsacity.com/api/auth/magic-link/verify?token=AbC123&callbackURL=%2Fapp%2Fcompte";
    expect(shortenSignInLink(other)).toBe(other);
    expect(shortenSignInLink(verify("https://ailleurs.example/app/onboarding"))).toBe(
      verify("https://ailleurs.example/app/onboarding"),
    );
  });
});

describe("expandSignInLink", () => {
  it("gives Better Auth back its link, with the destinations of /connexion", () => {
    const shortened = new URL(shortenSignInLink(verify("/app/onboarding?utm_source=linkedin")));
    const expanded = new URL(expandSignInLink(shortened.origin, "AbC123", shortened.search));

    expect(expanded.pathname).toBe("/api/auth/magic-link/verify");
    expect(Object.fromEntries(expanded.searchParams)).toEqual({
      token: "AbC123",
      callbackURL: "/app",
      newUserCallbackURL: "/app/onboarding?utm_source=linkedin",
      errorCallbackURL: "/connexion",
    });
  });
});

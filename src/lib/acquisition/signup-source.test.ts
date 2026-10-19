import { describe, expect, it } from "vitest";
import { readHeardFrom, readSignupSource, withSignupSource } from "./signup-source";

describe("readSignupSource", () => {
  it("keeps the UTM words and the referral code of an address, nothing else", () => {
    const parameters = new URLSearchParams(
      "utm_source=facebook&utm_medium=groupe&utm_campaign=lancement&ref=Julie42ab&email=julie@exemple.fr&plan=pro",
    );

    expect(readSignupSource(parameters)).toEqual({
      utm_source: "facebook",
      utm_medium: "groupe",
      utm_campaign: "lancement",
      ref: "julie42ab",
    });
  });

  it("leaves out empty values and referral codes that cannot be one", () => {
    expect(readSignupSource(new URLSearchParams("utm_source=%20%20&ref=<script>&utm_term="))).toEqual({});
  });

  it("cleans a value: control characters out, spaces collapsed, 100 characters at most", () => {
    const long = "a".repeat(140);

    expect(readSignupSource({ utm_campaign: "  rentrée\n\t2026  ", utm_content: long })).toEqual({
      utm_campaign: "rentrée 2026",
      utm_content: "a".repeat(100),
    });
  });

  it("reads a form, as the sign-up and the space forms send the source in hidden fields", () => {
    const form = new FormData();
    form.set("utm_source", "linkedin");
    form.set("email", "julie@exemple.fr");

    expect(readSignupSource(form)).toEqual({ utm_source: "linkedin" });
  });
});

describe("readHeardFrom", () => {
  it("knows only the answers of the list", () => {
    expect(readHeardFrom(new URLSearchParams("connu=badge"))).toBe("badge");
    expect(readHeardFrom(new URLSearchParams("connu=tiktok"))).toBeNull();
    expect(readHeardFrom({})).toBeNull();
  });
});

describe("withSignupSource", () => {
  it("adds the source to an address, keeping its own words and anchor", () => {
    expect(withSignupSource("/app/facturation/payer?plan=essentiel#paiement", { utm_source: "youtube", ref: "abc123" })).toBe(
      "/app/facturation/payer?plan=essentiel&utm_source=youtube&ref=abc123#paiement",
    );
  });

  it("adds the answer to the question", () => {
    expect(withSignupSource("/app/onboarding", { utm_source: "linkedin" }, "linkedin")).toBe(
      "/app/onboarding?utm_source=linkedin&connu=linkedin",
    );
  });

  it("leaves an address alone without a source", () => {
    expect(withSignupSource("/inscription", {})).toBe("/inscription");
  });
});

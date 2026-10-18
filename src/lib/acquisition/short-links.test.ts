import { describe, expect, it } from "vitest";
import { resolveShortLink } from "./short-links";

describe("resolveShortLink", () => {
  it("leads a channel's link to the home page with its UTM words", () => {
    expect(resolveShortLink("linkedin")).toBe("/?utm_source=linkedin&utm_medium=social&utm_campaign=linkedin");
  });

  it("can lead elsewhere than the home page", () => {
    expect(resolveShortLink("tarifs")).toBe("/tarifs?utm_source=lien-court&utm_medium=lien&utm_campaign=tarifs");
  });

  it("turns any other word into a campaign, without a new delivery", () => {
    expect(resolveShortLink("Marie-Coach")).toBe("/?utm_source=lien-court&utm_medium=lien&utm_campaign=marie-coach");
  });

  it("leads a word that cannot be a campaign to the home page, without a source", () => {
    expect(resolveShortLink("<script>")).toBe("/");
    expect(resolveShortLink("constructor")).toBe("/?utm_source=lien-court&utm_medium=lien&utm_campaign=constructor");
  });
});

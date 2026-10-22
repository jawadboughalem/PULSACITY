import { describe, expect, it } from "vitest";
import { listPublicTextFiles, readTexts } from "./public-texts";

/**
 * The legal texts, and every public page, speak as « l'équipe PULSACITY » (22 October 2026): no one's name, and not a
 * word on the absence of a company. The day of the micro-entreprise (lot 6.6) rewrites them.
 */
const PERSONAL_STATUS =
  /personne physique|exploitant|immatricul|sans entreprise|micro-entreprise|entrepreneur individuel|une seule personne|LEGAL_PUBLISHER/i;

describe("the voice of the legal texts and the public pages", () => {
  it("names no one and says nothing of a company", () => {
    const lines = listPublicTextFiles().flatMap((path) =>
      readTexts(path)
        .filter((text) => PERSONAL_STATUS.test(text))
        .map((text) => `${path}: ${text}`),
    );
    expect(lines).toEqual([]);
  });
});

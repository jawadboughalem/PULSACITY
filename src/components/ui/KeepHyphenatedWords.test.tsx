import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { KeepHyphenatedWords } from "./KeepHyphenatedWords";

const render = (text: string) => renderToStaticMarkup(<KeepHyphenatedWords text={text} />);

describe("KeepHyphenatedWords", () => {
  it("keeps each hyphenated word on one line, with its punctuation", () => {
    expect(render("Non envoyée après trois essais. Vérifiez l'adresse e-mail.")).toBe(
      'Non envoyée après trois essais. Vérifiez l&#x27;adresse <span class="whitespace-nowrap">e-mail.</span>',
    );
    expect(render("Vérifiez-la, puis réessayez.")).toBe(
      '<span class="whitespace-nowrap">Vérifiez-la,</span> puis réessayez.',
    );
  });

  it("leaves a text without hyphenated words as it is", () => {
    expect(render("Envoyée le 2 oct. · sans relance")).toBe("Envoyée le 2 oct. · sans relance");
  });
});

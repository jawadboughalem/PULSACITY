import { describe, expect, it } from "vitest";
import { listPublicTextFiles, readTexts } from "./public-texts";

/**
 * A place where a line can break and should not: a space before « ? ! : ; », after « « » or before « » », and the
 * hyphen of « e-mail », which takes a word joiner (U+2060, invisible) after it.
 */
const BREAKABLE = / (?=[?!:;](?:\s|$|[»"'’)\]}]))|« | »|\b[eE]-(?!\u2060)mails?\b/;

describe("French spacing of the public site", () => {
  it("never lets a « ? », a « : » or a guillemet start a line alone, nor « e-mail » break in two", () => {
    const breakable = listPublicTextFiles().flatMap((path) =>
      readTexts(path)
        .filter((text) => BREAKABLE.test(text))
        .map((text) => `${path}: ${text.trim().slice(0, 80)}`),
    );
    expect(breakable).toEqual([]);
  });
});

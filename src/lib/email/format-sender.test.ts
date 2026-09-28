import { describe, expect, it } from "vitest";
import { formatSender } from "./format-sender";

describe("formatSender", () => {
  it("quotes the display name, so a comma in a space name stays in the name", () => {
    expect(formatSender("Julie, coach", "notifications@envois.pulsacity.com")).toBe(
      '"Julie, coach" <notifications@envois.pulsacity.com>',
    );
  });

  it("escapes quotes and backslashes, and cannot open a new header line", () => {
    expect(formatSender('Le "vrai"\\ studio\r\nBcc: victime@exemple.fr', "a@b.fr")).toBe(
      '"Le \\"vrai\\"\\\\ studio Bcc: victime@exemple.fr" <a@b.fr>',
    );
  });
});

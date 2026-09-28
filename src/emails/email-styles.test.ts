import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { EMAIL_COLORS } from "./email-styles";

const charter = readFileSync(new URL("../../docs-internes/charte.md", import.meta.url), "utf8");

const charterColors = () => {
  const start = charter.indexOf("## Couleurs\n");
  const end = charter.indexOf("\n## ", start + 1);
  return new Set(charter.slice(start, end).match(/#[0-9A-F]{6}/g));
};

describe("EMAIL_COLORS", () => {
  it("only uses colours of the charter, since e-mails cannot read the stylesheet", () => {
    const colors = charterColors();

    for (const color of Object.values(EMAIL_COLORS)) {
      expect(colors).toContain(color);
    }
  });
});

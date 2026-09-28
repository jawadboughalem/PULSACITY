import { readFileSync } from "node:fs";
import { assert, describe, expect, it } from "vitest";

const charter = readFileSync(new URL("../../docs-internes/charte.md", import.meta.url), "utf8");
const stylesheet = readFileSync(new URL("./globals.css", import.meta.url), "utf8");

const COLOR_TOKENS: Record<string, string> = {
  "Carmin (accent)": "carmine",
  "Carmin foncé": "carmine-dark",
  "Carmin clair": "carmine-light",
  "Encre 900": "ink-900",
  "Encre 800": "ink-800",
  "Ardoise 600": "slate-600",
  "Gris 400": "gray-400",
  "Filet 200": "hairline-200",
  "Papier 100": "paper-100",
  Blanc: "white",
  Succès: "success",
  "Succès fond": "success-surface",
  Attention: "attention",
  "Attention fond": "attention-surface",
  Erreur: "error",
  "Erreur fond": "error-surface",
  "Widget sombre — carte": "widget-dark-card",
  "Widget sombre — trait": "widget-dark-line",
  "Widget sombre — texte": "widget-dark-text",
  "Widget sombre — secondaire": "widget-dark-muted",
};

const RADIUS_TOKENS: Record<string, string> = {
  "radius-s": "sm",
  "radius-l": "lg",
  "radius-full": "full",
};

const WEIGHT_TOKENS: Record<string, string> = { "400": "normal", "500": "medium", "600": "semibold" };

function section(title: string): string {
  const start = charter.indexOf(`## ${title}\n`);
  assert(start !== -1, `Charter section "${title}" not found`);
  const end = charter.indexOf("\n## ", start + 1);
  return charter.slice(start, end === -1 ? undefined : end);
}

function rows(title: string): string[][] {
  return section(title)
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .slice(2)
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
}

function match(text: string, pattern: RegExp): RegExpMatchArray {
  const found = text.match(pattern);
  assert(found, `No longer matches ${pattern}`);
  return found;
}

type Tokens = Record<string, string>;

function charterTokens(): { theme: Tokens; desktop: Tokens } {
  const theme: Tokens = {};
  const desktop: Tokens = {};

  for (const [name, width] of rows("Point de rupture")) {
    theme[`breakpoint-${name}`] = `${width}px`;
  }

  for (const [name, hex] of rows("Couleurs")) {
    const token = COLOR_TOKENS[name];
    assert(token, `Charter colour "${name}" has no token`);
    theme[`color-${token}`] = hex;
  }

  for (const [, , , weights] of rows("Typographie")) {
    for (const weight of weights.match(/\b[4-6]00\b/g) ?? []) {
      theme[`font-weight-${WEIGHT_TOKENS[weight]}`] = weight;
    }
  }
  const typography = section("Typographie");
  theme["tracking-title"] = `-0.${match(typography, /grand titre \(−0,(\d+)\s*em\)/)[1]}em`;
  const [, text, quote] = match(typography, /texte\s+(\d+)ch maximum, citations\s+(\d+)ch maximum/);
  theme["container-text"] = `${text}ch`;
  theme["container-quote"] = `${quote}ch`;

  for (const [name, size, lineHeight, usage] of rows("Échelle de tailles")) {
    const mobile = usage.match(/Mobile\s*:\s*(\d+)\/(\d+)/);
    theme[`text-${name}`] = `${mobile ? mobile[1] : size}px`;
    theme[`text-${name}--line-height`] = `${mobile ? mobile[2] : lineHeight}px`;
    if (mobile) {
      desktop[`text-${name}`] = `${size}px`;
      desktop[`text-${name}--line-height`] = `${lineHeight}px`;
    }
  }
  const logo = match(section("Échelle de tailles"), /propres tailles \(([\d,\s]+?)\s*px\).*interligne\s+(\d+)/);
  for (const size of logo[1].split(/,\s*/)) {
    theme[`text-logo-${size}`] = `${size}px`;
    theme[`text-logo-${size}--line-height`] = logo[2];
  }

  for (const [name, size] of rows("Espacements")) {
    const token = `spacing-${name.replace(/^space-/, "").replace(/-(mobile|desktop)$/, "")}`;
    (name.endsWith("-desktop") ? desktop : theme)[token] = `${size}px`;
  }

  for (const [name, size] of rows("Rayons")) {
    theme[`radius-${RADIUS_TOKENS[name]}`] = `${size}px`;
  }

  for (const [name, value] of rows("Ombres")) {
    theme[name] = value;
  }

  return { theme, desktop };
}

function declarations(block: string): Tokens {
  return Object.fromEntries(
    [...block.matchAll(/--([a-z0-9-]+): ([^;]+);/g)].map(([, name, value]) => [name, value]),
  );
}

describe("theme", () => {
  const expected = charterTokens();

  it("declares every value of the charter, and nothing else", () => {
    expect(declarations(match(stylesheet, /@theme \{([\s\S]*?)\n\}/)[1])).toEqual(expected.theme);
  });

  it("switches to the desktop values of the charter at its breakpoint", () => {
    const desktopBlock = match(stylesheet, /@variant desktop \{([\s\S]*?)\n\s*\}/)[1];
    expect(declarations(desktopBlock)).toEqual(expected.desktop);
  });

  it("starts from an empty Tailwind theme", () => {
    expect(stylesheet).toMatch(/@theme \{\n\s+--\*: initial;/);
  });
});

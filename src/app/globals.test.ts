import { readFileSync } from "node:fs";
import { assert, describe, expect, it } from "vitest";

const charter = readFileSync(new URL("../../docs-internes/design-v2/charte.md", import.meta.url), "utf8");
const stylesheet = readFileSync(new URL("./globals.css", import.meta.url), "utf8");
const motion = readFileSync(new URL("./pulsacity-motion.css", import.meta.url), "utf8");
const designMotion = readFileSync(
  new URL("../../docs-internes/design-v2/identite/logo/code/pulsacity-motion.css", import.meta.url),
  "utf8",
);

const COLOR_TOKENS: Record<string, string> = {
  Soleil: "sun",
  "Soleil survol": "sun-hover",
  "Soleil appui": "sun-pressed",
  Corail: "coral",
  Encre: "ink",
  "Encre 800": "ink-800",
  Gris: "gray",
  Givre: "frost",
  Blanc: "white",
  Nuage: "cloud",
  Ciel: "sky",
  "Ciel appui": "sky-pressed",
  "Gris clair": "gray-light",
  "Bord désactivé": "disabled-border",
  Pousse: "success",
  "Pousse fond": "success-surface",
  Attente: "waiting",
  "Attente fond": "waiting-surface",
  Erreur: "error",
  "Erreur survol": "error-hover",
  "Erreur fond": "error-surface",
  Voile: "veil",
  "Widget clair — carte": "widget-light-card",
  "Widget sombre — carte": "widget-dark-card",
  "Widget sombre — trait": "widget-dark-line",
  "Widget sombre — texte": "widget-dark-text",
  "Widget sombre — secondaire": "widget-dark-muted",
  "Étoile vide du widget": "widget-star-empty",
};

const SIZE_TOKENS: Record<string, string> = { chiffre: "figure" };

const SPACING_TOKENS: Record<string, string> = {
  "page-gutter-mobile": "spacing-page-gutter",
  "content-max": "container-content",
  "nav-espace-desktop": "spacing-space-nav",
  "tab-bar-mobile": "spacing-tab-bar",
};

const WEIGHT_TOKENS: Record<string, string> = { "400": "normal", "600": "semibold", "700": "bold", "800": "extrabold" };

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

/** « −0,035 em » → « -0.035em ». */
const toEm = (frenchEm: string) => `-${frenchEm.replace(",", ".")}em`;

type Tokens = Record<string, string>;

function charterTokens(): { theme: Tokens; desktop: Tokens } {
  const theme: Tokens = {};
  const desktop: Tokens = {};

  for (const [name, width] of rows("Point de rupture")) {
    theme[`breakpoint-${name}`] = `${width}px`;
  }

  for (const [name, value] of rows("Couleurs")) {
    const token = COLOR_TOKENS[name];
    assert(token, `Charter colour "${name}" has no token`);
    theme[`color-${token}`] = value;
  }

  for (const [, , , weights] of rows("Typographie")) {
    for (const weight of weights.match(/\b[4-8]00\b/g) ?? []) {
      const token = WEIGHT_TOKENS[weight];
      assert(token, `Charter weight ${weight} has no token`);
      theme[`font-weight-${token}`] = weight;
    }
  }
  const [, text, quote] = match(section("Typographie"), /texte\s+(\d+)ch maximum, citations\s+(\d+)ch maximum/);
  theme["container-text"] = `${text}ch`;
  theme["container-quote"] = `${quote}ch`;

  for (const [name, size, lineHeight, usage] of rows("Échelle de tailles")) {
    const token = `text-${SIZE_TOKENS[name] ?? name}`;
    const tracking = usage.match(/Bricolage 800, −(\d,\d+)\s*em\)/);
    const mobile = usage.match(/Mobile\s*:\s*(\d+)\/(\d+)(?:, −(\d,\d+)\s*em)?/);
    theme[token] = `${mobile ? mobile[1] : size}px`;
    theme[`${token}--line-height`] = `${mobile ? mobile[2] : lineHeight}px`;
    if (tracking) theme[`${token}--letter-spacing`] = toEm(mobile?.[3] ?? tracking[1]);
    if (usage.includes("Bricolage 800")) theme[`${token}--font-weight`] = "800";
    if (mobile) {
      desktop[token] = `${size}px`;
      desktop[`${token}--line-height`] = `${lineHeight}px`;
      if (tracking && mobile[3]) desktop[`${token}--letter-spacing`] = toEm(tracking[1]);
    }
  }

  for (const [name, size] of rows("Espacements")) {
    if (name === "page-gutter-desktop") {
      desktop["spacing-page-gutter"] = `${size}px`;
      continue;
    }
    const token = SPACING_TOKENS[name] ?? `spacing-${name.replace(/^space-/, "")}`;
    theme[token] = `${match(size, /^\d+/)[0]}px`;
  }

  for (const [name, size] of rows("Rayons")) {
    theme[name] = `${size}px`;
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

  it("keeps the motion tokens and keyframes of Design as delivered", () => {
    expect(motion).toBe(designMotion);
  });
});

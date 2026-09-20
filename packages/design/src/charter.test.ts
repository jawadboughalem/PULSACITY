/**
 * Rule 10, as a test.
 *
 * "Le design ne se change qu'en changeant les jetons. Aucune couleur, aucune
 * taille de police codée en dur dans un composant."
 *
 * A rule nobody can break by accident is worth more than a rule everyone
 * remembers. This file holds four of them:
 *
 *   1. no colour literal in a component, and none outside the palette in the two
 *      files whose runtime cannot read CSS;
 *   2. every custom property a component names is declared here;
 *   3. every palette utility class resolves to a real token;
 *   4. every contrast pair the charter publishes still clears its floor, and
 *      still matches the figure printed in docs/design/brand.md.
 *
 * The fourth is the one that matters: it turns the charter into something that
 * fails `pnpm test` rather than something that ages quietly.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { contrastRatio, floorToHundredth, isInGamut, parseOklch, toHex } from './contrast';
import { colourFamilies, colourNames, readTokens, resolve } from './stylesheet';

const repoRoot = fileURLToPath(new URL('../../../', import.meta.url));
const tokens = readTokens();

const SCANNED_ROOTS = ['apps/corporate/src', 'packages/templates/src'];
const SCANNED_EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.svg']);

/**
 * The one file still holding colour literals: a favicon is a standalone document
 * with no stylesheet. It is generated from the tokens by `pnpm brand:assets`, and
 * the check below is what catches a palette change that was never regenerated.
 *
 * The OG image is no longer here — it reads `HEX` from `tokens.ts` and has no
 * literal left to check.
 */
const MIRRORS = ['apps/corporate/src/app/icon.svg'];

/** Set by `next/font`, so never declared in the stylesheet. */
const EXTERNAL_PROPERTIES = new Set(['--font-manrope', '--font-fraunces']);

const COLOUR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab)\(/g;
const HEX_LITERAL = /#[0-9a-fA-F]{3,8}\b/g;
/** A literal followed by the token it claims to mirror: `'#171310'; // --color-ink`. */
const ANNOTATED_LITERAL = /(#[0-9a-fA-F]{3,8})\b[^\n]*?\/\/\s*(--[a-z-]+)/g;

function walk(directory: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...walk(path));
    else if (SCANNED_EXTENSIONS.has(extname(entry.name))) found.push(path);
  }
  return found;
}

const scannedFiles = SCANNED_ROOTS.flatMap((root) => walk(join(repoRoot, root))).map((path) =>
  relative(repoRoot, path).split('\\').join('/'),
);

const read = (path: string) => readFileSync(join(repoRoot, path), 'utf8');

/** Colour literals only: `#realisations` and `#faq` are not three hex digits. */
const colourLiterals = (source: string): string[] =>
  (source.match(HEX_LITERAL) ?? []).filter((literal) => [4, 5, 7, 9].includes(literal.length));

const oklchOf = (value: string | undefined, label: string) => {
  const parsed = value === undefined ? null : parseOklch(value);
  if (!parsed) throw new Error(`${label} is not declared as an oklch() colour (got: ${value})`);
  return parsed;
};

interface Pair {
  readonly fg: string;
  readonly bg: string;
  readonly floor: number;
  readonly usage: string;
}

/** Floors: 4.5 for text, 3 for a control boundary and for a meaningful fill. */
const ON_PAPER: Pair[] = [
  { fg: 'ink', bg: 'ground', floor: 4.5, usage: 'Titres et texte courant' },
  { fg: 'ink-muted', bg: 'ground', floor: 4.5, usage: 'Texte secondaire' },
  { fg: 'ink-faint', bg: 'ground', floor: 4.5, usage: 'Métadonnées, aide de saisie' },
  { fg: 'ink', bg: 'surface', floor: 4.5, usage: 'Texte sur une carte' },
  { fg: 'ink-muted', bg: 'surface', floor: 4.5, usage: 'Secondaire sur une carte' },
  { fg: 'ink-faint', bg: 'surface', floor: 4.5, usage: 'Texte de substitution' },
  { fg: 'ink', bg: 'surface-sunken', floor: 4.5, usage: 'Le bloc prix' },
  { fg: 'ink-muted', bg: 'surface-sunken', floor: 4.5, usage: 'Le bloc prix, secondaire' },
  { fg: 'accent-foreground', bg: 'accent', floor: 4.5, usage: 'Libellé du bouton plein' },
  { fg: 'accent-foreground', bg: 'accent-hover', floor: 4.5, usage: 'Bouton plein, au survol' },
  { fg: 'accent-ink', bg: 'ground', floor: 4.5, usage: 'Lien corail' },
  { fg: 'accent-ink', bg: 'surface', floor: 4.5, usage: 'Lien sur une carte' },
  { fg: 'accent-ink', bg: 'accent-soft', floor: 4.5, usage: 'Badge « En préparation »' },
  { fg: 'danger', bg: 'ground', floor: 4.5, usage: "Message d'erreur" },
  { fg: 'success', bg: 'ground', floor: 4.5, usage: "Message d'envoi" },
  { fg: 'line-strong', bg: 'ground', floor: 3, usage: 'Bordure de champ, de case, de bouton' },
  { fg: 'line-strong', bg: 'surface', floor: 3, usage: 'Bordure de champ sur une carte' },
  { fg: 'line-strong', bg: 'surface-sunken', floor: 3, usage: "Bordure dans l'encart prix" },
  { fg: 'accent', bg: 'ground', floor: 3, usage: 'Surface du bouton plein' },
  { fg: 'surface-inverted', bg: 'ground', floor: 3, usage: 'Le bloc encré sur le papier' },
];

const ON_INK: Pair[] = [
  { fg: 'ink', bg: 'ground', floor: 4.5, usage: "Titre sur l'encre" },
  { fg: 'ink-muted', bg: 'ground', floor: 4.5, usage: 'Texte secondaire' },
  { fg: 'ink-faint', bg: 'ground', floor: 4.5, usage: 'Métadonnées' },
  { fg: 'accent-ink', bg: 'ground', floor: 4.5, usage: "Lien corail sur l'encre" },
  { fg: 'accent-foreground', bg: 'accent', floor: 4.5, usage: 'Libellé du bouton plein' },
  { fg: 'ink', bg: 'surface', floor: 4.5, usage: 'Texte sur une carte' },
  { fg: 'accent-ink', bg: 'accent-soft', floor: 4.5, usage: "Badge sur l'encre" },
  { fg: 'danger', bg: 'ground', floor: 4.5, usage: 'Erreur' },
  { fg: 'success', bg: 'ground', floor: 4.5, usage: 'Envoi confirmé' },
  { fg: 'accent', bg: 'ground', floor: 3, usage: 'Surface du bouton plein' },
  { fg: 'line-strong', bg: 'ground', floor: 3, usage: 'Bordure de contrôle' },
];

const measure = (pair: Pair, onInk: boolean) =>
  floorToHundredth(
    contrastRatio(
      oklchOf(resolve(tokens, `--color-${pair.fg}`, onInk), pair.fg),
      oklchOf(resolve(tokens, `--color-${pair.bg}`, onInk), pair.bg),
    ),
  );

/** The ratios printed in the charter, read back out of it, keyed `fg on bg`. */
function publishedRatios(): { paper: Map<string, number>; ink: Map<string, number> } {
  const markdown = read('docs/design/brand.md');
  const split = markdown.indexOf('**Sur encre**');
  expect(split, 'docs/design/brand.md no longer has a "Sur encre" table').toBeGreaterThan(-1);

  const collect = (section: string) => {
    const rows = new Map<string, number>();
    const row = /^\|\s*`([a-z-]+)`\s+sur\s+`([a-z-]+)`\s*\|\s*([\d,]+):1\s*\|/gm;
    for (const [, fg, bg, ratio] of section.matchAll(row)) {
      // A missing group would read back as NaN, and every comparison against NaN
      // is false — which would make this whole check quietly vacuous.
      if (ratio === undefined) continue;
      rows.set(`${fg} on ${bg}`, Number(ratio.replace(',', '.')));
    }
    return rows;
  };

  return { paper: collect(markdown.slice(0, split)), ink: collect(markdown.slice(split)) };
}

describe('the palette is renderable', () => {
  it('declares every colour as an oklch() value', () => {
    for (const name of [...colourNames(tokens.base), ...colourNames(tokens.inverted)]) {
      const value = tokens.inverted[name] ?? tokens.base[name];
      expect(parseOklch(value ?? ''), `${name} is not an oklch() colour`).not.toBeNull();
    }
  });

  it('keeps every colour inside the sRGB gamut', () => {
    // Outside it the browser clips, so the declared colour is not the painted
    // one — and no measurement taken from the file would be true.
    const clipped = [...colourNames(tokens.base), ...colourNames(tokens.inverted)]
      .map((name) => ({ name, colour: oklchOf(tokens.inverted[name] ?? tokens.base[name], name) }))
      .filter(({ colour }) => !isInGamut(colour))
      .map(({ name }) => name);

    expect(clipped).toEqual([]);
  });

  it('never redeclares the filled button between the two surfaces', () => {
    // The button is one object; only what sits around it changes.
    for (const name of ['--color-accent', '--color-accent-hover', '--color-accent-foreground']) {
      expect(tokens.inverted[name], `${name} must not be redeclared on ink`).toBeUndefined();
    }
  });

  it('changes no colour at the desktop breakpoint', () => {
    expect(colourNames(tokens.desktop)).toEqual([]);
  });
});

describe('the breakpoint actually applies', () => {
  it('never nests @theme inside an at-rule', () => {
    // Tailwind flattens a nested `@theme`: the last declaration wins and is
    // emitted unconditionally, so a responsive override written that way
    // silently *replaces* the mobile value instead of overriding it at the
    // breakpoint. V0 shipped exactly that, and every mobile title rendered at
    // its desktop size. The override has to be a plain `:root`, which works
    // because utilities compile to `var(--text-display)`.
    const nested = tokens.blocks
      .filter((block) => block.path.length > 1 && block.path.at(-1) === '@theme')
      .map((block) => block.path.join(' > '));

    expect(nested).toEqual([]);
  });

  it('only overrides tokens that already exist', () => {
    // A typo in the breakpoint would declare a variable nothing reads, and the
    // mobile value would quietly stand at every width.
    const unknown = Object.keys(tokens.desktop).filter((name) => !(name in tokens.base));

    expect(unknown).toEqual([]);
  });

  it('carries a distinct mobile and desktop value for every size it overrides', () => {
    const identical = Object.entries(tokens.desktop)
      .filter(([name, value]) => tokens.base[name] === value)
      .map(([name]) => name);

    expect(identical).toEqual([]);
  });
});

describe('contrast', () => {
  it.each(ON_PAPER)('on paper: $fg on $bg clears $floor:1 — $usage', (pair) => {
    expect(measure(pair, false)).toBeGreaterThanOrEqual(pair.floor);
  });

  it.each(ON_INK)('on ink: $fg on $bg clears $floor:1 — $usage', (pair) => {
    expect(measure(pair, true)).toBeGreaterThanOrEqual(pair.floor);
  });

  it('matches every ratio printed in docs/design/brand.md', () => {
    const published = publishedRatios();
    const drifted: string[] = [];

    const check = (pairs: Pair[], onInk: boolean, table: Map<string, number>, label: string) => {
      for (const pair of pairs) {
        const key = `${pair.fg} on ${pair.bg}`;
        const documented = table.get(key);
        const measured = measure(pair, onInk);
        if (documented === undefined) drifted.push(`${label}: ${key} is missing from the charter`);
        else if (Math.abs(documented - measured) > 0.005)
          drifted.push(`${label}: ${key} — charter says ${documented}, tokens give ${measured}`);
      }
    };

    check(ON_PAPER, false, published.paper, 'sur papier');
    check(ON_INK, true, published.ink, 'sur encre');

    expect(drifted).toEqual([]);
  });
});

describe('rule 10 — no look outside the tokens', () => {
  it('finds the files it is supposed to guard', () => {
    // A silent empty scan would make every assertion below vacuously true.
    expect(scannedFiles.length).toBeGreaterThan(20);
    for (const mirror of MIRRORS) expect(statSync(join(repoRoot, mirror)).isFile()).toBe(true);
  });

  it('leaves no colour literal in a component', () => {
    const offenders = scannedFiles
      .filter((path) => !MIRRORS.includes(path))
      .flatMap((path) => (read(path).match(COLOUR_LITERAL) ?? []).map((hit) => `${path}: ${hit}`));

    expect(offenders).toEqual([]);
  });

  it('keeps the two mirrored files inside the palette', () => {
    // Both contexts count: the icon is an inked surface, so it legitimately
    // carries the inverted ink rather than the one used on paper.
    const palette = new Set([
      ...colourNames(tokens.base).map((name) => toHex(oklchOf(tokens.base[name], name))),
      ...colourNames(tokens.inverted).map((name) => toHex(oklchOf(tokens.inverted[name], name))),
    ]);

    const strays = MIRRORS.flatMap((path) =>
      colourLiterals(read(path))
        .filter((literal) => !palette.has(literal.toLowerCase()))
        .map((literal) => `${path}: ${literal} is not a palette colour`),
    );

    expect(strays).toEqual([]);
  });

  it('honours the token each mirrored literal names', () => {
    const wrong: string[] = [];

    for (const path of MIRRORS) {
      for (const [, literal, name] of read(path).matchAll(ANNOTATED_LITERAL)) {
        const declared = tokens.base[name ?? ''];
        if (!declared) {
          wrong.push(`${path}: ${name} is not declared in tokens.css`);
          continue;
        }
        const expected = toHex(oklchOf(declared, name ?? ''));
        if (literal?.toLowerCase() !== expected) {
          wrong.push(`${path}: ${name} is ${expected}, the file says ${literal}`);
        }
      }
    }

    expect(wrong).toEqual([]);
  });

  it('declares every custom property a component names', () => {
    const declared = new Set([
      ...Object.keys(tokens.base),
      ...Object.keys(tokens.desktop),
      ...Object.keys(tokens.inverted),
      ...EXTERNAL_PROPERTIES,
    ]);

    const missing = scannedFiles.flatMap((path) =>
      [...read(path).matchAll(/var\((--[a-z0-9-]+)/g)]
        .map(([, name]) => name ?? '')
        .filter((name) => !declared.has(name))
        .map((name) => `${path}: ${name}`),
    );

    expect(missing).toEqual([]);
  });

  it('resolves every palette utility class to a real token', () => {
    // Only classes built on a palette family are inspected, so `text-sm`,
    // `border-t` and `shadow-subtle` are never mistaken for colours.
    const families = [...colourFamilies(tokens.base)].sort();
    const utility = new RegExp(
      String.raw`\b(?:bg|text|border|fill|stroke|outline|ring|divide|accent|caret|from|via|to|decoration)-(${families.join('|')}(?:-[a-z]+)*)(?:\/\d+)?\b`,
      'g',
    );

    const unresolved = scannedFiles.flatMap((path) =>
      [...read(path).matchAll(utility)]
        .map(([, token]) => `--color-${token}`)
        .filter((name) => !(name in tokens.base))
        .map((name) => `${path}: ${name}`),
    );

    expect([...new Set(unresolved)]).toEqual([]);
  });
});

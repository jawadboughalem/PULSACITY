/**
 * Reads `tokens.css` as data.
 *
 * The stylesheet is the source of the look; this turns it into something a test
 * can measure. Deliberately a small brace matcher rather than a CSS parser
 * dependency: the file it reads is one we write.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export type Declarations = Readonly<Record<string, string>>;

export interface TokenBlock {
  /** Nesting, outermost first: `['@media (width >= 40rem)', '@theme']`. */
  readonly path: readonly string[];
  readonly declarations: Declarations;
}

export const tokensPath = fileURLToPath(new URL('./tokens.css', import.meta.url));

/** Everything outside a block — comments and stray text — is ignored. */
export function parseBlocks(css: string): TokenBlock[] {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const blocks: TokenBlock[] = [];
  const open: { selector: string; declarations: Record<string, string> }[] = [];
  let buffer = '';

  const flushDeclarations = () => {
    const current = open.at(-1);
    if (!current) {
      buffer = '';
      return;
    }
    for (const statement of buffer.split(';')) {
      const separator = statement.indexOf(':');
      if (separator === -1) continue;
      const name = statement.slice(0, separator).trim();
      if (!name.startsWith('--')) continue;
      current.declarations[name] = statement.slice(separator + 1).trim();
    }
    buffer = '';
  };

  for (const character of source) {
    if (character === '{') {
      const selector = buffer.trim();
      flushDeclarations();
      open.push({ selector, declarations: {} });
      continue;
    }
    if (character === '}') {
      flushDeclarations();
      const closed = open.pop();
      if (closed) {
        blocks.push({
          path: [...open.map((block) => block.selector), closed.selector],
          declarations: closed.declarations,
        });
      }
      continue;
    }
    buffer += character;
  }

  return blocks;
}

const merge = (blocks: TokenBlock[]): Declarations =>
  Object.assign({}, ...blocks.map((block) => block.declarations)) as Declarations;

export interface Tokens {
  /** `@theme` and `:root` at the top level: the values that apply everywhere. */
  readonly base: Declarations;
  /** The `@media (width >= 40rem)` overrides — sizes only, never colours. */
  readonly desktop: Declarations;
  /** `.surface-inverted`: the same names, other values. */
  readonly inverted: Declarations;
  readonly blocks: readonly TokenBlock[];
}

export function parseTokens(css: string): Tokens {
  const blocks = parseBlocks(css);
  const atTopLevel = (block: TokenBlock, selector: string) =>
    block.path.length === 1 && block.path[0] === selector;

  return {
    base: merge(
      blocks.filter((block) => atTopLevel(block, '@theme') || atTopLevel(block, ':root')),
    ),
    desktop: merge(
      blocks.filter(
        (block) =>
          block.path.length > 1 &&
          (block.path.at(-1) === ':root' || block.path.at(-1) === '@theme'),
      ),
    ),
    inverted: merge(blocks.filter((block) => atTopLevel(block, '.surface-inverted'))),
    blocks,
  };
}

export function readTokens(): Tokens {
  return parseTokens(readFileSync(tokensPath, 'utf8'));
}

/** What a token resolves to inside an inked block: its override, else its base. */
export function resolve(tokens: Tokens, name: string, onInk: boolean): string | undefined {
  return onInk ? (tokens.inverted[name] ?? tokens.base[name]) : tokens.base[name];
}

export const colourNames = (declarations: Declarations): string[] =>
  Object.keys(declarations).filter((name) => name.startsWith('--color-'));

/**
 * The first segment of every colour token: `ground`, `ink`, `accent`, …
 * A utility class built on one of these names must resolve to a real token.
 */
export function colourFamilies(declarations: Declarations): Set<string> {
  const families = new Set<string>();
  for (const name of colourNames(declarations)) {
    const family = name.slice('--color-'.length).split('-')[0];
    if (family) families.add(family);
  }
  return families;
}

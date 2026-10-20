import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

/** The texts of the public site, and the parts of the space it shows (the guide of Systeme.io, the fields of the universal connector, the paste steps, the errors of « Écrivez-nous »). */
const FOLDERS = [
  "src/content",
  "src/components/marketing",
  "src/app/(marketing)",
  // Lot 4.8: the pages of the creator's customers, and every e-mail (maquettes 3.6, « Textes à surveiller »).
  "src/components/collect",
  "src/app/t",
  "src/app/desinscription",
  "src/emails",
];
const FILES = [
  "src/mdx-components.tsx",
  "src/components/connectors/ConnectionGuide.tsx",
  "src/components/connectors/UniversalFieldList.tsx",
  "src/lib/connectors/universal/fields.ts",
  "src/lib/widgets/paste-guide-steps.ts",
  "src/lib/forms/describe-invalid-email.ts",
  "src/lib/support/contact-message.ts",
];

const listFiles = (folder: string): string[] =>
  readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    if (statSync(path).isDirectory()) return listFiles(path);
    return /\.(tsx?|mdx)$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });

/**
 * A place where a line can break and should not: a space before « ? ! : ; », after « « » or before « » », and the
 * hyphen of « e-mail », which takes a word joiner (U+2060, invisible) after it.
 */
const BREAKABLE = / (?=[?!:;](?:\s|$|[»"'’)\]}]))|« | »|\b[eE]-(?!\u2060)mails?\b/;

const TEXT_KINDS = new Set([
  ts.SyntaxKind.StringLiteral,
  ts.SyntaxKind.NoSubstitutionTemplateLiteral,
  ts.SyntaxKind.TemplateHead,
  ts.SyntaxKind.TemplateMiddle,
  ts.SyntaxKind.TemplateTail,
  ts.SyntaxKind.JsxText,
]);

/** The words of a file: its strings and JSX texts, or the lines of an MDX text. */
const readTexts = (path: string): string[] => {
  const source = readFileSync(path, "utf8");
  if (path.endsWith(".mdx")) return source.split("\n").filter((line) => !/^(import|export) /.test(line));
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const texts: string[] = [];
  const visit = (node: ts.Node) => {
    const isModuleName = ts.isImportDeclaration(node.parent ?? node) || ts.isExportDeclaration(node.parent ?? node);
    if (TEXT_KINDS.has(node.kind) && !isModuleName) texts.push(node.getText(file));
    ts.forEachChild(node, visit);
  };
  visit(file);
  return texts;
};

describe("French spacing of the public site", () => {
  it("never lets a « ? », a « : » or a guillemet start a line alone, nor « e-mail » break in two", () => {
    const files = [...FOLDERS.flatMap(listFiles), ...FILES];
    const breakable = files.flatMap((path) =>
      readTexts(path)
        .filter((text) => BREAKABLE.test(text))
        .map((text) => `${path}: ${text.trim().slice(0, 80)}`),
    );
    expect(breakable).toEqual([]);
  });
});

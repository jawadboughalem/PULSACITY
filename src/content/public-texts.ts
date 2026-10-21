import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

/**
 * The texts of the public site, and the parts of the space it shows (the guide of Systeme.io, the fields of the
 * universal connector, the paste steps, the errors of « Écrivez-nous »). Read by the tests of the site's writing only.
 */
export const PUBLIC_TEXT_FOLDERS = [
  "src/content",
  "src/components/marketing",
  "src/app/(marketing)",
  // Lot 4.8: the pages of the creator's customers, and every e-mail (maquettes 3.6, « Textes à surveiller »).
  "src/components/collect",
  "src/app/t",
  "src/app/desinscription",
  "src/emails",
];

export const PUBLIC_TEXT_FILES = [
  "src/mdx-components.tsx",
  "src/components/connectors/ConnectionGuide.tsx",
  "src/components/connectors/UniversalFieldList.tsx",
  "src/lib/connectors/universal/fields.ts",
  "src/lib/widgets/paste-guide-steps.ts",
  "src/lib/forms/describe-invalid-email.ts",
  "src/lib/support/contact-message.ts",
];

export const listTextFiles = (folder: string): string[] =>
  readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    if (statSync(path).isDirectory()) return listTextFiles(path);
    return /\.(tsx?|mdx)$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });

export const listPublicTextFiles = (extraFolders: string[] = []): string[] => [
  ...[...PUBLIC_TEXT_FOLDERS, ...extraFolders].flatMap(listTextFiles),
  ...PUBLIC_TEXT_FILES,
];

const TEXT_KINDS = new Set([
  ts.SyntaxKind.StringLiteral,
  ts.SyntaxKind.NoSubstitutionTemplateLiteral,
  ts.SyntaxKind.TemplateHead,
  ts.SyntaxKind.TemplateMiddle,
  ts.SyntaxKind.TemplateTail,
  ts.SyntaxKind.JsxText,
]);

/** The words of a file: its strings and JSX texts, or the lines of an MDX text. */
export const readTexts = (path: string): string[] => {
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

import type { ReactNode } from "react";

/** A title of a long text, as its table of contents lists it. */
export type TextHeading = { id: string; title: string };

/** « Qui traite vos données » → « qui-traite-vos-donnees »: the anchor of a title, written once for the page and its list. */
export const slugifyHeading = (title: string): string =>
  title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** The words of a title rendered from MDX: its strings, at any depth. */
export const readNodeText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(readNodeText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return readNodeText((node.props as { children?: ReactNode }).children);
  }
  return "";
};

const MARKDOWN_TITLE = /^## (.+)$/;
const ANCHORED_TITLE = /^<AnchoredHeading id="([^"]+)">(.+)<\/AnchoredHeading>$/;

/**
 * The second-level titles of an MDX text, in order: « ## Titre », or « <AnchoredHeading id="cookies"> » when other pages
 * link to it. The same anchors as the titles of mdx-components.
 */
export const listTextHeadings = (source: string): TextHeading[] =>
  source.split("\n").flatMap((line) => {
    const anchored = ANCHORED_TITLE.exec(line.trim());
    if (anchored) return [{ id: anchored[1], title: anchored[2] }];
    const markdown = MARKDOWN_TITLE.exec(line.trim());
    if (markdown) {
      const title = markdown[1].replace(/\*\*|`/g, "");
      return [{ id: slugifyHeading(title), title }];
    }
    return [];
  });

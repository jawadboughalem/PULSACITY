import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { type TextHeading, listTextHeadings } from "./text-headings";

/** Read when the page is built: the guides and the legal texts are static pages. */
export const readGuideHeadings = async (slug: string): Promise<TextHeading[]> =>
  listTextHeadings(await readFile(join(process.cwd(), "src/content/guides", `${slug}.mdx`), "utf8"));

export const readLegalHeadings = async (name: string): Promise<TextHeading[]> =>
  listTextHeadings(await readFile(join(process.cwd(), "src/content/legal", `${name}.mdx`), "utf8"));

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MARKETING_PATHS, guidePath, integrationPath } from "@/components/marketing/marketing-paths";
import { GUIDES } from "./guides";
import { INTEGRATIONS } from "./integrations";

const ROOT = process.cwd();

const ROUTE_GROUPS = ["(marketing)", "(auth)"];

/** A static page of the site exists when one of its route groups has its page.tsx. */
const hasPageFile = (path: string) =>
  ROUTE_GROUPS.some((group) => existsSync(join(ROOT, "src/app", group, path === "/" ? "" : path, "page.tsx")));

const DYNAMIC_PAGES = new Set([
  ...GUIDES.map((guide) => guidePath(guide.slug)),
  ...INTEGRATIONS.map((integration) => integrationPath(integration.slug)),
]);

/** Where each anchor of the site is defined: the page's source, or the text it shows. */
const ANCHOR_SOURCES: Record<string, string> = {
  "/": "src/app/(marketing)/page.tsx",
  "/mentions-legales": "src/content/legal/mentions-legales.mdx",
  "/confidentialite": "src/content/legal/confidentialite.mdx",
  "/cgu": "src/content/legal/cgu.mdx",
};

const assertLinkWorks = (link: string) => {
  const [path, anchor] = link.split("#");
  const page = path === "" ? "/" : path;
  expect(hasPageFile(page) || DYNAMIC_PAGES.has(page), `${link}: no page`).toBe(true);
  if (anchor) {
    const source = ANCHOR_SOURCES[page];
    expect(source, `${link}: anchor on a page without a known source`).toBeDefined();
    expect(readFileSync(join(ROOT, source), "utf8"), `${link}: no id "${anchor}"`).toContain(`id="${anchor}"`);
  }
};

const listMdxFiles = (folder: string): string[] =>
  readdirSync(join(ROOT, folder), { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? listMdxFiles(join(folder, entry.name))
      : entry.name.endsWith(".mdx")
        ? [join(folder, entry.name)]
        : [],
  );

describe("internal links of the public site", () => {
  it("lead every path of the header, the footer and the pages to an existing page and anchor", () => {
    for (const link of Object.values(MARKETING_PATHS)) assertLinkWorks(link);
  });

  it("lead every link of the guides and legal texts to an existing page and anchor", () => {
    const files = listMdxFiles("src/content");
    expect(files.length).toBeGreaterThanOrEqual(7);
    for (const file of files) {
      const text = readFileSync(join(ROOT, file), "utf8");
      for (const [, link] of text.matchAll(/\]\((\/[^)\s]*)\)/g)) assertLinkWorks(link);
    }
  });

  it("finds the text of every guide", () => {
    for (const guide of GUIDES) {
      expect(existsSync(join(ROOT, "src/content/guides", `${guide.slug}.mdx`))).toBe(true);
      expect(guide.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    expect(new Set(GUIDES.map((guide) => guide.slug)).size).toBe(GUIDES.length);
  });
});

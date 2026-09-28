export const MAX_SLUG_LENGTH = 48;

export const MIN_SLUG_LENGTH = 3;

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const LIGATURES: Record<string, string> = { œ: "oe", æ: "ae", ß: "ss", "&": " et " };

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[œæß&]/g, (character) => LIGATURES[character] ?? character)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/, "");

export const appendSlugSuffix = (slug: string, suffix: string): string =>
  `${slug.slice(0, MAX_SLUG_LENGTH - suffix.length - 1).replace(/-+$/, "")}-${suffix}`;

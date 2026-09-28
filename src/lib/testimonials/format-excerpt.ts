export const EXCERPT_LENGTH = 80;

export const formatExcerpt = (text: string, maxLength = EXCERPT_LENGTH): string => {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const cut = normalized.slice(0, maxLength + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : normalized.slice(0, maxLength)).replace(/[\s,;:.]+$/, "")}…`;
};

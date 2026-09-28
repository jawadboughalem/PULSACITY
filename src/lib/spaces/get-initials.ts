const MAX_INITIALS = 2;

export const getInitials = (name: string): string =>
  name
    .split(/[\s'’-]+/)
    .filter((word) => /\p{L}|\p{N}/u.test(word))
    .slice(0, MAX_INITIALS)
    .map((word) => (word.match(/\p{L}|\p{N}/u)?.[0] ?? "").toUpperCase())
    .join("");

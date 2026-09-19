/**
 * Detection of template variables that were never replaced.
 *
 * A published demo, a legal page or a site template must never show `{{SOMETHING}}`
 * to a visitor. Rendering keeps a line only when its variable has a value, so a
 * leftover marker always means a bug — the rule is enforced by tests and by the
 * `SiteContent` contract itself.
 */

/** Matches `{{ANY_VARIABLE}}`, with or without surrounding spaces. */
export const PLACEHOLDER_PATTERN = /\{\{\s*[^{}]*\s*\}\}/g;

/** Returns every unreplaced `{{...}}` marker found in a string. */
export function findPlaceholders(value: string): string[] {
  return value.match(PLACEHOLDER_PATTERN) ?? [];
}

/** True when the string still contains at least one `{{...}}` marker. */
export function hasPlaceholder(value: string): boolean {
  PLACEHOLDER_PATTERN.lastIndex = 0;
  return findPlaceholders(value).length > 0;
}

/**
 * Walks any JSON-like value and collects `{{...}}` markers found in its strings,
 * prefixed by the path where they sit (e.g. `services.0.name: {{NAME}}`).
 */
export function findPlaceholdersDeep(value: unknown, path = ''): string[] {
  if (typeof value === 'string') {
    return findPlaceholders(value).map((marker) => (path ? `${path}: ${marker}` : marker));
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      findPlaceholdersDeep(item, path ? `${path}.${index}` : String(index)),
    );
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      findPlaceholdersDeep(item, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

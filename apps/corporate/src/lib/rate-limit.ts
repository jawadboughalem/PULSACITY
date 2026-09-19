/**
 * Per-IP rate limiting for the two public forms.
 *
 * In-memory and per-instance: it stops a bored visitor and a naive script, not a
 * distributed flood. A shared store moves here the day it is needed.
 */
interface Window {
  hits: number[];
}

const windows = new Map<string, Window>();
const MAX_KEYS = 5_000;

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
  now = Date.now(),
): RateLimitResult {
  // Cheap guard against unbounded growth on a long-lived instance.
  if (windows.size > MAX_KEYS) windows.clear();

  const window = windows.get(key) ?? { hits: [] };
  window.hits = window.hits.filter((at) => now - at < windowMs);

  if (window.hits.length >= limit) {
    const oldest = window.hits[0] ?? now;
    windows.set(key, window);
    return { ok: false, retryAfterSeconds: Math.ceil((windowMs - (now - oldest)) / 1000) };
  }

  window.hits.push(now);
  windows.set(key, window);
  return { ok: true, retryAfterSeconds: 0 };
}

/** Test seam. */
export function resetRateLimits(): void {
  windows.clear();
}

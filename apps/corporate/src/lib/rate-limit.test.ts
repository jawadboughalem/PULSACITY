import { beforeEach, describe, expect, it } from 'vitest';

import { rateLimit, resetRateLimits } from './rate-limit';

describe('rateLimit', () => {
  beforeEach(() => resetRateLimits());

  it('allows up to the limit, then refuses', () => {
    const options = { limit: 3, windowMs: 60_000 };
    for (let attempt = 0; attempt < 3; attempt += 1) {
      expect(rateLimit('ip-1', options, 1_000).ok).toBe(true);
    }
    const refused = rateLimit('ip-1', options, 1_000);
    expect(refused.ok).toBe(false);
    expect(refused.retryAfterSeconds).toBeGreaterThan(0);
  });

  it('counts each key separately', () => {
    const options = { limit: 1, windowMs: 60_000 };
    expect(rateLimit('ip-1', options, 1_000).ok).toBe(true);
    expect(rateLimit('ip-2', options, 1_000).ok).toBe(true);
    expect(rateLimit('ip-1', options, 1_000).ok).toBe(false);
  });

  it('forgets hits once the window has passed', () => {
    const options = { limit: 1, windowMs: 60_000 };
    expect(rateLimit('ip-1', options, 1_000).ok).toBe(true);
    expect(rateLimit('ip-1', options, 30_000).ok).toBe(false);
    expect(rateLimit('ip-1', options, 62_000).ok).toBe(true);
  });
});

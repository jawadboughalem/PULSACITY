import { describe, expect, it } from 'vitest';

import { formatFrenchPhone, parseFrenchPhone } from './phone';

describe('parseFrenchPhone', () => {
  it.each([
    ['06 12 34 56 78', '+33612345678'],
    ['0612345678', '+33612345678'],
    ['06.12.34.56.78', '+33612345678'],
    ['06-12-34-56-78', '+33612345678'],
    ['(0)6 12 34 56 78'.replace('(0)', '0'), '+33612345678'],
    ['+33 6 12 34 56 78', '+33612345678'],
    ['+33612345678', '+33612345678'],
    ['0033612345678', '+33612345678'],
    ['33612345678', '+33612345678'],
    ['01 23 45 67 89', '+33123456789'],
    ['09 70 00 00 00', '+33970000000'],
    // Narrow no-break space, as pasted from a French web page.
    ['06\u00a012\u00a034\u00a056\u00a078', '+33612345678'],
  ])('normalises %s to %s', (input, expected) => {
    expect(parseFrenchPhone(input)).toEqual({ ok: true, e164: expected });
  });

  it.each([
    ['', 'empty'],
    ['0612345', 'too short'],
    ['06123456789', 'too long'],
    ['0012345678', 'a leading 0 after the trunk prefix'],
    ['+44 20 7946 0000', 'a non-French country code'],
    ['pas un numéro', 'letters'],
    ['+33012345678', 'a French number starting with 0'],
  ])('rejects %s (%s)', (input) => {
    expect(parseFrenchPhone(input).ok).toBe(false);
  });
});

describe('formatFrenchPhone', () => {
  it('renders an E.164 number the French way', () => {
    expect(formatFrenchPhone('+33612345678')).toBe('06 12 34 56 78');
  });

  it('leaves anything else untouched', () => {
    expect(formatFrenchPhone('+442079460000')).toBe('+442079460000');
  });
});

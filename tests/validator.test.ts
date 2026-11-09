import { describe, expect, it } from 'vitest';
import { createDigitValidator } from '../src/core/validator.js';

describe('createDigitValidator', () => {
  it.each([2, 8, 10, 16])(
    'accepts exactly the alphabet for base %i',
    (base) => {
      const validate = createDigitValidator(base);
      const alphabet = '0123456789abcdef';
      [...alphabet].forEach((digit, index) =>
        expect(validate(digit)).toBe(index < base),
      );
    },
  );
  it('normalizes hex case', () =>
    expect(createDigitValidator(16)('F')).toBe(true));
  it.each(['', '12', ' ', '-', 'g', '😀'])('rejects %j', (digit) => {
    expect(createDigitValidator(16)(digit)).toBe(false);
  });
  it.each([0, 1, 17, 2.5, NaN])('rejects invalid base %s', (base) => {
    expect(() => createDigitValidator(base)).toThrow(RangeError);
  });
});

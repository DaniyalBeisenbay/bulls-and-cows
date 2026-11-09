import { expect, it } from 'vitest';
import { generateSecret } from '../src/core/generate.js';
it('keeps leading zero with a deterministic source', () =>
  expect(generateSecret(4, 10, () => 0)).toBe('0123'));
it('selects the last remaining digit', () =>
  expect(generateSecret(4, 16, () => 0.999)).toBe('fedc'));
it.each([2, 8, 10, 16])('uses unique valid digits in base %i', (base) => {
  const secret = generateSecret(Math.min(6, base), base, () => 0.5);
  expect(new Set(secret).size).toBe(secret.length);
  expect([...secret].every((digit) => parseInt(digit, 16) < base)).toBe(true);
});
it.each([
  [3, 2],
  [0, 10],
  [2.5, 10],
  [2, 17],
  [2, 1],
])('rejects length %i base %i', (length, base) =>
  expect(() => generateSecret(length, base)).toThrow(RangeError),
);
it.each([-0.1, 1, NaN, Infinity])('rejects random result %s', (value) =>
  expect(() => generateSecret(2, 10, () => value)).toThrow(RangeError),
);

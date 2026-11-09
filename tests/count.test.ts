import { expect, it } from 'vitest';
import { countPossibleSecrets } from '../src/core/count.js';
it.each([
  [0, 10, 1],
  [2, 2, 2],
  [4, 10, 5040],
  [6, 16, 5765760],
  [2, 8, 56],
  [3, 3, 6],
])('counts P(%i, %i)', (length, base, count) =>
  expect(countPossibleSecrets(length, base)).toBe(count),
);
it('returns consistent results on repeated calls', () => {
  expect(countPossibleSecrets(4, 16)).toBe(43680);
  expect(countPossibleSecrets(4, 16)).toBe(43680);
  expect(countPossibleSecrets(4, 10)).toBe(5040);
});
it.each([
  [-1, 10],
  [3, 2],
  [2, 1],
  [2, 17],
  [1.5, 10],
])('rejects %i %i', (length, base) =>
  expect(() => countPossibleSecrets(length, base)).toThrow(RangeError),
);

import { expect, it } from 'vitest';
import { isValidGuess } from '../src/core/guess.js';
it.each([
  ['0123', 4, 10, true],
  ['aBcF', 4, 16, true],
  ['01', 2, 2, true],
  ['012', 4, 10, false],
  ['1123', 4, 10, false],
  ['aA', 2, 16, false],
  ['018', 3, 8, false],
  ['02', 2, 2, false],
  [' 12', 3, 10, false],
  ['', 0, 10, false],
  ['01', 2, 1, false],
  ['01', 2, 2.5, false],
])('validates %s length %i base %i', (guess, length, base, valid) => {
  expect(isValidGuess(guess as string, length as number, base as number)).toBe(
    valid,
  );
});

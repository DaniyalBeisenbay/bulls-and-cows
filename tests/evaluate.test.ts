import { expect, it } from 'vitest';
import { evaluateGuess } from '../src/core/evaluate.js';
it.each([
  ['0123', '0123', 4, 0],
  ['0123', '3210', 0, 4],
  ['0123', '0451', 1, 1],
  ['0123', '4567', 0, 0],
  ['aB0f', 'Ab0F', 4, 0],
  ['abcd', 'DCBA', 0, 4],
])('scores %s vs %s', (secret, guess, bulls, cows) => {
  expect(evaluateGuess(secret, guess)).toEqual({ bulls, cows });
});
it('does not count duplicate guesses twice', () => {
  expect(evaluateGuess('0123', '0000')).toEqual({ bulls: 1, cows: 0 });
});
it('rejects unequal lengths', () =>
  expect(() => evaluateGuess('01', '012')).toThrow(RangeError));

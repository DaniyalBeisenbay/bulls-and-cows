import { assertBase, DIGITS } from './validator.js';
export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  assertBase(base);
  if (!Number.isInteger(length) || length < 1 || length > base)
    throw new RangeError('Invalid secret length');
  const select = (remaining: string[], result: string): string => {
    if (result.length === length) return result;
    const value = random();
    if (!Number.isFinite(value) || value < 0 || value >= 1)
      throw new RangeError('Random must return a value in [0, 1)');
    const index = Math.floor(value * remaining.length);
    return select(
      remaining.filter((_, position) => position !== index),
      result + remaining[index],
    );
  };
  return select([...DIGITS.slice(0, base)], '');
};

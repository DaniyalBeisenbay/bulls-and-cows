export type Evaluation = Readonly<{ bulls: number; cows: number }>;
export const evaluateGuess = (secret: string, guess: string): Evaluation => {
  if (secret.length !== guess.length)
    throw new RangeError('Lengths must match');
  const secretDigits = [...secret.toLowerCase()];
  const guessDigits = [...guess.toLowerCase()];
  const bulls = guessDigits.filter(
    (digit, index) => digit === secretDigits[index],
  ).length;
  const frequencies = (digits: string[]) =>
    digits.reduce<Record<string, number>>(
      (counts, digit) => ({ ...counts, [digit]: (counts[digit] ?? 0) + 1 }),
      {},
    );
  const secretCounts = frequencies(secretDigits);
  const guessCounts = frequencies(guessDigits);
  const matches = Object.keys(guessCounts).reduce(
    (total, digit) =>
      total + Math.min(secretCounts[digit] ?? 0, guessCounts[digit]),
    0,
  );
  return { bulls, cows: matches - bulls };
};

import { expect, it } from 'vitest';
import {
  createGame,
  submitGuess,
  addRecord,
  parseRecords,
} from '../src/core/state.js';
it('preserves old state and history when accepting a guess', () => {
  const game = Object.freeze({
    ...createGame({ length: 4, base: 10 }, '0123', 1000),
    history: Object.freeze([]),
  });
  const next = submitGuess(game, '0451', 2000);
  expect(game.history).toEqual([]);
  expect(next.history).toEqual([{ guess: '0451', bulls: 1, cows: 1 }]);
  expect(next.status).toBe('playing');
});
it('ignores invalid guesses and case insensitive duplicates', () => {
  const game = createGame({ length: 4, base: 16 }, '0123', 0);
  expect(submitGuess(game, 'aaaa', 100)).toBe(game);
  const next = submitGuess(game, 'ABCD', 100);
  expect(submitGuess(next, 'abcd', 200)).toBe(next);
});
it('ends on winning and cannot accept further guesses', () => {
  const won = submitGuess(
    createGame({ length: 2, base: 2 }, '01', 1000),
    '01',
    3500,
  );
  expect(won.status).toBe('won');
  expect(won.elapsedMs).toBe(2500);
  expect(submitGuess(won, '10', 4000)).toBe(won);
});
it('rejects invalid settings and mismatched secrets', () => {
  expect(() => createGame({ length: 3, base: 2 }, '012', 0)).toThrow();
  expect(() => createGame({ length: 2, base: 3 }, '01', 0)).toThrow();
});
it('sorts records by attempts then time, preserving settings and inputs', () => {
  const records = Object.freeze([
    { length: 4, base: 10, attempts: 2, elapsedMs: 2000, date: '2026-11-08' },
  ]);
  const result = addRecord(
    records,
    { length: 2, base: 2, attempts: 1, elapsedMs: 4000, date: '2026-11-08' },
    1,
  );
  expect(result).toHaveLength(1);
  expect(result[0].base).toBe(2);
  expect(records).toHaveLength(1);
  expect(
    addRecord(records, { ...records[0], elapsedMs: 1000 })[0].elapsedMs,
  ).toBe(1000);
});
it.each([null, 'broken', '{}', '[null]', '[{"attempts":-1}]'])(
  'handles corrupt saved records %s',
  (raw) => expect(parseRecords(raw)).toEqual([]),
);

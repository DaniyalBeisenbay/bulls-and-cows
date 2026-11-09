import { evaluateGuess, type Evaluation } from './evaluate.js';
import { isValidGuess } from './guess.js';
export type Settings = Readonly<{ length: number; base: number }>;
export type Entry = Evaluation & Readonly<{ guess: string }>;
export type Game = Readonly<{
  settings: Settings;
  secret: string;
  startedAt: number;
  elapsedMs: number;
  status: 'playing' | 'won';
  history: readonly Entry[];
}>;
export type ScoreRecord = Settings &
  Readonly<{ attempts: number; elapsedMs: number; date: string }>;
export const validSettings = ({ length, base }: Settings): boolean =>
  [2, 8, 10, 16].includes(base) &&
  Number.isInteger(length) &&
  length >= 2 &&
  length <= 6 &&
  length <= base;
export const createGame = (
  settings: Settings,
  secret: string,
  startedAt: number,
): Game => {
  if (
    !validSettings(settings) ||
    !isValidGuess(secret, settings.length, settings.base)
  )
    throw new RangeError('Invalid round');
  return {
    settings: { ...settings },
    secret: secret.toLowerCase(),
    startedAt,
    elapsedMs: 0,
    status: 'playing',
    history: [],
  };
};
export const submitGuess = (game: Game, guess: string, now: number): Game => {
  const normalized = guess.toLowerCase();
  if (
    game.status !== 'playing' ||
    !isValidGuess(normalized, game.settings.length, game.settings.base) ||
    game.history.some((entry) => entry.guess === normalized)
  )
    return game;
  const result = evaluateGuess(game.secret, normalized);
  return {
    ...game,
    history: [...game.history, { guess: normalized, ...result }],
    status: result.bulls === game.settings.length ? 'won' : 'playing',
    elapsedMs: Math.max(0, now - game.startedAt),
  };
};
export const addRecord = (
  records: readonly ScoreRecord[],
  record: ScoreRecord,
  limit = 10,
): readonly ScoreRecord[] =>
  [...records, { ...record }]
    .sort((a, b) => a.attempts - b.attempts || a.elapsedMs - b.elapsedMs)
    .slice(0, Math.max(0, limit));
const isRecord = (value: unknown): value is ScoreRecord => {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as ScoreRecord;
  return (
    validSettings(record) &&
    Number.isInteger(record.attempts) &&
    record.attempts > 0 &&
    Number.isFinite(record.elapsedMs) &&
    record.elapsedMs >= 0 &&
    typeof record.date === 'string' &&
    Number.isFinite(Date.parse(record.date))
  );
};
export const parseRecords = (raw: string | null): readonly ScoreRecord[] => {
  try {
    const parsed: unknown = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed)
      ? parsed
          .filter(isRecord)
          .sort((a, b) => a.attempts - b.attempts || a.elapsedMs - b.elapsedMs)
          .slice(0, 10)
      : [];
  } catch {
    return [];
  }
};

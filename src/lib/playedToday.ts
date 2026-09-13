import { BOARD_SIZES, dailySeed, readBest } from './game.ts';
import { isScore, isTypingRecord, readRecord } from './records.ts';
import type { GameId } from './games.ts';

export const PLAYED_EVENT = 'chatjipiti:played';
const sessionPlays = new Set<string>();
const markerKey = (game: GameId, day: string) => `chatjipiti:v2:played:${day}:${game}`;

// Record actual play in either mode, independently of completion or score.
export function markPlayed(game: GameId, date = new Date()) {
  const key = markerKey(game, dailySeed(date));
  sessionPlays.add(key);
  try { localStorage.setItem(key, 'played'); } catch { /* This visit still counts. */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(PLAYED_EVENT));
}

export function wasPlayedToday(game: GameId, date = new Date()): boolean {
  const day = dailySeed(date);
  const key = markerKey(game, day);
  if (sessionPlays.has(key)) return true;
  try { if (localStorage.getItem(key) === 'played') return true; } catch { /* Try validated legacy scores. */ }
  if (game === 'memory') return BOARD_SIZES.some(size => readBest(`chatjipiti:v1:memory:daily:${day}:${size}`) !== null);
  if (game === 'typing') return readRecord(`typing:daily:${day}`, isTypingRecord) !== null;
  return readRecord(`circle:daily:${day}`, isScore) !== null;
}

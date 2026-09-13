export type BoardSize = 3 | 4 | 5 | 6;
export const BOARD_SIZES: BoardSize[] = [3, 4, 5, 6];

export function dailySeed(date = new Date()): string {
  // One UTC day for every player, regardless of local timezone.
  return date.toISOString().slice(0, 10);
}

export function randomFromSeed(seed: string): () => number {
  let state = 2166136261;
  for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619);
  return () => {
    state += 0x6D2B79F5;
    let value = Math.imul(state ^ state >>> 15, 1 | state);
    value ^= value + Math.imul(value ^ value >>> 7, 61 | value);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export function makeBoard(size: BoardSize, seed: string): (number | null)[] {
  const random = randomFromSeed(seed);
  const cards: (number | null)[] = Array.from({ length: Math.floor(size * size / 2) }, (_, i) => [i, i]).flat();
  if (size % 2) cards.push(null);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export type MemoryResult = { seconds: number; moves: number };
export function isBetter(next: MemoryResult, previous: MemoryResult | null): boolean {
  return !previous || next.seconds < previous.seconds || (next.seconds === previous.seconds && next.moves < previous.moves);
}

export function readBest(key: string): MemoryResult | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? 'null');
    return value && Number.isFinite(value.seconds) && value.seconds >= 0 && Number.isInteger(value.moves) && value.moves >= 0 ? value : null;
  } catch { return null; }
}

export function saveBest(key: string, result: MemoryResult): boolean {
  try {
    if (isBetter(result, readBest(key))) localStorage.setItem(key, JSON.stringify(result));
    return true;
  } catch { return false; }
}

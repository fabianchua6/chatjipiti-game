export type TypingRecord = { correct: number; words: number; wpm: number };
const PREFIX = 'chatjipiti:v2:';
export function readRecord<T>(key: string, valid: (value: unknown) => value is T): T | null {
  try { const value: unknown = JSON.parse(localStorage.getItem(PREFIX + key) ?? 'null'); return valid(value) ? value : null; }
  catch { return null; }
}
export function writeRecord(key: string, value: unknown): boolean {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; } catch { return false; }
}
export function isTypingRecord(value: unknown): value is TypingRecord {
  if (!value || typeof value !== 'object') return false;
  const item = value as TypingRecord;
  return [item.correct, item.words, item.wpm].every(n => Number.isInteger(n) && n >= 0);
}
export function isScore(value: unknown): value is number { return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100; }
export function saveTypingRecord(key: string, result: TypingRecord): boolean {
  const previous = readRecord(key, isTypingRecord);
  if (previous && (previous.correct > result.correct || previous.correct === result.correct && previous.wpm >= result.wpm)) return true;
  return writeRecord(key, result);
}
// Derive balance from one immutable key per UTC day. Two tabs cannot double-credit.
const REWARD_PREFIX = `${PREFIX}circle-reset:`;
export function resetBalance(): number {
  try {
    let balance = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(REWARD_PREFIX) && /^\d{4}-\d{2}-\d{2}$/.test(key.slice(REWARD_PREFIX.length)) && localStorage.getItem(key) === 'claimed') balance++;
    }
    return balance;
  } catch { return 0; }
}
export function claimDailyReset(day: string): 'earned' | 'claimed' | 'unavailable' {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return 'unavailable';
  try {
    const key = REWARD_PREFIX + day;
    if (localStorage.getItem(key) === 'claimed') return 'claimed';
    localStorage.setItem(key, 'claimed');
    window.dispatchEvent(new Event('chatjipiti:wallet'));
    return 'earned';
  } catch { return 'unavailable'; }
}

export async function claimResetSafely(day: string): Promise<'earned' | 'claimed' | 'unavailable'> {
  if (typeof navigator !== 'undefined' && navigator.locks) {
    try { return await navigator.locks.request(`chatjipiti-reset:${day}`, () => claimDailyReset(day)); }
    catch { return 'unavailable'; }
  }
  return claimDailyReset(day);
}

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
// Keep previous daily rewards; demo wins now use one immutable key per round.
const REWARD_PREFIX = `${PREFIX}circle-reset:`;
const DEMO_REWARD_PREFIX = `${PREFIX}circle-demo-reset:`;
const ROUND_ID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const sessionRewards = new Set<string>();

export function awardDemoReset(roundId: string): void {
  if (!ROUND_ID.test(roundId)) return;
  const key = DEMO_REWARD_PREFIX + roundId;
  if (sessionRewards.has(key)) return;
  sessionRewards.add(key);
  try { localStorage.setItem(key, 'claimed'); } catch { /* The reward still counts for this demo session. */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('chatjipiti:wallet'));
}
export function resetBalance(): number {
  const rewards = new Set(sessionRewards);
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || localStorage.getItem(key) !== 'claimed') continue;
      const daily = key.startsWith(REWARD_PREFIX) && /^\d{4}-\d{2}-\d{2}$/.test(key.slice(REWARD_PREFIX.length));
      const demo = key.startsWith(DEMO_REWARD_PREFIX) && ROUND_ID.test(key.slice(DEMO_REWARD_PREFIX.length));
      if (daily || demo) rewards.add(key);
    }
  } catch { /* Session rewards remain available when browser storage is blocked. */ }
  return rewards.size;
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

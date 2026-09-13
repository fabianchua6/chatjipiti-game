import { randomFromSeed } from './game.ts';
export type GameMode = 'daily' | 'practice';
export const CIRCLE_BOARD_ASPECT = 1.26;
export type Circle = { x: number; y: number; radius: number };
export type CircleScore = { position: number; size: number; total: number };
export const TYPING_WORD_LIMIT = 15;
const TYPING_PHRASES = [
  'you are absolutely right and this tiny game is having a wonderful little moment today',
  'let me think about that while the pixels quietly assemble a perfect answer for you',
  'no mistakes just vibes and a confident keyboard moving one clean word at a time',
  'the agent is still working but your fingers are already speedrunning the best possible answer',
  'small prompt big energy every letter lands exactly where the universe intended it to today',
  'this is your sign to type boldly and let the tiny arcade judge your accuracy',
  'a perfect streak begins with one careful character and ends with wildly good vibes tonight',
  'please type this sentence exactly and pretend the scoreboard is a very serious scientific instrument',
  'the answer is somewhere in here and your keyboard knows exactly how to find it',
  'one tiny challenge three seconds of courage and a surprisingly dramatic amount of confidence today',
  'your fingers are faster than the agent and that feels like useful information right now',
  'keep the rhythm keep the focus and let every lowercase letter land beautifully today somehow',
];
export function typingPassage(seed: string): string {
  const random = randomFromSeed(`typing:${seed}`);
  return TYPING_PHRASES[Math.floor(random() * TYPING_PHRASES.length)] ?? TYPING_PHRASES[0];
}
export function compareTyping(previous: string, next: string, passage: string): { correct: number; mistake: string | null; expected: string | null } {
  if (!next.startsWith(previous)) return { correct: previous.length, mistake: 'an edit or backspace', expected: passage[previous.length] ?? null };
  let cursor = previous.length;
  while (cursor < next.length) {
    if (next[cursor] !== passage[cursor]) return { correct: cursor, mistake: next[cursor], expected: passage[cursor] ?? null };
    cursor++;
  }
  return { correct: cursor, mistake: null, expected: null };
}
export function typingMetrics(prefix: string, elapsedMs: number, complete = false) {
  const correct = prefix.length;
  const elapsed = Math.max(0, elapsedMs);
  const wpm = elapsed > 0 ? Math.round(correct / 5 / (Math.max(elapsed, 1000) / 60000)) : 0;
  const words = (prefix.match(/\S+\s/g) ?? []).length + (complete && /\S$/.test(prefix) ? 1 : 0);
  return { correct, words, wpm };
}
export function circleTarget(seed: string = crypto.randomUUID(), aspect = 1): Circle {
  const random = randomFromSeed(`circle:${seed}`);
  const radius = 0.11 + random() * 0.10;
  const marginX = (radius + 0.015) / aspect;
  const marginY = radius + 0.015;
  return { radius, x: marginX + random() * (1 - 2 * marginX), y: marginY + random() * (1 - 2 * marginY) };
}
export function scoreCircle(target: Circle, drawn: Circle, aspect = 1): CircleScore {
  if (![target.x, target.y, target.radius, drawn.x, drawn.y, drawn.radius].every(Number.isFinite) || drawn.radius <= 0 || target.radius <= 0) return { position: 0, size: 0, total: 0 };
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const distance = Math.hypot((drawn.x - target.x) * aspect, drawn.y - target.y);
  const position = Math.round(50 * clamp(1 - distance / (target.radius * 2)) * 10) / 10;
  const size = Math.round(50 * clamp(1 - Math.abs(drawn.radius - target.radius) / target.radius) * 10) / 10;
  return { position, size, total: Math.round((position + size) * 10) / 10 };
}
export function constrainCircle(circle: Circle, aspect = 1): Circle {
  const x = Math.max(0, Math.min(1, circle.x));
  const y = Math.max(0, Math.min(1, circle.y));
  return { x, y, radius: Math.max(0, Math.min(circle.radius, x * aspect, (1 - x) * aspect, y, 1 - y)) };
}

import { randomFromSeed } from './game.ts';
export type GameMode = 'daily' | 'practice';
export type Circle = { x: number; y: number; radius: number };
export type CircleScore = { position: number; size: number; total: number };
const TIERS = [
  ['you are absolutely right', 'let me think about that', 'make no mistakes', 'one more prompt should do it', 'the agent is still working', 'draw me a yellow circle', 'ship it and then get coffee', 'tiny games for big thinking'],
  ['The context window remembers.', 'Your agent has entered thinking mode.', 'Please explain this like I am five.', 'No meetings, just parallel agents.', 'That is an excellent observation!', 'Astra is building something good.'],
  ['Run 3 checks, then deploy version 2.', 'Accuracy: 100%. Confidence: cautiously optimistic.', 'Return valid JSON: {"status":"ready"}.', 'const answer = 42; // probably', 'if (bugs === 0) { ship(); }', 'git commit -m "make no mistakes"'],
];
export function typingPassage(seed: string): string {
  const random = randomFromSeed(`typing:${seed}`);
  return Array.from({ length: 320 }, (_, index) => {
    const tier = TIERS[index < 5 ? 0 : index < 12 ? 1 : 2];
    return tier[Math.floor(random() * tier.length)];
  }).join(' ');
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
export function typingMetrics(prefix: string, elapsedMs: number) {
  const correct = prefix.length;
  const elapsed = Math.max(0, elapsedMs);
  const wpm = elapsed > 0 ? Math.round(correct / 5 / (Math.max(elapsed, 1000) / 60000)) : 0;
  const words = (prefix.match(/\S+\s/g) ?? []).length;
  return { correct, words, wpm };
}
export function circleTarget(seed: string): Circle {
  const random = randomFromSeed(`circle:${seed}`);
  const radius = 0.11 + random() * 0.10;
  return { radius, x: 0.27 + random() * 0.46, y: 0.27 + random() * 0.46 };
}
export function scoreCircle(target: Circle, drawn: Circle): CircleScore {
  if (![target.x, target.y, target.radius, drawn.x, drawn.y, drawn.radius].every(Number.isFinite) || drawn.radius <= 0 || target.radius <= 0) return { position: 0, size: 0, total: 0 };
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const distance = Math.hypot(drawn.x - target.x, drawn.y - target.y);
  const position = Math.round(50 * clamp(1 - distance / (target.radius * 2)) * 10) / 10;
  const size = Math.round(50 * clamp(1 - Math.abs(drawn.radius - target.radius) / target.radius) * 10) / 10;
  return { position, size, total: Math.round((position + size) * 10) / 10 };
}
export function constrainCircle(circle: Circle): Circle {
  const x = Math.max(0, Math.min(1, circle.x));
  const y = Math.max(0, Math.min(1, circle.y));
  return { x, y, radius: Math.max(0, Math.min(circle.radius, x, 1 - x, y, 1 - y)) };
}

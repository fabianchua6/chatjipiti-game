import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import { CIRCLE_BOARD_ASPECT, circleTarget, compareTyping, constrainCircle, scoreCircle, typingMetrics, typingPassage, TYPING_WORD_LIMIT } from './challenges.ts';
import { claimDailyReset, resetBalance, isScore, isTypingRecord, saveTypingRecord, readRecord } from './records.ts';

test('typing challenge is deterministic, varied and short enough for a quick round', () => {
  const passage = typingPassage('day-a');
  assert.equal(passage, typingPassage('day-a'));
  assert.notEqual(passage, typingPassage('day-b'));
  assert.equal(passage.trim().split(/\s+/).length, TYPING_WORD_LIMIT);
  assert.match(passage, /^[a-z ]+$/);
  assert.ok(passage.length < 120);
});
test('strict input stops at the first mistake, including space and edits', () => {
  assert.deepEqual(compareTyping('he', 'hello ', 'hello world'), { correct: 6, mistake: null, expected: null });
  assert.deepEqual(compareTyping('he', 'helxo', 'hello world'), { correct: 3, mistake: 'x', expected: 'l' });
  assert.deepEqual(compareTyping('hello', 'hellox', 'hello world'), { correct: 5, mistake: 'x', expected: ' ' });
  assert.equal(compareTyping('hello', 'hell', 'hello world').mistake, 'an edit or backspace');
  assert.equal(compareTyping('hello', 'hallo', 'hello world').correct, 5);
});
test('typing WPM uses five characters per word and excludes unfinished words', () => {
  assert.deepEqual(typingMetrics('hello wor', 60000), { correct: 9, words: 1, wpm: 2 });
  assert.deepEqual(typingMetrics('hello ', 30000), { correct: 6, words: 1, wpm: 2 });
  assert.equal(typingMetrics('hello world', 60000).words, 1);
  assert.equal(typingMetrics('hello world', 60000, true).words, 2);
  assert.equal(typingMetrics('hello ', 30000, true).words, 1);
  assert.equal(typingMetrics('', 0).wpm, 0);
});
test('circle targets are seeded and fully within the normalized square', () => {
  for (let index = 0; index < 100; index++) {
    const target = circleTarget(String(index));
    assert.deepEqual(target, circleTarget(String(index)));
    assert.ok(target.x - target.radius >= 0 && target.y - target.radius >= 0);
    assert.ok(target.x + target.radius <= 1 && target.y + target.radius <= 1);
  }
});
test('circle scoring splits position and size and handles invalid strokes', () => {
  const target = { x: .5, y: .5, radius: .2 };
  assert.deepEqual(scoreCircle(target, target), { position: 50, size: 50, total: 100 });
  assert.deepEqual(scoreCircle(target, { ...target, radius: .1 }), { position: 50, size: 25, total: 75 });
  assert.equal(scoreCircle(target, { ...target, x: .7 }).position, 25);
  assert.equal(scoreCircle(target, { ...target, radius: 0 }).total, 0);
  assert.equal(scoreCircle(target, { ...target, x: NaN }).total, 0);
  assert.equal(scoreCircle(target, { ...target, radius: .18 }).total, 95);
});
test('circle size is constrained to stay inside the play area', () => {
  assert.deepEqual(constrainCircle({ x: .9, y: .5, radius: .8 }), { x: .9, y: .5, radius: 1 - .9 });
  assert.deepEqual(constrainCircle({ x: -1, y: 2, radius: 1 }), { x: 0, y: 1, radius: 0 });
});
test('daily wallet is derived from unique claims and survives repeated attempts', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const records = new Map<string, string>();
  let fail = false;
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    get length() { return records.size; }, key: (i: number) => Array.from(records.keys())[i] ?? null,
    getItem: (key: string) => records.get(key) ?? null,
    setItem: (key: string, value: string) => { if (fail) throw Error('blocked'); records.set(key, value); },
  } });
  Object.defineProperty(globalThis, 'window', { configurable: true, value: new EventTarget() });
  try {
    assert.equal(claimDailyReset('2026-09-13'), 'earned');
    assert.equal(claimDailyReset('2026-09-13'), 'claimed');
    assert.equal(resetBalance(), 1);
    assert.equal(claimDailyReset('2026-09-14'), 'earned');
    assert.equal(resetBalance(), 2);
    assert.equal(claimDailyReset('bad'), 'unavailable');
    saveTypingRecord('typing-test', { correct: 10, words: 2, wpm: 30 });
    saveTypingRecord('typing-test', { correct: 9, words: 1, wpm: 90 });
    assert.equal(readRecord('typing-test', isTypingRecord)?.correct, 10);
    saveTypingRecord('typing-test', { correct: 10, words: 2, wpm: 40 });
    assert.equal(readRecord('typing-test', isTypingRecord)?.wpm, 40);
    fail = true;
    assert.equal(claimDailyReset('2026-09-15'), 'unavailable');
    assert.equal(resetBalance(), 2);
    assert.equal(saveTypingRecord('typing-test', { correct: 11, words: 2, wpm: 40 }), false);
    assert.equal(isTypingRecord({ correct: -1, words: 2, wpm: 3 }), false);
    assert.equal(isScore(101), false);
    assert.equal(isScore(NaN), false);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor); else Reflect.deleteProperty(globalThis, 'localStorage');
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor); else Reflect.deleteProperty(globalThis, 'window');
  }
});

test('circle targets reach every edge region of the wide board without clipping', () => {
  const targets = Array.from({ length: 1000 }, (_, index) => circleTarget(`wide:${index}`, CIRCLE_BOARD_ASPECT));
  for (const target of targets) {
    assert.ok(target.x - target.radius / CIRCLE_BOARD_ASPECT >= 0);
    assert.ok(target.x + target.radius / CIRCLE_BOARD_ASPECT <= 1);
    assert.ok(target.y - target.radius >= 0 && target.y + target.radius <= 1);
  }
  assert.ok(targets.some(target => target.x < .2));
  assert.ok(targets.some(target => target.x > .8));
  assert.ok(targets.some(target => target.y < .2));
  assert.ok(targets.some(target => target.y > .8));
});
test('wide-board scoring gives equal physical horizontal and vertical errors equal scores', () => {
  const target = { x: .5, y: .5, radius: .2 };
  const horizontal = scoreCircle(target, { ...target, x: .5 + .1 / CIRCLE_BOARD_ASPECT }, CIRCLE_BOARD_ASPECT);
  const vertical = scoreCircle(target, { ...target, y: .6 }, CIRCLE_BOARD_ASPECT);
  assert.deepEqual(horizontal, vertical);
  const constrained = constrainCircle({ x: .9, y: .5, radius: .8 }, CIRCLE_BOARD_ASPECT);
  assert.ok(Math.abs(constrained.radius - .1 * CIRCLE_BOARD_ASPECT) < 1e-10);
});

test('new circle attempts use fresh targets even on the same day', () => {
  let sequence = 0;
  const uuid = mock.method(globalThis.crypto, 'randomUUID', () => `00000000-0000-4000-8000-${String(++sequence).padStart(12, '0')}`);
  try {
    const first = circleTarget();
    const second = circleTarget();
    assert.notDeepEqual({ x: first.x, y: first.y }, { x: second.x, y: second.y });
    assert.notEqual(first.radius, second.radius);
    const targets = Array.from({ length: 1000 }, () => circleTarget());
    for (const target of targets) {
      assert.ok(target.x - target.radius > 0 && target.x + target.radius < 1);
      assert.ok(target.y - target.radius > 0 && target.y + target.radius < 1);
    }
    for (const xSide of [false, true]) for (const ySide of [false, true]) {
      assert.ok(targets.some(target => (target.x < .5) === xSide && (target.y < .5) === ySide));
    }
    assert.ok(targets.some(target => target.x < .2) && targets.some(target => target.x > .8));
    assert.ok(targets.some(target => target.y < .2) && targets.some(target => target.y > .8));
  } finally { uuid.mock.restore(); }
});

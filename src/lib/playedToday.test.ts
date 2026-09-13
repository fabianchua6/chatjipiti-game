import test from 'node:test';
import assert from 'node:assert/strict';
import { markPlayed, wasPlayedToday } from './playedToday.ts';

function storage(t: test.TestContext) {
  const values = new Map<string, string>();
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  } });
  t.after(() => {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  });
  return values;
}

test('actual play is per game and resets at UTC midnight', t => {
  const values = storage(t);
  const before = new Date('2031-01-02T07:59:59+08:00');
  assert.equal(wasPlayedToday('memory', before), false);
  markPlayed('memory', before);
  markPlayed('memory', before);
  assert.equal(values.size, 1);
  assert.equal(values.get('chatjipiti:v2:played:2031-01-01:memory'), 'played');
  assert.equal(wasPlayedToday('memory', before), true);
  assert.equal(wasPlayedToday('typing', before), false);
  assert.equal(wasPlayedToday('memory', new Date('2031-01-02T08:00:00+08:00')), false);
});

test('valid legacy daily scores count, including zero and any memory board size', t => {
  const values = storage(t);
  const now = new Date('2031-02-02T12:00:00Z');
  values.set('chatjipiti:v1:memory:daily:2031-02-02:6', JSON.stringify({ seconds: 40, moves: 25 }));
  values.set('chatjipiti:v2:typing:daily:2031-02-02', JSON.stringify({ correct: 1, words: 0, wpm: 12 }));
  values.set('chatjipiti:v2:circle:daily:2031-02-02', '0');
  for (const game of ['memory', 'typing', 'circle'] as const) assert.equal(wasPlayedToday(game, now), true);
});

test('corrupt markers, invalid scores and undated practice records are ignored', t => {
  const values = storage(t);
  const now = new Date('2031-03-02T12:00:00Z');
  values.set('chatjipiti:v2:played:2031-03-02:memory', 'true');
  values.set('chatjipiti:v1:memory:daily:2031-03-02:3', '{broken');
  values.set('chatjipiti:v2:typing:daily:2031-03-02', JSON.stringify({ correct: -1, words: 0, wpm: 0 }));
  values.set('chatjipiti:v2:circle:daily:2031-03-02', '101');
  values.set('chatjipiti:v2:circle:daily:2031-03-01', '100');
  values.set('chatjipiti:v2:circle:practice:all', '100');
  for (const game of ['memory', 'typing', 'circle'] as const) assert.equal(wasPlayedToday(game, now), false);
});

test('saved markers from another tab are visible and denied storage keeps session play', t => {
  const values = storage(t);
  const now = new Date('2031-04-02T12:00:00Z');
  values.set('chatjipiti:v2:played:2031-04-02:typing', 'played');
  assert.equal(wasPlayedToday('typing', now), true);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Denied'); } });
  assert.equal(wasPlayedToday('circle', now), false);
  assert.doesNotThrow(() => markPlayed('circle', now));
  assert.equal(wasPlayedToday('circle', now), true);
  assert.equal(wasPlayedToday('circle', new Date('2031-04-03T12:00:00Z')), false);
});

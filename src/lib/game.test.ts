import test from 'node:test';
import assert from 'node:assert/strict';
import { BOARD_SIZES, dailySeed, makeBoard, isBetter, readBest, saveBest } from './game.ts';

test('every level has pairs plus exactly one blank on odd boards', () => {
  for (const size of BOARD_SIZES) {
    const board = makeBoard(size, 'fixture');
    assert.equal(board.length, size * size);
    assert.equal(board.filter(card => card === null).length, size % 2);
    for (const face of new Set(board.filter(card => card !== null))) {
      assert.equal(board.filter(card => card === face).length, 2);
    }
  }
});
test('daily layout is reproducible and changes between challenges', () => {
  assert.deepEqual(makeBoard(6, '2026-09-13'), makeBoard(6, '2026-09-13'));
  assert.notDeepEqual(makeBoard(6, '2026-09-13'), makeBoard(6, '2026-09-14'));
});
test('daily date uses UTC across timezone boundaries', () => {
  assert.equal(dailySeed(new Date('2026-09-14T01:00:00+08:00')), '2026-09-13');
});
test('completion time ranks first; moves break ties', () => {
  assert.ok(isBetter({ seconds: 10, moves: 20 }, { seconds: 11, moves: 5 }));
  assert.ok(isBetter({ seconds: 10, moves: 9 }, { seconds: 10, moves: 10 }));
  assert.equal(isBetter({ seconds: 11, moves: 2 }, { seconds: 10, moves: 10 }), false);
});

test('score storage tolerates malformed values and unavailable reads/writes', () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  let raw: string | null = null;
  let failRead = false;
  let failWrite = false;
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: () => { if (failRead) throw new Error('blocked'); return raw; },
    setItem: (_key: string, value: string) => { if (failWrite) throw new Error('quota'); raw = value; },
  } });
  try {
    for (const invalid of ['{broken', 'null', '{}', '{"seconds":-1,"moves":3}', '{"seconds":4,"moves":1.5}', '{"seconds":"4","moves":2}', '{"seconds":1e999,"moves":2}']) {
      raw = invalid; assert.equal(readBest('test'), null);
    }
    raw = null;
    assert.equal(saveBest('test', { seconds: 12, moves: 7 }), true);
    assert.deepEqual(readBest('test'), { seconds: 12, moves: 7 });
    saveBest('test', { seconds: 20, moves: 4 });
    assert.deepEqual(readBest('test'), { seconds: 12, moves: 7 });
    failWrite = true;
    assert.equal(saveBest('test', { seconds: 10, moves: 7 }), false);
    failRead = true;
    assert.equal(readBest('test'), null);
    assert.equal(saveBest('test', { seconds: 10, moves: 7 }), false);
  } finally {
    if (descriptor) Object.defineProperty(globalThis, 'localStorage', descriptor);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

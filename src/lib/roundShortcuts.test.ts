import test from 'node:test';
import assert from 'node:assert/strict';
import { roundShortcut } from './roundShortcuts.ts';

const key = (value: string, extras = {}) => ({ key: value, code: value === ' ' ? 'Space' : value, repeat: false, defaultPrevented: false, isComposing: false, metaKey: false, ctrlKey: false, altKey: false, shiftKey: false, ...extras });
test('finished rounds consistently use Space to restart and Enter for the next game', () => {
  assert.equal(roundShortcut(key(' '), true), 'restart');
  assert.equal(roundShortcut(key('Enter'), true), 'next-game');
  assert.equal(roundShortcut(key('r'), true), null);
});
test('round shortcuts preserve active typing, card flips and circle submission', () => {
  for (const value of [' ', 'Enter', 'r']) assert.equal(roundShortcut(key(value), false), null);
});
test('held keys, composition, handled events and modified chords cannot restart or navigate', () => {
  for (const flag of ['repeat', 'defaultPrevented', 'isComposing', 'metaKey', 'ctrlKey', 'altKey', 'shiftKey']) {
    for (const value of [' ', 'Enter']) assert.equal(roundShortcut(key(value, { [flag]: true }), true), null);
  }
});
